import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'public', 'data');
const expectedCities = ['Accra', 'Johannesburg', 'Nairobi'];
const expectedSites = new Set([
  'Accra__James Town', 'Accra__Madina', 'Accra__Old Fadama',
  'Johannesburg__Berea', 'Johannesburg__Diepsloot', 'Johannesburg__Katlehong',
  'Nairobi__Kawangware', 'Nairobi__Kayole', 'Nairobi__Ongata Rongai',
]);
const requiredFiles = [
  'survey_points_public.json',
  'survey_points_public.csv',
  'study_site_metadata.json',
  'city_metadata.json',
  'study_geography_manifest.json',
];
const prohibitedKeyPattern = /(respondent|interviewer|name|timestamp|site_code|case_id|record_id|route|exact)/i;
const prohibitedFilenamePattern = /(respondent|internal|exact|raw.?survey|coordinate.?qa.?example)/i;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(file) {
  return JSON.parse(await readFile(path.join(dataDir, file), 'utf8'));
}

async function walk(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist'].includes(entry)) continue;
    const fullPath = path.join(directory, entry);
    const info = await stat(fullPath);
    if (info.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

for (const file of requiredFiles) {
  await readFile(path.join(dataDir, file));
}

const points = await readJson('survey_points_public.json');
const sites = await readJson('study_site_metadata.json');
const cities = await readJson('city_metadata.json');
const manifest = await readJson('study_geography_manifest.json');

assert(Array.isArray(points) && points.length > 0, 'Public point data is empty.');
assert(points.every((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon)), 'A public point has invalid coordinates.');
assert(points.every((point) => Number.isInteger(point.count) && point.count >= 5), 'Every public point must represent at least five interviews.');
assert(points.every((point) => Object.keys(point).every((key) => !prohibitedKeyPattern.test(key))), 'A prohibited or sensitive field appears in public point data.');
assert(new Set(points.map((point) => point.city)).size === 3, 'Expected exactly three cities.');
assert(expectedCities.every((city) => points.some((point) => point.city === city)), 'One or more expected cities are missing.');
assert(new Set(points.map((point) => `${point.city}__${point.neighbourhood}`)).size === 9, 'Expected exactly nine study neighbourhoods.');
assert([...expectedSites].every((site) => points.some((point) => `${point.city}__${point.neighbourhood}` === site)), 'One or more expected study neighbourhoods are missing.');

const represented = points.reduce((sum, point) => sum + point.count, 0);
assert(represented === 1638, `Expected 1,638 represented interviews; found ${represented}.`);
assert(points.length === 104, `Expected 104 public aggregate points; found ${points.length}.`);
assert(manifest.version === '3.2.0', 'Manifest version must be 3.2.0.');
assert(manifest.counts.public_mapped_interviews === represented, 'Manifest interview total does not match public point data.');
assert(manifest.counts.public_aggregate_points === points.length, 'Manifest point total does not match public point data.');
assert(sites.length === 9, 'Site metadata must contain nine rows.');
assert(cities.length === 3, 'City metadata must contain three rows.');

for (const site of sites) {
  const group = points.filter((point) => point.city === site.city && point.neighbourhood === site.neighbourhood);
  assert(group.reduce((sum, point) => sum + point.count, 0) === site.n_public_mapped_interviews, `Site total mismatch for ${site.neighbourhood}.`);
  assert(group.length === site.n_public_aggregate_points, `Site point-count mismatch for ${site.neighbourhood}.`);
}
for (const city of cities) {
  const group = points.filter((point) => point.city === city.city);
  assert(group.reduce((sum, point) => sum + point.count, 0) === city.n_public_mapped_interviews, `City total mismatch for ${city.city}.`);
  assert(group.length === city.n_public_aggregate_points, `City point-count mismatch for ${city.city}.`);
}

const repoFiles = await walk(root);
const prohibitedFiles = repoFiles
  .map((file) => path.relative(root, file))
  .filter((file) => prohibitedFilenamePattern.test(path.basename(file)));
assert(prohibitedFiles.length === 0, `Prohibited file names found: ${prohibitedFiles.join(', ')}`);

const lock = await readFile(path.join(root, 'package-lock.json'), 'utf8');
assert(!lock.includes('applied-caas-gateway') && !lock.includes('internal.api.openai.org'), 'package-lock.json contains an internal registry reference.');
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const dependencySpecs = [...Object.values(packageJson.dependencies || {}), ...Object.values(packageJson.devDependencies || {})];
assert(dependencySpecs.every((value) => value !== 'latest' && !value.includes('*')), 'Dependencies must be pinned; "latest" and wildcard versions are not allowed.');

console.log(`Release validation passed: ${points.length} aggregate points, ${represented} interviews, 3 cities, 9 neighbourhoods.`);
