import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import html2canvas from 'html2canvas';

const CITY_ORDER = ['Accra', 'Johannesburg', 'Nairobi'];

const BASEMAPS = {
  carto: {
    label: 'Quiet grey',
    use: 'A restrained base for interpretation, figures, and presentations',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
   attribution: '&copy; OpenStreetMap contributors',
  },
  light: {
    label: 'Light streets',
    use: 'Useful when local street context matters',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  dark: {
    label: 'Dark context',
    use: 'Useful for projected presentations and high-contrast viewing',
    url: url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    label: 'Satellite',
    use: 'Useful for visual orientation; not an analytical boundary layer',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
};

const CITY_COLORS = {
  Accra: '#c78318',
  Johannesburg: '#1f6f8b',
  Nairobi: '#5f8f4c',
};

const SITE_COLORS = {
  'James Town': '#af5d3b',
  Madina: '#d99b1f',
  'Old Fadama': '#8c6a36',
  Berea: '#276f8c',
  Diepsloot: '#88b8ca',
  Katlehong: '#526f7d',
  Kawangware: '#75a357',
  Kayole: '#a9ca77',
  'Ongata Rongai': '#477944',
};

const SITE_LABEL_OFFSETS = {
  'Accra__James Town': [-48, -12],
  'Accra__Old Fadama': [52, -12],
  'Accra__Madina': [0, -12],
};

const CITY_CONTEXT = {
  Accra: 'The Accra sites connect central and northern parts of the city: James Town, Old Fadama, and Madina. The city view shows the spatial separation and differing fieldwork footprints of these three study geographies.',
  Johannesburg: 'The Johannesburg sites span inner-city Berea, northern Diepsloot, and south-eastern Katlehong. The city view makes this metropolitan spread visible before neighbourhood-level interpretation begins.',
  Nairobi: 'The Nairobi sites extend across Kawangware, Kayole, and Ongata Rongai. The city view situates these western, eastern, and southern study geographies within the wider metropolitan area.',
};

const FIGURE_PRESETS = [
  { key: 'custom', label: 'Manual / exploratory view' },
  { key: 'paper-overview', label: 'Figure 1A · Three-city overview', city: 'All', neighbourhood: 'All', basemap: 'carto' },
  { key: 'paper-accra', label: 'Figure 1B · Accra study sites', city: 'Accra', neighbourhood: 'All', basemap: 'carto' },
  { key: 'paper-johannesburg', label: 'Figure 1C · Johannesburg study sites', city: 'Johannesburg', neighbourhood: 'All', basemap: 'carto' },
  { key: 'paper-nairobi', label: 'Figure 1D · Nairobi study sites', city: 'Nairobi', neighbourhood: 'All', basemap: 'carto' },
  { key: 'paper-current-plate', label: 'Figure 1E · Current selection', basemap: 'carto' },
];

function getSiteLabelOffset(city, neighbourhood) {
  return SITE_LABEL_OFFSETS[`${city}__${neighbourhood}`] || [0, -8];
}

function boundsFromPoints(points, fallback = [[-34.5, -18.5], [7.5, 39.5]], padding = 0.012) {
  const valid = points.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));
  if (!valid.length) return fallback;
  const lats = valid.map((point) => point.lat);
  const lons = valid.map((point) => point.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const latPad = Math.max((maxLat - minLat) * 0.22, padding);
  const lonPad = Math.max((maxLon - minLon) * 0.22, padding);
  return [[minLat - latPad, minLon - lonPad], [maxLat + latPad, maxLon + lonPad]];
}

function normalizeBounds(bounds, padding = 0.008) {
  if (!Array.isArray(bounds) || bounds.length !== 4) return [[-35, -20], [10, 55]];
  const [minLat, minLon, maxLat, maxLon] = bounds;
  const latPad = Math.max((maxLat - minLat) * 0.22, padding);
  const lonPad = Math.max((maxLon - minLon) * 0.22, padding);
  return [[minLat - latPad, minLon - lonPad], [maxLat + latPad, maxLon + lonPad]];
}

function convexHull(points) {
  const unique = Array.from(
    new Map(points.map((point) => [`${point.lon.toFixed(6)},${point.lat.toFixed(6)}`, point])).values(),
  );
  if (unique.length < 3) return unique.map((point) => [point.lat, point.lon]);

  const sorted = unique
    .map((point) => ({ x: point.lon, y: point.lat }))
    .sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
  const cross = (origin, a, b) => (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
  const lower = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper = [];
  for (let index = sorted.length - 1; index >= 0; index -= 1) {
    const point = sorted[index];
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), point) <= 0) upper.pop();
    upper.push(point);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1)).map((point) => [point.y, point.x]);
}

function weightedCenter(points) {
  if (!points.length) return null;
  const total = points.reduce((sum, point) => sum + point.count, 0);
  return [
    points.reduce((sum, point) => sum + point.lat * point.count, 0) / total,
    points.reduce((sum, point) => sum + point.lon * point.count, 0) / total,
  ];
}

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [34, 34], animate: true, duration: 0.55 });
  }, [map, bounds]);
  return null;
}

function MapResizer({ trigger }) {
  const map = useMap();
  useEffect(() => {
    const timers = [80, 260, 620].map((delay) => window.setTimeout(() => map.invalidateSize(), delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [map, trigger]);
  return null;
}

function MapLabel({ position, offset = [0, -8], children }) {
  return (
    <CircleMarker center={position} radius={0} opacity={0} fillOpacity={0}>
      <Tooltip permanent direction="top" offset={offset} className="atlas-tooltip" opacity={1}>
        {children}
      </Tooltip>
    </CircleMarker>
  );
}

function dataUrl(fileName) {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/data/${fileName}`;
}

async function loadJson(fileName, optional = false) {
  const path = dataUrl(fileName);
  let response;
  try {
    response = await fetch(path, { cache: 'no-store' });
  } catch (error) {
    if (optional) return null;
    throw new Error(`Could not request ${path}. Check the network connection and deployment base path.`);
  }

  if (!response.ok) {
    if (optional) return null;
    throw new Error(`Could not load ${path} (${response.status}).`);
  }

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  const trimmed = text.trim().toLowerCase();
  if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
    if (optional) return null;
    throw new Error(`Expected JSON at ${path}, but received HTML. Check the deployed data files and Vite base path.`);
  }
  if (!contentType.includes('json') && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    if (optional) return null;
    throw new Error(`Expected JSON at ${path}, but received ${contentType || 'an unknown content type'}.`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    if (optional) return null;
    throw new Error(`Could not parse JSON at ${path}: ${error.message}`);
  }
}

function formatSelection(city, neighbourhood) {
  if (neighbourhood !== 'All') return `${neighbourhood}, ${city}`;
  if (city !== 'All') return `${city} study neighbourhoods`;
  return 'Three-city study geography';
}

function selectionNarrative(city, neighbourhood) {
  if (neighbourhood !== 'All') {
    return `This view shows the public-release fieldwork geography for ${neighbourhood}. Locations are aggregated and each displayed point represents at least five interviews.`;
  }
  if (city !== 'All') {
    return `This view situates the three study neighbourhoods within ${city}. The points describe the distribution of fieldwork rather than official neighbourhood extent.`;
  }
  return 'This overview situates the comparative study design across Accra, Johannesburg, and Nairobi before moving to city and neighbourhood scale.';
}

function figureCaption(city, neighbourhood, summary) {
  return `${formatSelection(city, neighbourhood)}. The map represents ${summary.visibleInterviews.toLocaleString()} interviews through ${summary.aggregatePoints.toLocaleString()} public-release aggregate points. Fieldwork-footprint hulls are generated from the displayed geography and are not official neighbourhood or administrative boundaries.`;
}

function App() {
  const [points, setPoints] = useState([]);
  const [sites, setSites] = useState([]);
  const [cities, setCities] = useState([]);
  const [manifest, setManifest] = useState(null);
  const [city, setCity] = useState('All');
  const [neighbourhood, setNeighbourhood] = useState('All');
  const [basemap, setBasemap] = useState('carto');
  const [showHulls, setShowHulls] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [figureMode, setFigureMode] = useState(false);
  const [figurePreset, setFigurePreset] = useState('custom');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);
  const mapFrameRef = useRef(null);
  const figureModeRef = useRef(false);

  useEffect(() => {
    Promise.all([
      loadJson('survey_points_public.json'),
      loadJson('study_site_metadata.json'),
      loadJson('city_metadata.json'),
      loadJson('study_geography_manifest.json'),
    ])
      .then(([pointData, siteData, cityData, manifestData]) => {
        setPoints((pointData || []).map((point) => ({ ...point, lat: Number(point.lat), lon: Number(point.lon), count: Number(point.count) })));
        setSites(siteData || []);
        setCities(cityData || []);
        setManifest(manifestData || null);
        setReady(true);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    figureModeRef.current = figureMode;
  }, [figureMode]);

  useEffect(() => {
    const handlePopState = () => {
      if (figureModeRef.current) {
        figureModeRef.current = false;
        setFigureMode(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && figureModeRef.current) exitFigureMode();
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setNeighbourhood('All');
  }, [city]);

  const cityOptions = useMemo(() => ['All', ...CITY_ORDER.filter((name) => cities.some((item) => item.city === name))], [cities]);
  const neighbourhoodOptions = useMemo(() => {
    const selectedSites = city === 'All' ? sites : sites.filter((site) => site.city === city);
    return ['All', ...selectedSites.map((site) => site.neighbourhood).sort()];
  }, [sites, city]);

  const displayPoints = useMemo(() => points.filter((point) => {
    const cityMatches = city === 'All' || point.city === city;
    const siteMatches = neighbourhood === 'All' || point.neighbourhood === neighbourhood;
    return cityMatches && siteMatches;
  }), [points, city, neighbourhood]);

  const filteredSites = useMemo(() => sites.filter((site) => {
    const cityMatches = city === 'All' || site.city === city;
    const siteMatches = neighbourhood === 'All' || site.neighbourhood === neighbourhood;
    return cityMatches && siteMatches;
  }), [sites, city, neighbourhood]);

  const siteGroups = useMemo(() => {
    const groups = new Map();
    for (const point of displayPoints) {
      const key = `${point.city}__${point.neighbourhood}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(point);
    }
    return groups;
  }, [displayPoints]);

  const fallbackBounds = useMemo(() => {
    if (neighbourhood !== 'All') {
      const site = sites.find((item) => item.city === city && item.neighbourhood === neighbourhood);
      return normalizeBounds(site?.bounds, 0.003);
    }
    if (city !== 'All') {
      const cityMetadata = cities.find((item) => item.city === city);
      return normalizeBounds(cityMetadata?.bounds, 0.025);
    }
    return [[-34.5, -18.5], [7.5, 39.5]];
  }, [sites, cities, city, neighbourhood]);

  const bounds = useMemo(() => {
    if (city === 'All' && neighbourhood === 'All') return [[-34.5, -18.5], [7.5, 39.5]];
    return boundsFromPoints(displayPoints, fallbackBounds, neighbourhood !== 'All' ? 0.004 : 0.018);
  }, [displayPoints, fallbackBounds, city, neighbourhood]);

  const summary = useMemo(() => ({
    visibleInterviews: displayPoints.reduce((sum, point) => sum + point.count, 0),
    aggregatePoints: displayPoints.length,
    sites: filteredSites.length,
  }), [displayPoints, filteredSites]);

  const title = formatSelection(city, neighbourhood);
  const narrative = selectionNarrative(city, neighbourhood);
  const activeCityContext = city !== 'All'
    ? CITY_CONTEXT[city]
    : 'The overview establishes the comparative geography before the reader moves to city and neighbourhood scale.';

  function enterFigureMode() {
    if (!figureModeRef.current) {
      const url = `${window.location.pathname}${window.location.search}#figure`;
      figureModeRef.current = true;
      window.history.pushState({ atlasFigureMode: true }, '', url);
      setFigureMode(true);
    }
  }

  function exitFigureMode() {
    if (window.history.state?.atlasFigureMode) {
      window.history.back();
    } else {
      figureModeRef.current = false;
      setFigureMode(false);
      if (window.location.hash === '#figure') {
        window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
      }
    }
  }

  function markManualChange(change) {
    setFigurePreset('custom');
    change();
  }

  function applyFigurePreset(key) {
    setFigurePreset(key);
    const preset = FIGURE_PRESETS.find((item) => item.key === key);
    if (!preset || key === 'custom') return;
    setBasemap(preset.basemap || 'carto');
    setShowHulls(true);
    setShowLabels(true);
    setShowLegend(true);
    if (Object.prototype.hasOwnProperty.call(preset, 'city')) {
      setCity(preset.city || 'All');
      window.setTimeout(() => setNeighbourhood(preset.neighbourhood || 'All'), 0);
    }
    enterFigureMode();
  }

  function selectSite(siteCity, siteName) {
    setFigurePreset('custom');
    setCity(siteCity);
    window.setTimeout(() => setNeighbourhood(siteName), 0);
  }

  async function exportMapPng() {
    if (!mapFrameRef.current || exporting) return;
    setExportError('');
    setExporting(true);
    mapFrameRef.current.classList.add('exporting');
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 120));
      const canvas = await html2canvas(mapFrameRef.current, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scale: 2.4,
        logging: false,
        ignoreElements: (element) => element.classList?.contains('no-export'),
      });
      const presetSlug = figurePreset !== 'custom' ? `${figurePreset}-` : '';
      const slug = `${presetSlug}${city}-${neighbourhood}`
        .toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll('/', '-')
        .replaceAll('·', '')
        .replace(/-+/g, '-');
      const link = document.createElement('a');
      link.download = `study-geography-atlas-${slug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (exportFailure) {
      setExportError('The PNG export could not be completed. Try the quiet grey basemap and confirm that map tiles have finished loading.');
    } finally {
      mapFrameRef.current?.classList.remove('exporting');
      setExporting(false);
    }
  }

  if (error) return <div className="shell"><div className="panel error"><strong>Atlas data could not be loaded.</strong><br />{error}</div></div>;
  if (!ready) return <div className="shell"><div className="panel loading">Loading atlas data…</div></div>;

  return (
    <div className={`shell publicOnlyBuild ${figureMode ? 'figureMode' : ''} ${basemap === 'dark' ? 'darkBasemap' : ''}`}>
      {figureMode && (
        <button type="button" className="figureExit no-export" onClick={exitFigureMode} aria-label="Exit figure mode">
          ← Back to interactive atlas
        </button>
      )}

      <header className="hero">
        <div>
          <div className="kicker">Accra · Johannesburg · Nairobi</div>
          <h1>Study Geography Atlas</h1>
          <p className="lede">
            A fieldwork geography companion to <em>Urban Elsewheres</em>, showing where interviews were conducted across nine study neighbourhoods without displaying exact respondent locations.
          </p>
        </div>
        <div className="heroNote">
          <strong>Cartographic purpose</strong>
          <span>The atlas situates the comparative survey in urban space through city context, study-site geography, aggregate interview locations, and descriptive fieldwork footprints.</span>
          <small>Public release · v3.2</small>
        </div>
      </header>

      <section className="controls panel no-export" aria-label="Atlas controls">
        <div className="controlFields">
          <label>
            City
            <select value={city} onChange={(event) => markManualChange(() => setCity(event.target.value))}>
              {cityOptions.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label>
            Neighbourhood
            <select value={neighbourhood} onChange={(event) => markManualChange(() => setNeighbourhood(event.target.value))} disabled={city === 'All'}>
              {neighbourhoodOptions.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label>
            Basemap
            <select value={basemap} onChange={(event) => markManualChange(() => setBasemap(event.target.value))}>
              {Object.entries(BASEMAPS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
            </select>
          </label>
          <label className="presetField">
            Figure preset
            <select value={figurePreset} onChange={(event) => applyFigurePreset(event.target.value)}>
              {FIGURE_PRESETS.map((preset) => <option key={preset.key} value={preset.key}>{preset.label}</option>)}
            </select>
          </label>
        </div>

        <div className="controlTools">
          <span role="status" aria-live="polite" className={`presetHint ${figurePreset === 'custom' ? '' : 'paper'}`}>
            {figurePreset === 'custom' ? 'Interactive view' : 'Figure preset active'}
          </span>
          <div className="toggleGroup" role="group" aria-label="Map display controls">
            <button type="button" className={showHulls ? 'active' : ''} onClick={() => markManualChange(() => setShowHulls((value) => !value))}>Fieldwork footprints</button>
            <button type="button" className={showLabels ? 'active' : ''} onClick={() => markManualChange(() => setShowLabels((value) => !value))}>Labels</button>
            <button type="button" className={showLegend ? 'active' : ''} onClick={() => markManualChange(() => setShowLegend((value) => !value))}>Legend</button>
          </div>
          <div className="outputGroup" role="group" aria-label="Figure and export controls">
            <button type="button" onClick={enterFigureMode}>Open figure mode</button>
            <button type="button" onClick={exportMapPng} disabled={exporting}>{exporting ? 'Preparing PNG…' : 'Export PNG'}</button>
          </div>
        </div>
      </section>

      <section className="safeBanner panel no-export">
        <strong>Public-release geography:</strong> exact coordinates and respondent identifiers are not included. Displayed locations are spatially aggregated, and every map point represents at least five interviews.
      </section>

      {exportError && <section className="warning panel no-export" role="alert">{exportError}</section>}

      <main className="layout">
        <section className="mapPanel panel" ref={mapFrameRef}>
          <div className="mapHeader">
            <div>
              <div className="kicker">Study-site map</div>
              <h2>{title}</h2>
              <p>{narrative}</p>
            </div>
            <div className="badgeStack">
              <span className="badge">Public aggregate geography</span>
              <span className="badge faint">{BASEMAPS[basemap].label}</span>
            </div>
          </div>

          <div className="mapWrap">
            <MapContainer center={[0, 20]} zoom={4} scrollWheelZoom className="leafletMap" preferCanvas minZoom={2} maxZoom={19}>
              <TileLayer url={BASEMAPS[basemap].url} attribution={BASEMAPS[basemap].attribution} crossOrigin />
              <FitBounds bounds={bounds} />
              <MapResizer trigger={`${city}-${neighbourhood}-${basemap}-${figureMode}-${figurePreset}`} />
              <ScaleControl imperial={false} position="bottomleft" />

              {showHulls && Array.from(siteGroups.entries()).map(([key, sitePoints]) => {
                const [siteCity, siteName] = key.split('__');
                const hull = convexHull(sitePoints);
                if (hull.length < 3) return null;
                const color = SITE_COLORS[siteName] || CITY_COLORS[siteCity] || '#444';
                return <Polygon key={`hull-${key}`} positions={hull} pathOptions={{ color, weight: 2.4, opacity: 0.86, fillColor: color, fillOpacity: basemap === 'dark' ? 0.24 : 0.12 }} />;
              })}

              {displayPoints.map((point) => {
                const color = SITE_COLORS[point.neighbourhood] || CITY_COLORS[point.city] || '#333';
                const radius = Math.max(5, Math.min(17, 3.2 + Math.sqrt(point.count) * 2.15));
                return (
                  <CircleMarker
                    key={`${point.city}-${point.neighbourhood}-${point.lat}-${point.lon}`}
                    center={[point.lat, point.lon]}
                    radius={radius}
                    pathOptions={{ color: basemap === 'dark' ? 'rgba(255,255,255,0.92)' : '#ffffff', weight: 1.45, fillColor: color, fillOpacity: 0.82, opacity: 0.95 }}
                  >
                    <Popup>
                      <strong>{point.neighbourhood}, {point.city}</strong><br />
                      Interviews represented: {point.count}<br />
                      Location aggregated for public release.
                    </Popup>
                  </CircleMarker>
                );
              })}

              {showLabels && city === 'All' && cities.map((item) => (
                <MapLabel key={`city-${item.city}`} position={[Number(item.center_lat), Number(item.center_lon)]}>
                  <span className="cityLabel" style={{ borderColor: CITY_COLORS[item.city] || '#444' }}>
                    <b>{item.city}</b><br />{item.neighbourhoods?.length || 3} sites
                  </span>
                </MapLabel>
              ))}

              {showLabels && city !== 'All' && filteredSites.map((site) => {
                const sitePoints = displayPoints.filter((point) => point.city === site.city && point.neighbourhood === site.neighbourhood);
                const center = weightedCenter(sitePoints);
                if (!center) return null;
                const color = SITE_COLORS[site.neighbourhood] || CITY_COLORS[site.city] || '#444';
                const siteN = sitePoints.reduce((sum, point) => sum + point.count, 0);
                return (
                  <React.Fragment key={`label-${site.city}-${site.neighbourhood}`}>
                    <MapLabel position={center} offset={getSiteLabelOffset(site.city, site.neighbourhood)}>
                      <span className="siteLabel" style={{ borderColor: color }}><b>{site.neighbourhood}</b><br />n={siteN}</span>
                    </MapLabel>
                    <CircleMarker center={center} radius={7} pathOptions={{ color: '#ffffff', weight: 2, fillColor: color, fillOpacity: 0.96 }} />
                  </React.Fragment>
                );
              })}
            </MapContainer>

            <div className="mapStatus">
              <strong>{title}</strong>
              <span>{summary.visibleInterviews.toLocaleString()} interviews · {summary.aggregatePoints.toLocaleString()} aggregate points</span>
            </div>

            {showLegend && (
              <div className="mapLegend">
                <strong>Map key</strong>
                <span><i className="dot" /> Aggregate interview location</span>
                <span><i className="hullBox" /> Descriptive fieldwork footprint</span>
                <span><i className="labelPill" /> Study neighbourhood label</span>
                <small>Footprints are generated from displayed aggregate geography. They are not official neighbourhood boundaries.</small>
              </div>
            )}
          </div>

          <p className="caption">Point size reflects the number of interviews represented. Coordinates have been aggregated for public release, with a minimum of five interviews per displayed point.</p>
          <p className="figureCaption">{figureCaption(city, neighbourhood, summary)}</p>
        </section>

        <aside className="side panel no-export">
          <div className="selectionSummary">
            <div className="kicker">Current selection</div>
            <h2>{neighbourhood !== 'All' ? neighbourhood : city !== 'All' ? city : 'All study sites'}</h2>
            <p>{narrative}</p>
          </div>

          <div className="statsGrid">
            <div><small>Mapped interviews</small><strong>{summary.visibleInterviews.toLocaleString()}</strong></div>
            <div><small>Study sites</small><strong>{summary.sites}</strong></div>
            <div><small>Aggregate points</small><strong>{summary.aggregatePoints.toLocaleString()}</strong></div>
            <div><small>Minimum point count</small><strong>{manifest?.privacy?.minimum_interviews_per_point || 5}</strong></div>
          </div>

          {manifest && (
            <div className="manifestNote">
              <strong>Interpretation rule</strong>
              <span>{manifest.footprint_language}</span>
            </div>
          )}

          <div className="navigationBlock">
            <h3>Jump to city</h3>
            <div className="cityPills">
              <button type="button" className={city === 'All' ? 'active' : ''} onClick={() => markManualChange(() => setCity('All'))}>All cities</button>
              {CITY_ORDER.map((name) => (
                <button type="button" key={name} className={city === name ? 'active' : ''} onClick={() => markManualChange(() => setCity(name))} style={{ '--site-color': CITY_COLORS[name] }}>{name}</button>
              ))}
            </div>

            <h3>Study neighbourhoods</h3>
            <div className="siteList">
              {filteredSites.map((site) => (
                <button type="button" key={`${site.city}-${site.neighbourhood}`} onClick={() => selectSite(site.city, site.neighbourhood)} className="siteButton" style={{ '--site-color': SITE_COLORS[site.neighbourhood] || CITY_COLORS[site.city] }}>
                  <span>{site.neighbourhood}</span>
                  <b>{site.city}</b>
                  <small>n={site.n_public_mapped_interviews} · {site.n_public_aggregate_points} points</small>
                </button>
              ))}
            </div>
          </div>

          <details className="methodDetails">
            <summary>Interpretation and methods</summary>
            <div className="methodDetailsBody">
              <p className="contextText">{activeCityContext}</p>
              <h3>Basemap guidance</h3>
              <p className="smallText"><strong>{BASEMAPS[basemap].label}:</strong> {BASEMAPS[basemap].use}.</p>
              <h3>Methods note</h3>
              <p className="smallText">The atlas describes where survey fieldwork occurred. It does not define official neighbourhood boundaries and it does not track individual respondents. The companion <em>One Life, Many Geographies</em> interface addresses aggregated relations extending beyond these fieldwork sites.</p>
            </div>
          </details>
        </aside>
      </main>
    </div>
  );
}

export default App;
