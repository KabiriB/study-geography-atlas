# Changelog

## 3.2.0 — Public GitHub release

### Fixed

- Added a persistent **Back to interactive atlas** control in every figure layout.
- Added browser Back and Escape-key handling for figure mode.
- Preserved the selected geography when returning to the interactive interface.
- Ensured figure-mode navigation controls are excluded from PNG export and print output.
- Added clear errors when a data path returns HTML instead of JSON.
- Removed the undocumented site-distance QA rule that conflicted with the published coordinate-QA description.
- Removed the oversized blank canvas caused by the map panel stretching to the height of the longer sidebar.
- Added a more compact responsive map height and removed the nested desktop scrollbar; neighbourhood navigation now uses a two-column grid and methods guidance is collapsible.
- Restored natural stacked-page flow for tablet and mobile layouts.
- Recast the control-bar view indicator as a compact status label rather than a disabled-looking control.

### Privacy

- Removed all protected-mode controls and source references from the public application.
- Excluded five clear city-level coordinate anomalies from the public release.
- Re-aggregated public geography to 104 display anchors.
- Enforced a minimum of five interviews per displayed point.
- Removed exact-coordinate, respondent-level, and internal-development files from the repository package.

### Documentation

- Standardised the release identity as v3.2.0.
- Rewrote public-facing text for scholarly clarity and methodological caution.
- Added user, methods/privacy, deployment, data-manifest, audit/QA, and decision records.
- Documented the 1,644, 1,643, 1,638, and 1,623 denominators.

### Build and deployment

- Pinned dependency versions.
- Replaced internal package-registry references with public npm registry URLs.
- Configured the GitHub Pages base path.
- Added release validation and a GitHub Pages deployment workflow.
- Added a Pages refresh fallback.

- Added clearer spacing between the main Atlas title and its introductory text.
