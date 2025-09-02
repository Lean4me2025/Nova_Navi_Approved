
# NOVA – Final All-In-One

This bundle includes:
- Intro with **real audio** and **synced scrolling text**
- Traits → Results → NAVI flow
- Results page with **Print / Save PDF**
- Starter brain JSON at `public/ooh_brain.json`
- `vercel.json` with **root redirect** so `/` always serves `index.html`
- `404.html` safety that redirects to `/`

## Deploy on Vercel (avoid 404s)
1) Project → **Settings → Build & Output**
- Framework Preset: **Other**
- Build Command: *(leave empty)*
- Output Directory: *(leave empty)*

2) Project → **Settings → Domains**
- Add/ensure `meetnovanow.com` is attached and shows **Valid Configuration**

3) Push these files to repo root. Vercel auto-deploys.

## Update the transcript
Edit `NOVA_TRANSCRIPT` in `js/main.js` to the exact words of your audio.
