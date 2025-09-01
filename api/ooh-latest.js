// /api/ooh-latest.js
import { get } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const blob = await get('ooh_latest.json');
    if (!blob) return res.status(404).json({ error: 'no_latest' });
    const json = await blob.json();
    return res.status(200).json(json);
  } catch (e) {
    return res.status(404).json({ error: 'no_latest' });
  }
}
