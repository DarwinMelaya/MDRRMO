const EARTH_RADIUS_M = 6_371_000;

export const haversineDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
};

export const formatDistanceLabel = (meters) => {
  if (!Number.isFinite(meters)) return "—";
  if (meters < 1000) return `${Math.max(1, Math.round(meters))}M`;
  return `${(meters / 1000).toFixed(1)}KM`;
};
