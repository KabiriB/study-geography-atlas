# Audit and QA report

## Original package

The uploaded ZIP was named `study-geography-atlas-v3_2-public-release.zip` and contained a React/Vite source tree, a prebuilt `dist`, data files, release scripts, environment files, and extensive working documentation.

Version evidence was inconsistent: the ZIP and a visual-patch note identified v3.2, while the README, package metadata, and data manifest still identified v2 or 0.2.0.

## Bugs and release risks found

| Finding | Original status | Release action |
|---|---|---|
| No visible way to leave figure mode | Confirmed | Fixed with persistent exit control, browser Back, and Escape |
| Figure controls could appear in exported output | Risk | Exit control placed outside capture frame and marked `no-export`; print-hidden |
| Legacy figure presets | Present | Removed |
| Protected/co-author controls in public source | Present | Removed from public application |
| Internal planning notes and obsolete future-build notes | Present | Removed from public repository |
| Dependencies set to `latest` | Present | Replaced with pinned versions |
| Lockfile used inaccessible internal registry | Present | Rewritten to public npm registry URLs |
| GitHub Pages base used `./` | Present | Set to `/study-geography-atlas/` |
| Undocumented site-distance QA filter | Hid 24 interviews | Removed; documented city-level QA rule retained |
| Public points with counts below five | 793 of 862 groups | Re-aggregated; all 104 release points have count ≥5 |
| Version labels disagreed | Confirmed | Standardised to 3.2.0 |
| Map panel stretched to the longer sidebar, creating a large blank white canvas | Confirmed from release-candidate screenshot | Fixed with top-aligned grid items and intrinsic map-panel height |
| Desktop information panel made the whole page excessively tall | Confirmed | Reworked the sidebar into a compact natural-flow panel with two-column neighbourhood navigation and collapsible interpretation guidance |
| Map height relied on a large fixed minimum | Confirmed | Replaced with responsive `clamp()` heights for desktop, tablet, and mobile |
| Control-bar status resembled a disabled button | Confirmed | Reworked as a compact accessible status pill |
| Raw/analytical/geography denominators unclear | Confirmed | Added denominator ledger |

## Static QA completed

- All five public JSON/CSV data files generated and parsed.
- Three expected cities confirmed.
- Nine expected study neighbourhoods confirmed.
- Public data total confirmed at 1,638 interviews.
- Public aggregate point count confirmed at 104.
- Minimum point count confirmed at five.
- City and neighbourhood metadata totals reconciled with the point file.
- Sensitive field-name scan passed.
- Protected-file-name scan passed.
- Dependency specifications contain no `latest` or wildcard values.
- Lockfile contains no internal OpenAI registry references.
- Vite data loading uses `import.meta.env.BASE_URL`.
- Missing JSON/HTML fallback detection is implemented.
- Desktop grid items are explicitly top-aligned, preventing the map panel from stretching to the sidebar height.
- The sidebar now uses natural page scrolling at every breakpoint; detailed interpretation material is available in a compact disclosure panel.
- Responsive map-height contracts are present for desktop, tablet, and mobile breakpoints.
- A static browser layout smoke test at 1440×1000, 1024×900, and 390×844 confirmed the intended desktop two-column and smaller-screen stacked behaviours.

## Interaction QA matrix prepared

The interface contains controls for:

- the three-city overview;
- Accra, Johannesburg, and Nairobi;
- all nine neighbourhoods;
- four basemaps;
- labels, legend, and fieldwork footprints;
- five figure presets;
- map zoom and pan;
- PNG export;
- figure-mode return;
- browser Back and Escape-key return.

## Verification still required on a networked development machine

A clean `npm ci`, production build, browser interaction pass, and live GitHub Pages deployment must be run in an environment with access to the public npm registry and basemap tile services. The current execution environment could not resolve the public npm registry and the uploaded lockfile’s internal registry returned 404 responses. The repository has been repaired for a normal public npm environment, but that external clean-install test has not been falsely marked as complete.
