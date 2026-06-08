import { EGYPT_CITIES, getCityById } from './egyptCities';
import { getCachedCityBoundary, pointInGeometry } from './cityBoundaries';

/** Area threshold (m²) from parsed WxH dimensions — below = small, at/above = large */
export const SIZE_CATEGORY_THRESHOLD = 40;

/** Width ÷ height targets (first dimension = width). */
export const HORIZONTAL_SMALL_ASPECT_RATIOS = [3]; // 1200×400
export const VERTICAL_SMALL_ASPECT_RATIOS = [1 / 3]; // 400×1200
export const SQUARE_SMALL_ASPECT_RATIOS = [1]; // 800×800
export const HORIZONTAL_LARGE_ASPECT_RATIOS = [3, 4, 16 / 9];
export const VERTICAL_LARGE_ASPECT_RATIOS = [1 / 2, 9 / 16, 2 / 3];

const ASPECT_RATIO_TOLERANCE = 0.12;
const SQUARE_RATIO_TOLERANCE = 0.1;

export function parseSizeDimensions(sizeStr) {
  if (!sizeStr || typeof sizeStr !== 'string') return null;
  const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const width = parseFloat(match[1]);
  const height = parseFloat(match[2]);
  if (!width || !height) return null;
  return {
    width,
    height,
    area: width * height,
    ratio: width / height,
  };
}

export function parseSizeArea(sizeStr) {
  const dims = parseSizeDimensions(sizeStr);
  return dims ? dims.area : null;
}

function matchesAspectRatio(ratio, targets, tolerance = ASPECT_RATIO_TOLERANCE) {
  return targets.some(
    (target) => Math.abs(ratio - target) / target <= tolerance
  );
}

/** Classifies small banners by orientation / aspect ratio. */
export function getSmallBannerOrientation(sizeStr) {
  const dims = parseSizeDimensions(sizeStr);
  if (!dims || dims.area >= SIZE_CATEGORY_THRESHOLD) return null;

  const { ratio, width, height } = dims;
  if (
    matchesAspectRatio(ratio, SQUARE_SMALL_ASPECT_RATIOS, SQUARE_RATIO_TOLERANCE)
  ) {
    return 'square-small';
  }
  if (matchesAspectRatio(ratio, HORIZONTAL_SMALL_ASPECT_RATIOS)) {
    return 'horizontal-small';
  }
  if (matchesAspectRatio(ratio, VERTICAL_SMALL_ASPECT_RATIOS)) {
    return 'vertical-small';
  }
  if (Math.abs(ratio - 1) <= SQUARE_RATIO_TOLERANCE) return 'square-small';
  return width >= height ? 'horizontal-small' : 'vertical-small';
}

/** Classifies large banners by orientation / aspect ratio. */
export function getLargeBannerOrientation(sizeStr) {
  const dims = parseSizeDimensions(sizeStr);
  if (!dims || dims.area < SIZE_CATEGORY_THRESHOLD) return null;

  const { ratio, width, height } = dims;
  if (matchesAspectRatio(ratio, HORIZONTAL_LARGE_ASPECT_RATIOS)) {
    return 'horizontal-large';
  }
  if (matchesAspectRatio(ratio, VERTICAL_LARGE_ASPECT_RATIOS)) {
    return 'vertical-large';
  }
  return width >= height ? 'horizontal-large' : 'vertical-large';
}

/**
 * @returns {
 *   | 'horizontal-small' | 'vertical-small' | 'square-small'
 *   | 'horizontal-large' | 'vertical-large'
 *   | null
 * }
 */
export function getSizeCategory(sizeStr) {
  const dims = parseSizeDimensions(sizeStr);
  if (!dims) return null;
  if (dims.area < SIZE_CATEGORY_THRESHOLD) {
    return getSmallBannerOrientation(sizeStr);
  }
  return getLargeBannerOrientation(sizeStr);
}

export function normalizeBannerType(type) {
  const t = (type || '').trim();
  if (t === 'RGB') return 'rgb';
  if (t === 'Paper') return 'paper';
  if (t === 'Normal') return 'normal';
  return t.toLowerCase();
}

function pointInCity(banner, city) {
  const lat = banner?.coordinates?.latitude;
  const lng = banner?.coordinates?.longitude;
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;

  const boundary = getCachedCityBoundary(city.id);
  if (boundary) {
    return pointInGeometry(lng, lat, boundary);
  }

  const poly = city.polygon.coordinates[0];
  const lngs = poly.map((p) => p[0]);
  const lats = poly.map((p) => p[1]);
  const west = Math.min(...lngs);
  const east = Math.max(...lngs);
  const south = Math.min(...lats);
  const north = Math.max(...lats);
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

function locationMatchesCity(banner, city) {
  const loc = (banner.location || '').toLowerCase();
  return city.matchTerms.some((term) => loc.includes(term.toLowerCase()));
}

export function bannerMatchesCity(banner, cityId) {
  if (!cityId) return true;
  const city = getCityById(cityId);
  if (!city) return true;
  return pointInCity(banner, city) || locationMatchesCity(banner, city);
}

export function applyBannerFilters(banners, filters) {
  const { city, types = [], sizeCategories = [] } = filters;
  const hasTypeFilter = types.length > 0;
  const hasSizeCategoryFilter = sizeCategories.length > 0;

  return banners.filter((banner) => {
    if (city && !bannerMatchesCity(banner, city)) return false;

    if (hasTypeFilter) {
      const bannerType = normalizeBannerType(banner.type);
      if (!types.includes(bannerType)) return false;
    }

    if (hasSizeCategoryFilter) {
      const category = getSizeCategory(banner.size);
      if (!category || !sizeCategories.includes(category)) return false;
    }

    return true;
  });
}

export { EGYPT_CITIES };
