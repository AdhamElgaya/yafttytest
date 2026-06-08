/** OSM-based governorate boundaries (see public/geo/cities/*.json). */

const cache = new Map();
const inflight = new Map();

export async function loadCityBoundary(cityId) {
  if (!cityId) return null;
  if (cache.has(cityId)) return cache.get(cityId);
  if (inflight.has(cityId)) return inflight.get(cityId);

  const promise = fetch(`/geo/cities/${cityId}.json`)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null)
    .then((geometry) => {
      cache.set(cityId, geometry);
      inflight.delete(cityId);
      return geometry;
    });

  inflight.set(cityId, promise);
  return promise;
}

export function getCachedCityBoundary(cityId) {
  return cache.get(cityId) ?? null;
}

function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi + 0.0) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** GeoJSON Polygon / MultiPolygon — uses first ring of each polygon (outer boundary). */
export function pointInGeometry(lng, lat, geometry) {
  if (!geometry) return false;

  if (geometry.type === 'Polygon') {
    const outer = geometry.coordinates[0];
    return pointInRing(lng, lat, outer);
  }

  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some((poly) => pointInRing(lng, lat, poly[0]));
  }

  return false;
}

export function geometryBounds(geometry) {
  if (!geometry) return null;
  const rings = [];
  if (geometry.type === 'Polygon') rings.push(geometry.coordinates[0]);
  else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((p) => rings.push(p[0]));
  }

  let west = Infinity;
  let east = -Infinity;
  let south = Infinity;
  let north = -Infinity;

  rings.forEach((ring) => {
    ring.forEach(([lng, lat]) => {
      if (lng < west) west = lng;
      if (lng > east) east = lng;
      if (lat < south) south = lat;
      if (lat > north) north = lat;
    });
  });

  if (!Number.isFinite(west)) return null;
  return { west, south, east, north };
}

export function boundaryToHighlightGeoJson(cityId, cityName, geometry) {
  if (!geometry) return null;
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: cityId, name: cityName },
        geometry,
      },
    ],
  };
}
