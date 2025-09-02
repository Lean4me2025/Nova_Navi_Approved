# NOVA Brain Fix (Starter)

This bundle wires your traits → purpose matching so users see actual results before moving into NAVI.

## What’s included
- `public/data/ooh_brain.json` — starter dataset mapping traits → purpose fields → example careers.
- `js/traits.js` — collects selected traits, scores purpose fields, stores results, and redirects to `results.html`.
- `results.html` — simple page that displays top matches and example careers; offers links to adjust traits or continue to NAVI.

## Assumptions (selectors)
- Each trait chip has class `.trait` and `data-code="ANALYTICAL"` etc.
- When selected, the chip gets class `.selected` (toggle).
- The "Next" button on `traits.html` has id `nextBtn` (or add `data-next` attribute).

If your HTML uses different classes or ids, you can either:
- Add `id="nextBtn"` to your existing Next button, and ensure trait chips have `.trait` and `data-code="..."` plus `.selected` when active.
- Or temporarily open `results.html` directly to see scoring behavior after using any page that writes to `localStorage.novaResults`.

## How it works
1. User selects traits on `traits.html`.
2. Clicking Next triggers `js/traits.js` to load `/data/ooh_brain.json`, compute scores, store `localStorage.novaResults`, and navigate to `/results.html`.
3. `results.html` reads from `localStorage` and shows top purpose fields and sample careers.

## Install
1. Upload these files to your repo:
   - `public/data/ooh_brain.json`
   - `js/traits.js` (replace existing if present)
   - `results.html` (new page)
2. Commit → redeploy on Vercel.

## Test
- Select several traits on `traits.html` → click Next.
- You should land on `results.html` with a list of purpose matches.
- Click "Continue to NAVI →" when ready.

## Next (full brain)
- Replace `public/data/ooh_brain.json` with your merged OOH dataset when ready.
- We can switch scoring to cosine similarity with normalized vectors and SOC-specific weights.
