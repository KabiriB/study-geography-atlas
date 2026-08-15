import { readFile } from 'node:fs/promises';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = await readFile('src/App.jsx', 'utf8');
const css = await readFile('src/styles.css', 'utf8');
const vite = await readFile('vite.config.js', 'utf8');
const points = JSON.parse(await readFile('public/data/survey_points_public.json', 'utf8'));

const expectedPresetKeys = [
  'paper-overview',
  'paper-accra',
  'paper-johannesburg',
  'paper-nairobi',
  'paper-current-plate',
];
const expectedBasemaps = ['carto', 'light', 'dark', 'satellite'];
const expectedSites = [
  ['Accra', 'James Town'], ['Accra', 'Madina'], ['Accra', 'Old Fadama'],
  ['Johannesburg', 'Berea'], ['Johannesburg', 'Diepsloot'], ['Johannesburg', 'Katlehong'],
  ['Nairobi', 'Kawangware'], ['Nairobi', 'Kayole'], ['Nairobi', 'Ongata Rongai'],
];

for (const key of expectedPresetKeys) assert(app.includes(`key: '${key}'`), `Missing figure preset: ${key}`);
for (const key of expectedBasemaps) assert(app.includes(`  ${key}: {`), `Missing basemap: ${key}`);
for (const [city, site] of expectedSites) {
  const rows = points.filter((point) => point.city === city && point.neighbourhood === site);
  assert(rows.length > 0, `No public geography for ${site}, ${city}.`);
  assert(rows.reduce((sum, point) => sum + point.count, 0) > 0, `No represented interviews for ${site}, ${city}.`);
}

assert(app.includes('Back to interactive atlas'), 'Figure mode lacks a visible exit label.');
assert(app.includes('className="figureExit no-export"'), 'Figure exit control is not marked as non-exportable.');
assert(app.includes("window.addEventListener('popstate'"), 'Browser Back handling is missing.');
assert(app.includes("event.key === 'Escape'"), 'Escape-key handling is missing.');
assert(css.includes('.exporting .figureExit { display: none !important; }'), 'Figure exit control is not hidden during PNG export.');
assert(css.includes('.figureMode .controls'), 'Figure-mode layout rule is missing.');
assert(css.includes('align-items: start;'), 'Desktop grid must prevent the map panel from stretching to the sidebar height.');
assert(css.includes('.mapPanel { padding: 16px; min-width: 0; align-self: start; }'), 'Map panel must size to its own content.');
assert(css.includes('position: static;') && css.includes('max-height: none;') && css.includes('overflow: visible;'), 'The side panel must use natural document flow without a nested scrollbar.');
assert(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr));'), 'Desktop neighbourhood navigation must use a compact two-column grid.');
assert(app.includes('<details className="methodDetails">'), 'Detailed interpretation guidance must be available without inflating the default sidebar.');
assert(css.includes('height: clamp(520px, 61vh, 690px);'), 'Interactive map height must be responsive and compact.');
assert(app.includes('import.meta.env.BASE_URL'), 'Data paths are not based on the Vite deployment base.');
assert(app.includes('Expected JSON') && app.includes('received HTML'), 'HTML fallback detection is missing.');
assert(vite.includes("base: '/study-geography-atlas/'"), 'GitHub Pages base path is incorrect.');
assert(!/Legacy ·|Co-author QA|Internal exact|exact survey coordinate/i.test(app), 'Protected or legacy interface wording remains in the public app.');

console.log('Interface contract QA passed: 5 figure presets, 4 basemaps, 3 cities, 9 neighbourhoods, explicit figure-mode return controls, compact controls, natural sidebar flow, and responsive non-stretching layout rules.');
