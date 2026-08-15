# Study Geography Atlas

**Public release v3.2**

The Study Geography Atlas is an interactive fieldwork geography companion to the *Urban Elsewheres* research programme. It shows where survey interviews were conducted across nine study neighbourhoods in Accra, Johannesburg, and Nairobi.

The atlas has a deliberately limited purpose: it situates the research design in urban space. It does not define official neighbourhood boundaries, track individual respondents, or map the wider relations through which residents’ lives extend beyond the fieldwork sites.

That second task belongs to the companion interface, **One Life, Many Geographies**, which visualises aggregated movement histories, household locations, social ties, support relations, and future imaginaries.

## Study sites

| City | Study neighbourhoods |
|---|---|
| Accra | James Town, Madina, Old Fadama |
| Johannesburg | Berea, Diepsloot, Katlehong |
| Nairobi | Kawangware, Kayole, Ongata Rongai |

## Public-release safeguards

The repository contains aggregate geography only:

- no respondent IDs, names, interviewer identifiers, precise timestamps, or raw survey records;
- no exact respondent coordinates;
- five clear city-level coordinate anomalies excluded from the public map;
- locations aggregated to a coarse spatial grid;
- every displayed point represents at least five interviews;
- low-count grid cells merged within the same study neighbourhood;
- fieldwork footprints described as descriptive envelopes, not official boundaries.

See [METHODS_AND_PRIVACY.md](METHODS_AND_PRIVACY.md) and [DATA_MANIFEST.md](DATA_MANIFEST.md) for the complete release logic.

## Run locally

Requirements:

- Node.js 20.19 or later; Node.js 22 is recommended;
- npm 10 or later.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. The application is configured for the GitHub repository name `study-geography-atlas`.

## Validate and build

```bash
npm run validate
npm run build
npm run preview
```

The production build is written to `dist/`. The build also creates `dist/404.html` as a GitHub Pages refresh fallback.

## GitHub Pages deployment

The repository includes `.github/workflows/deploy-pages.yml`.

1. Create a GitHub repository named `study-geography-atlas`.
2. Push this folder to the repository’s `main` branch.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions**.
5. Run the workflow or push a commit to `main`.

Expected public URL:

```text
https://<github-username>.github.io/study-geography-atlas/
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for the complete setup and troubleshooting sequence.

## Navigation and figure export

The interface supports:

- three-city, city, and neighbourhood views;
- four basemaps;
- optional labels, fieldwork footprints, and legend;
- paper-oriented figure presets;
- PNG export;
- an explicit **Back to interactive atlas** control in figure mode.

Browser Back and the Escape key also exit figure mode. The exit control is excluded from PNG exports and print output.

See [USER_GUIDE.md](USER_GUIDE.md) for a concise walkthrough.

## Interpretation

Displayed points are aggregate map anchors, not exact interview locations. Point size reflects the number of interviews represented. Fieldwork-footprint hulls are generated from displayed aggregate geography and should not be interpreted as administrative, legal, or locally agreed neighbourhood boundaries.

The atlas represents 1,638 interviews after public-release coordinate QA. This denominator differs from the 1,623-case analytical sample used in the companion interface because fieldwork geography and analytical cleaning are separate data products. The complete denominator ledger appears in [METHODS_AND_PRIVACY.md](METHODS_AND_PRIVACY.md).

## Citation and attribution

The final scholarly citation, author order, institutional attribution, and software licence remain to be confirmed before publication. Basemap attribution is displayed within the map.

## Repository description

> Interactive public-release atlas of survey fieldwork across nine study neighbourhoods in Accra, Johannesburg, and Nairobi.
