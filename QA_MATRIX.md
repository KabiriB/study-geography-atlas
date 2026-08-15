# QA matrix

Automated checks confirm data availability and counts for every selectable geography. Browser-runtime status remains pending until dependencies can be installed in a networked environment.

| View | Interviews represented | Aggregate points | Automated data check | Browser runtime |
|---|---:|---:|---|---|
| Three-city overview | 1,638 | 104 | Pass | Pending |
| Accra · all sites | 577 | 37 | Pass | Pending |
| James Town, Accra | 171 | 8 | Pass | Pending |
| Madina, Accra | 221 | 25 | Pass | Pending |
| Old Fadama, Accra | 185 | 4 | Pass | Pending |
| Johannesburg · all sites | 515 | 15 | Pass | Pending |
| Berea, Johannesburg | 183 | 5 | Pass | Pending |
| Diepsloot, Johannesburg | 164 | 4 | Pass | Pending |
| Katlehong, Johannesburg | 168 | 6 | Pass | Pending |
| Nairobi · all sites | 546 | 52 | Pass | Pending |
| Kawangware, Nairobi | 207 | 15 | Pass | Pending |
| Kayole, Nairobi | 171 | 15 | Pass | Pending |
| Ongata Rongai, Nairobi | 168 | 22 | Pass | Pending |

## Figure presets

| Preset | Contract check | Browser runtime |
|---|---|---|
| Three-city overview | Pass | Pending |
| Accra study sites | Pass | Pending |
| Johannesburg study sites | Pass | Pending |
| Nairobi study sites | Pass | Pending |
| Current selection | Pass | Pending |

## Controls

| Control | Contract check | Browser runtime |
|---|---|---|
| City selector | Pass | Pending |
| Neighbourhood selector | Pass | Pending |
| Quiet grey, light streets, dark context, satellite basemaps | Pass | Pending |
| Fieldwork footprints | Pass | Pending |
| Labels | Pass | Pending |
| Legend | Pass | Pending |
| Figure-mode entry | Pass | Pending |
| Visible figure-mode exit | Pass | Pending |
| Browser Back exit | Pass | Pending |
| Escape-key exit | Pass | Pending |
| PNG export exclusion rules | Pass | Pending |
| HTML-fallback data error handling | Pass | Pending |

## Responsive layout checks

| Viewport | Expected layout | Structural smoke test |
|---|---|---|
| 1440 × 1000 | Two columns; map panel ends after its captions; sidebar remains compact and follows normal page scrolling | Pass |
| 1024 × 900 | Single stacked column; side panel returns to natural page flow | Pass |
| 390 × 844 | Mobile stacked controls and content; responsive map height | Pass |

The smoke test uses the release CSS with representative interface content. Full React/Leaflet browser-runtime QA remains pending until a clean dependency install is possible.
