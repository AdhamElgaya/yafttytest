/** Public Mapbox token — set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local */
export const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  process.env.REACT_APP_MAPBOX_TOKEN ||
  '';
