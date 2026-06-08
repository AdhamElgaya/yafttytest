/** Approximate city boundaries (bounding boxes) — fallback until OSM GeoJSON loads. */

function bboxPolygon(west, south, east, north) {
  return {
    type: 'Polygon',
    coordinates: [
      [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south],
      ],
    ],
  };
}

export const EGYPT_CITIES = [
  {
    id: 'cairo',
    nameEn: 'Cairo',
    nameAr: 'القاهرة',
    center: { latitude: 30.0444, longitude: 31.2357 },
    zoom: 10.5,
    matchTerms: ['cairo', 'القاهرة', 'giza', 'الجيزة', '6th october', '6 october', 'مدينة نصر', 'nasr city', 'helwan', 'حلوان', 'maadi', 'المعادي'],
    polygon: bboxPolygon(31.05, 29.9, 31.55, 30.2),
  },
  {
    id: 'alexandria',
    nameEn: 'Alexandria',
    nameAr: 'الإسكندرية',
    center: { latitude: 31.2001, longitude: 29.9187 },
    zoom: 11,
    matchTerms: ['alexandria', 'alex', 'الإسكندرية', 'اسكندرية', 'الاسكندرية'],
    polygon: bboxPolygon(29.82, 31.05, 30.08, 31.28),
  },
  {
    id: 'luxor',
    nameEn: 'Luxor',
    nameAr: 'الأقصر',
    center: { latitude: 25.6872, longitude: 32.6396 },
    zoom: 12,
    matchTerms: ['luxor', 'الأقصر', 'الاقصر'],
    polygon: bboxPolygon(32.55, 25.65, 32.72, 25.78),
  },
  {
    id: 'aswan',
    nameEn: 'Aswan',
    nameAr: 'أسوان',
    center: { latitude: 24.0889, longitude: 32.8998 },
    zoom: 12,
    matchTerms: ['aswan', 'أسوان', 'اسوان'],
    polygon: bboxPolygon(32.85, 24.04, 32.98, 24.14),
  },
  {
    id: 'hurghada',
    nameEn: 'Hurghada',
    nameAr: 'الغردقة',
    center: { latitude: 27.2579, longitude: 33.8116 },
    zoom: 11.5,
    matchTerms: ['hurghada', 'الغردقة', 'غردقة'],
    polygon: bboxPolygon(33.72, 27.18, 33.88, 27.32),
  },
  {
    id: 'sharm',
    nameEn: 'Sharm El Sheikh',
    nameAr: 'شرم الشيخ',
    center: { latitude: 27.9158, longitude: 34.3299 },
    zoom: 12,
    matchTerms: ['sharm', 'شرم', 'شرم الشيخ'],
    polygon: bboxPolygon(34.22, 27.84, 34.38, 27.98),
  },
  {
    id: 'mansoura',
    nameEn: 'Mansoura',
    nameAr: 'المنصورة',
    center: { latitude: 31.0409, longitude: 31.3785 },
    zoom: 12,
    matchTerms: ['mansoura', 'المنصورة', 'منصورة'],
    polygon: bboxPolygon(31.33, 31.01, 31.42, 31.08),
  },
  {
    id: 'tanta',
    nameEn: 'Tanta',
    nameAr: 'طنطا',
    center: { latitude: 30.7865, longitude: 31.0004 },
    zoom: 12,
    matchTerms: ['tanta', 'طنطا'],
    polygon: bboxPolygon(30.93, 30.74, 31.06, 30.83),
  },
  {
    id: 'ismailia',
    nameEn: 'Ismailia',
    nameAr: 'الإسماعيلية',
    center: { latitude: 30.5965, longitude: 32.2715 },
    zoom: 12,
    matchTerms: ['ismailia', 'الإسماعيلية', 'اسماعيلية', 'الاسماعيلية'],
    polygon: bboxPolygon(32.24, 30.57, 32.32, 30.63),
  },
  {
    id: 'portsaid',
    nameEn: 'Port Said',
    nameAr: 'بورسعيد',
    center: { latitude: 31.2653, longitude: 32.3019 },
    zoom: 12,
    matchTerms: ['port said', 'portsaid', 'بورسعيد', 'بور سعيد'],
    polygon: bboxPolygon(32.26, 31.22, 32.34, 31.30),
  },
  {
    id: 'suez',
    nameEn: 'Suez',
    nameAr: 'السويس',
    center: { latitude: 29.9668, longitude: 32.5498 },
    zoom: 12,
    matchTerms: ['suez', 'السويس', 'سويس'],
    polygon: bboxPolygon(32.5, 29.94, 32.58, 30.02),
  },
  {
    id: 'assiut',
    nameEn: 'Assiut',
    nameAr: 'أسيوط',
    center: { latitude: 27.1783, longitude: 31.1859 },
    zoom: 12,
    matchTerms: ['assiut', 'asyut', 'أسيوط', 'اسيوط'],
    polygon: bboxPolygon(31.14, 27.16, 31.22, 27.24),
  },
  {
    id: 'minya',
    nameEn: 'Minya',
    nameAr: 'المنيا',
    center: { latitude: 28.1099, longitude: 30.7503 },
    zoom: 12,
    matchTerms: ['minya', 'el minya', 'المنيا', 'منيا'],
    polygon: bboxPolygon(30.72, 28.07, 30.80, 28.14),
  },
  {
    id: 'fayoum',
    nameEn: 'Fayoum',
    nameAr: 'الفيوم',
    center: { latitude: 29.3084, longitude: 30.8441 },
    zoom: 12,
    matchTerms: ['fayoum', 'faiyum', 'الفيوم', 'فيوم'],
    polygon: bboxPolygon(30.80, 29.28, 30.88, 29.34),
  },
];

export function getCityById(id) {
  return EGYPT_CITIES.find((c) => c.id === id) || null;
}

export function cityHighlightGeoJson(cityId) {
  const city = getCityById(cityId);
  if (!city) return null;
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: city.id, name: city.nameEn },
        geometry: city.polygon,
      },
    ],
  };
}
