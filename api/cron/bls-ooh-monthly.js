// /api/cron/bls-ooh-monthly.js
import { put, get } from '@vercel/blob';
import { XMLParser } from 'fast-xml-parser';

const BLS_URL = 'https://www.bls.gov/ooh/xml-compilation.xml';
const BLOB_KEY = 'ooh_latest.json';
const META_KEY = 'ooh_latest_meta.json';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  try {
    // Read current meta (if any)
    const currentMeta = await readJsonBlob(META_KEY);

    // HEAD check
    const head = await fetch(BLS_URL, { method: 'HEAD' });
    const lastModified = head.headers.get('last-modified');
    const etag = head.headers.get('etag');

    const unchanged =
      currentMeta &&
      ((lastModified && lastModified === currentMeta.lastModified) ||
       (etag && etag === currentMeta.etag));

    if (unchanged) {
      return res.status(200).json({ status: 'no_change' });
    }

    // Fetch + parse XML
    const xml = await fetch(BLS_URL).then(r => r.text());
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const root = parser.parse(xml);

    const occupations = mapOOH(root);

    const payload = {
      version: inferEdition(root),
      generated_at: new Date().toISOString(),
      occupations
    };

    await put(BLOB_KEY, JSON.stringify(payload), { contentType: 'application/json', addRandomSuffix: false });
    await put(META_KEY, JSON.stringify({ lastModified, etag, version: payload.version }), { contentType: 'application/json', addRandomSuffix: false });

    return res.status(200).json({ status: 'updated', version: payload.version, count: occupations.length });
  } catch (e) {
    return res.status(500).json({ error: 'cron_failed', detail: String(e) });
  }
}

async function readJsonBlob(name) {
  try {
    const blob = await get(name);
    if (!blob) return null;
    return await blob.json();
  } catch { return null; }
}

function inferEdition(root) {
  // Try to detect edition; fallback to current year
  return new Date().getFullYear() + '.0';
}

function mapOOH(root) {
  // Minimal defensive mapper — adjust based on actual XML layout when available.
  // The OOH XML groups occupations under root.ooh.occupation (varies by edition).
  const items = [];
  const occs = deepFindArray(root, 'occupation');
  if (Array.isArray(occs)) {
    for (const occ of occs) {
      items.push({
        soc: occ.soc || occ.SOC || occ.code || null,
        title: occ.title || occ.name || null,
        summary: (occ.brief || occ.summary || '').toString().slice(0, 600),
        median_pay: safeNumber(deepFind(occ, 'median_pay')),
        education: deepFind(occ, 'education') || null,
        outlook: deepFind(occ, 'outlook') || null,
        growth_pct: safeNumber(deepFind(occ, 'growth_pct')),
        ooh_url: deepFind(occ, 'ooh_url') || null
      });
    }
  }
  return items.filter(x => x.title);
}

function deepFind(obj, key) {
  if (!obj || typeof obj !== 'object') return null;
  if (key in obj) return obj[key];
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    if (val && typeof val === 'object') {
      const found = deepFind(val, key);
      if (found !== null && found !== undefined) return found;
    }
  }
  return null;
}

function deepFindArray(obj, key) {
  const res = [];
  (function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach(walk);
    if (o[key]) {
      if (Array.isArray(o[key])) res.push(...o[key]);
      else res.push(o[key]);
    }
    for (const k of Object.keys(o)) walk(o[k]);
  })(obj);
  return res;
}

function safeNumber(v) {
  const n = Number(String(v||'').replace(/[^0-9.-]/g,''));
  return Number.isFinite(n) ? n : null;
}
