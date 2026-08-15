# Deployment guide

## Repository requirements

Use the repository name:

```text
study-geography-atlas
```

The Vite base path is configured as:

```js
base: '/study-geography-atlas/'
```

Changing the repository name requires changing the base path in `vite.config.js` before building.

## Local verification

Use Node.js 22 where possible.

```bash
npm ci
npm run validate
npm run build
npm run preview
```

Verify the preview URL printed by Vite, including the repository subdirectory. Test:

- the application shell;
- all data files;
- city and neighbourhood selectors;
- all figure presets;
- figure-mode exit;
- browser Back and Escape from figure mode;
- PNG export;
- refresh at the deployed root URL.

## Create the GitHub repository

1. Sign in to GitHub.
2. Select **New repository**.
3. Enter `study-geography-atlas` as the repository name.
4. Use this description:

   > Interactive public-release atlas of survey fieldwork across nine study neighbourhoods in Accra, Johannesburg, and Nairobi.

5. Choose public or private visibility according to the co-authors’ release decision.
6. Do not initialise with a README, licence, or `.gitignore`; these files already exist locally.
7. Create the repository.

## Push the prepared files

From the project folder:

```bash
git init
git add .
git commit -m "Prepare Study Geography Atlas v3.2 public release"
git branch -M main
git remote add origin https://github.com/<github-username>/study-geography-atlas.git
git push -u origin main
```

## Enable GitHub Pages

1. Open the repository on GitHub.
2. Select **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Open the **Actions** tab.
5. Run **Deploy Study Geography Atlas**, or push a new commit to `main`.
6. Confirm that the build, validation, artifact upload, and deployment jobs all pass.

Expected URL:

```text
https://<github-username>.github.io/study-geography-atlas/
```

## Post-deployment checks

Open the public URL in a private browser window and verify:

- no authentication or local file dependency is required;
- the map loads under the repository subdirectory;
- JSON requests return JSON rather than the HTML fallback page;
- all nine neighbourhoods are available;
- the figure-mode exit control is visible;
- the exit control is absent from PNG exports and print output;
- map attribution is visible;
- page refresh returns the application.

## Troubleshooting

### The page is blank or assets return 404

Confirm that the repository is named `study-geography-atlas` and that `vite.config.js` uses `/study-geography-atlas/` as its base.

### A JSON request returns HTML

Confirm that the required files are present in `public/data/`. The application detects HTML fallback responses and displays a data-loading error instead of attempting to parse them as JSON.

### GitHub Actions cannot install dependencies

Confirm that `package-lock.json` contains public `registry.npmjs.org` references and that no organisation-level npm configuration redirects the workflow to an unavailable registry.

### The PNG lacks a basemap

Wait for map tiles to load, switch to the quiet grey basemap, and retry. Browser security rules governing third-party tile capture are outside the application’s control.
