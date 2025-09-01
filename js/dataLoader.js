export async function loadOOH(snapshotPath) {
  try {
    // 1) Load snapshot immediately
    const snap = await fetch(snapshotPath, { cache: 'no-store' }).then(r => r.json());
    let data = validateOOH(snap) ? snap : null;

    // 2) Non-blocking attempt to fetch freshest
    try {
      const latest = await fetch('/api/ooh-latest', { cache: 'no-store' });
      if (latest.ok) {
        const j = await latest.json();
        if (validateOOH(j)) data = j;
      }
    } catch {}

    return data || { version: 'snapshot', occupations: [] };
  } catch {
    return { version: 'fallback', occupations: [] };
  }
}

export function validateOOH(d) {
  return d && d.version && Array.isArray(d.occupations) && d.occupations.length > 0;
}
