# NOVA Audio Fix Package

This package ensures your intro audio works on Vercel with correct paths and autoplay behavior (with user-gesture unlock for iOS/Safari).

## What’s inside
- `public/assets/audio/` — put **intro.mp3** here (lowercase name). The `.gitkeep` is just to keep the folder — delete it after adding your file.
- `index.html` — sample landing page wired to play `/assets/audio/intro.mp3`.
- `js/main.js` — robust play logic (tries autoplay; guarantees play on first tap/click/keydown).
- `vercel.json` — small quality-of-life redirects + long-term caching for the audio.

## Steps
1. Copy **public/**, **js/**, **index.html**, and **vercel.json** into the root of your repo.
   - If your repo already has `index.html` and `js/main.js`, merge the audio bits into your files or replace as needed.
2. Put your real audio at: `public/assets/audio/intro.mp3` (exact name, lowercase).
3. Commit → redeploy on Vercel.
4. Test in the browser:
   - `https://meetnovanow.com/assets/audio/intro.mp3` should play/download (no 404).
   - Then load `https://meetnovanow.com/` and tap/click once if needed — audio should play reliably on all devices.

## Notes
- Browsers may block autoplay with sound until a gesture. The provided script listens for click/touch/keydown to unlock audio.
- If you want to navigate to `traits.html` once audio begins, add that navigation in `main.js` after `audio.play()` resolves.
