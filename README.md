# Sudeep Singh — Portfolio

A **multi-page** portfolio for **Sudeep Singh**, Service Captain and hospitality professional in
New Delhi NCR. A light, dense editorial system: a bone ground, one crimson accent, a bold
grotesque display face. Built with Next.js 16 (App Router) and exported as a fully static site.

Every fact on the site is transcribed from the source documents in the project root: two
Curriculum Vitae pages, three signed employer letters, one Form B1 bar licence and one portrait
photograph. Nothing is invented. No email address, no social profiles, no metrics the documents do
not support.

## Pages

| Route | What it holds |
|---|---|
| `/` | The landing page: hero, a metric strip, the three most recent roles, a preview of the employer letters, and a contact band |
| `/profile` | Portrait, career objective, personal details, strengths, education |
| `/experience` | The full eight-role timeline, with the verified roles badged and quoted |
| `/credentials` | The document gallery: the three signed employer letters lead, the rest sit in a quieter group below |
| `/contact` | Telephone, WhatsApp, address, and the printable CV |
| `/cv` | An A4-optimised Curriculum Vitae, laid out for print |

Every page has its own metadata and canonical URL, and the navigation highlights the current page.

---

## Design system

### Colour

One theme for the whole site, and one crimson. `--accent` does double duty as text and as a fill
(with `--on-accent` sitting on top of it), which is why it is not the value the dark theme needed.
Every ratio below was computed with the WCAG 2.x formula.

```css
--bg:             #F4F3F1;   /* the site ground — a bone, not a cream */
--surface:        #FFFFFF;   /* raised: cards, chips, doc wrappers   */
--surface-sunken: #E7E4E0;   /* sunken: alt bands, thumbnail mats   */

--hairline:        #DCD7D0;  /* decorative rules ONLY                */
--hairline-strong: #8E867C;  /* control borders, 3.24:1             */

--text:        #171412;   /* 16.54:1 on --bg  AAA */
--text-muted:  #5E5751;   /*  6.40:1        AAA */
--text-faint:  #736B64;   /*  4.72:1        AA  */

--accent:       #A50F28;   /* 7.02:1 on --bg; white on it 7.78:1 */
--accent-hover: #7A0A1D;   /* deeper fill for hover states         */
--on-accent:    #FFFFFF;   /* a label placed on an accent fill     */
--accent-deep:  #6B0A1B;   /* the contact band                     */

--wash-1: #FBF0F0;  --wash-2: #F5DFDF;  --wash-3: #EFC7CB;

--paper:      #FFFFFF;    /* the /cv sheet and the document scans */
--paper-alt:  #F2EFEB;
```

The ground is a bone rather than a warm cream, so the page reads architectural instead of
artisanal, and the white surfaces on top of it stay legible without needing a shadow. The `/cv`
route re-declares the paper tones on `.cv-page`, so the sheet stays a document rather than picking
up the page's surfaces.

### Type

**Archivo** for display (variable, `wght` 100-900) and **Manrope** for body (variable, `wght`
200-800), both self-hosted through `next/font/google` at build time. The `wdth` axis is
deliberately not requested: it is inert unless something sets `font-variation-settings`, and it
costs +58 KB on the latin subset. Tightness comes from `letter-spacing` instead. Note that
Archivo's shipped default weight is 600, not 400, so every rule sets an explicit `font-weight`.

The font payload dropped from 335 KB to 168 KB in the move from Fraunces.

### Density

Section padding roughly halved (`8.5rem` → `4.5rem`), display type scaled down, the four-up stat
card grid replaced with a flat metric strip, and hairline-per-row detail lists replaced with
grouped blocks.

### Rules the layout follows

- One radius system: 3px document frames, 6px controls, 10px cards, 14px media frames, pill buttons.
- One accent colour, used identically everywhere.
- No section-number eyebrows, and at most one eyebrow per three sections.
- Section headers are a vertical stack, never a headline beside a floating paragraph.
- No custom mouse cursor; no em-dashes in the copy.

---

## Editing the content

**`lib/data.ts` is the single source of truth.** The pages, the `/cv` route, the metadata and the
JSON-LD schema all read from it. Change a fact there and it updates everywhere, including the
printable CV.

- `personal` — name, contact, address, family and demographic details
- `careerObjective`, `strengths`, `education`, `computerSkills`
- `experience` — the career timeline. `verified: true` adds the **Employer letter on file** badge
  and a pull quote from the employer's letter (`highlight`).
- `documents` — the six scanned documents. **`featured: true` puts a document in the main gallery
  on `/credentials`; `featured: false` files it in the quieter "Other documents on file" group.**
  The three employer letters are featured: they are the documents that verify the career claims.
  The Curriculum Vitae pages are redundant next to the downloadable CV, and the bar licence
  belongs to a third party. `thirdParty: true` adds a neutral badge and a disclaimer so a document
  is never presented as Sudeep's own credential.
- `stats` — every number is countable from the documents above.

The timeline is the **union of both CV pages**. Those CVs were written at different times and list
different jobs, so some tenures overlap; the site says so under the timeline rather than quietly
tidying the history away.

---

## The image pipeline

The eight `WhatsApp Image *.jpeg` scans in the project root are the raw source. They are cleaned up
by `scripts/preprocess_images.py` (Pillow only, no numpy):

| Step | What it does |
|---|---|
| Rotate | The four landscape scans are turned with `Image.Transpose` (a lossless pixel permutation, unlike `rotate()` which resamples and softens the text) |
| Deskew | A projection-profile estimator finds the angle whose row profile has the sharpest transitions |
| Crop | Locates the sheet of paper by counting near-white pixels per row and column, which keeps the wooden table and the coloured fabric out of the frame |
| Grade | Autocontrast, contrast and sharpness. Documents stay neutral white; a warm-tinted "scan" reads as fabricated |
| Portrait | Cropped to 4:5, warm-graded, vignetted, and given two duotone variants: `cream` for the light theme and `dark` for a dark one |
| Export | WebP, 1600px long edge for the lightbox plus a 480px thumbnail for the grid |

The **cream duotone** is what the site uses: it maps the photo onto a warm paper ramp, which pulls
the mustard-yellow sofa out of frame while keeping skin believable. A **dark duotone** is also
generated, for a dark theme: deep ink shadows with crimson in them and warm off-white highlights,
with the crimson stop sitting higher because on a dark ground the deep-shadow band is tiny and the
face itself would turn red.

The script also writes `lib/generated-assets.ts` with the **actual pixel dimensions** of every
output, so `lib/data.ts` can never disagree with the files on disk.

`scripts/images.manifest.json` maps each source scan to its role. Change the mapping there, not in
the code. The script reports any source scan that is not in the manifest: currently
`WhatsApp Image 2026-11-01 at 22.29.23 (1).jpeg`, a cropped duplicate of CV page 1 that is
deliberately unused.

```bash
python3 -m pip install pillow
npm run assets
```

The Open Graph image, favicon and apple icon stay **light**: they are brand furniture outside the
site theme, and a light social card reads better on most platforms.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Next dev server (Turbopack) |
| `npm run build` | Production build → static export in `out/` |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run preview` | Serve the exported `out/` |
| `npm run assets` | Re-run the image pipeline (needs Pillow) |
| `npm run verify` | typecheck → lint → build |

---

## Deploying

The site is a static export (`output: 'export'`), so it can be hosted anywhere that serves files:
GitHub Pages, Netlify, Vercel, S3 + CloudFront, plain nginx.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```

`NEXT_PUBLIC_SITE_URL` is baked into the build and is used for the canonical URL, the Open Graph
image and the sitemap. **Set it before deploying.** Without it the metadata falls back to
`http://localhost:3000`.

With `trailingSlash: true` the export is `out/index.html`, `out/profile/index.html` and so on,
which every static host resolves without rewrite rules.

> `next start` does not work with a static export. Use `npm run preview`, or any static file
> server, against `out/`.

---

## The downloadable CV

"Download CV" opens `/cv`, an A4-optimised sheet rendered from the same `lib/data.ts` as the
site, with a **Print / Save as PDF** button. Because the sheet is generated from live data it can
never drift out of date the way a committed PDF binary does. It prints as exactly one A4 page.

The Form B1 bar licence is deliberately *not* listed on the CV as a personal credential. It appears
only in the web gallery, labelled as a third-party document.

---

## Progressive enhancement

The site is fully readable without JavaScript. Motion writes inline `opacity: 0` and
`transform: translateY(...)` styles into the static HTML, so a `<noscript>` block neutralises them
alongside the reveal system's `data-reveal` attribute, and the stat counters carry a `<noscript>`
fallback with the real figures. The hero's word masks carry the space between the words *outside*
the clipping mask, or the two words run together on one line.

## Notes

- `images.unoptimized` is **required** under a static export: Next.js's image optimiser needs a
  server. The images are pre-sized by the pipeline instead, so `next/image` still emits
  width/height and there is no layout shift.
- `next lint` was removed in Next 16, so linting runs through the ESLint CLI directly.
- Every animation respects `prefers-reduced-motion`. Under reduced motion the curtain does not
  render, the marquee becomes a scrollable list, the reveals appear immediately and the parallax
  is off.
- The grain overlay uses `mix-blend-mode: multiply` at low opacity, which is what gives the bone
  ground a paper texture without muddying the whites.
- `npm audit` reports 8 moderate advisories in the ESLint toolchain (`minimatch` via
  `typescript-eslint`). They are dev-only and the suggested fix would downgrade Next.js, so they
  are left alone.

---

## Project layout

```
app/            layout · template · page · globals.css · fonts · profile/ · experience/
                credentials/ · contact/ · cv/ · robots · sitemap · not-found
components/     providers/ · chrome/ · sections/ · ui/ · cv/
lib/            data.ts (content) · seo.ts (JSON-LD) · hooks.ts · navigation.ts · utils.ts
                generated-assets.ts
scripts/        preprocess_images.py · images.manifest.json · fonts/
public/         img/ · docs/ · favicon.svg · apple-icon.png
```

`app/template.tsx` remounts on every navigation, which is how each page gets its own entrance
animation.

The original scans are left untouched in the project root.
