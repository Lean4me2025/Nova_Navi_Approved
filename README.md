# NOVA + NAVI Integrated (Monthly BLS Updater)

This repository contains a deploy-ready package for NOVA (purpose + traits + careers) and NAVI (conversion: resume/cover letter/tiers), with a **monthly BLS OOH data updater**.

## What’s inside
- `index.html` — intro with audio + Start button
- `traits.html` — 50-trait selection UI
- `navi.html` — simple NAVI conversion page (tiers + CTA)
- `css/styles.css` — unified styling
- `js/main.js` — intro/audio logic + routing
- `js/traits.js` — trait grid + basic flow
- `js/dataLoader.js` — loads embedded snapshot then optional `/api/ooh-latest`
- `data/ooh_snapshot.min.json` — NOVA’s local brain (lean schema)
- `data/traitdata.json` — 50 traits
- `api/cron/bls-ooh-monthly.js` — cron to check BLS & update latest JSON in Vercel Blob
- `api/ooh-latest.js` — serves freshest JSON (or 404 if none yet)
- `vercel.json` — schedules monthly cron on the **last day** at **12:00 UTC**
- `package.json` — serverless dependencies

## Audio
Place your real intro audio at: `assets/audio/intro.mp3` (file name must be exactly `intro.mp3`).  
The app will attempt to autoplay; if blocked, the Start button will play it.

## Deploy (GitHub → Vercel)
1. Create a new GitHub repo and upload this entire folder (as-is).
2. In Vercel, **Import Project** from that repo (Framework: None).
3. Ensure **Cron Jobs** are enabled (Vercel reads `vercel.json` automatically).
4. First deploy is instant; monthly cron will run on the last day of each month at 12:00 UTC.
5. Optional: run the cron on-demand by visiting `/api/cron/bls-ooh-monthly` (requires auth if configured).

## Notes
- NOVA always uses the embedded snapshot first for speed. If `/api/ooh-latest` returns a valid dataset, NOVA uses it **in the same session**; otherwise the snapshot is used.
- The BLS fetch/parse is lean and safe; errors never block the UI.
- You can expand the mapping logic in `api/cron/bls-ooh-monthly.js` to enrich fields as needed.
