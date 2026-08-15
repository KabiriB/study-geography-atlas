# Deployment checklist

## Before upload

- [ ] Co-authors approve the strengthened aggregate geography.
- [ ] Citation, author order, affiliations, and licence are confirmed.
- [ ] Repository name is exactly `study-geography-atlas`.
- [ ] `npm ci` succeeds on a networked machine.
- [ ] `npm run validate` passes.
- [ ] `npm run qa` passes.
- [ ] `npm run build` succeeds.
- [ ] `npm run preview` loads the site under `/study-geography-atlas/`.

## Browser QA

- [ ] Three-city overview loads.
- [ ] Accra and its three neighbourhoods load.
- [ ] Johannesburg and its three neighbourhoods load.
- [ ] Nairobi and its three neighbourhoods load.
- [ ] All four basemaps load and attribution remains visible.
- [ ] Fieldwork footprints, labels, and legend toggle correctly.
- [ ] All five figure presets work.
- [ ] **Back to interactive atlas** exits every figure preset.
- [ ] Browser Back exits figure mode.
- [ ] Escape exits figure mode.
- [ ] Selected geography is preserved after exit.
- [ ] PNG export completes.
- [ ] Exit and interface controls are absent from PNG and print output.
- [ ] Mobile-width figure exit remains visible.

## Privacy

- [ ] `npm run validate` reports 104 aggregate points and 1,638 interviews.
- [ ] Every displayed point represents at least five interviews.
- [ ] No exact, internal, respondent-level, raw, or protected files are present.
- [ ] Public popups contain aggregate counts only.

## GitHub Pages

- [ ] Repository files are pushed to `main`.
- [ ] Settings → Pages → Source is set to **GitHub Actions**.
- [ ] Deployment workflow passes.
- [ ] Public URL loads: `https://<github-username>.github.io/study-geography-atlas/`.
- [ ] Refreshing the public URL returns the application.
- [ ] Data requests return JSON, not HTML fallback pages.
