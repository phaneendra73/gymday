export interface MapCoordinates {
  lat: number;
  lng: number;
}

/**
 * Extracts latitude and longitude from a Google Maps URL or iframe src.
 * Supports:
 * - Full URLs: https://www.google.com/maps/place/.../@LAT,LNG,Zz/...
 * - Short links (expanded): https://www.google.com/maps/@LAT,LNG,Zz/...
 * - Iframe src: https://www.google.com/maps/embed?pb=!1m18...!2dLNG!3dLAT...
 * - Share links: https://maps.app.goo.gl/xxxx (must be expanded first, but we handle the @ form)
 */
export function extractCoordinates(input: string): MapCoordinates | null {
  // Try iframe format first (!3dLAT!4dLNG)
  const iframeRegex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
  const iframeMatch = input.match(iframeRegex);
  if (iframeMatch) {
    return {
      lat: parseFloat(iframeMatch[1]),
      lng: parseFloat(iframeMatch[2]),
    };
  }

  // Try standard @LAT,LNG format
  const standardRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const standardMatch = input.match(standardRegex);
  if (standardMatch) {
    return {
      lat: parseFloat(standardMatch[1]),
      lng: parseFloat(standardMatch[2]),
    };
  }

  return null;
}

/**
 * Generates a static OpenStreetMap image URL for the given coordinates.
 */
export function getStaticMapUrl(
  lat: number,
  lng: number,
  zoom: number = 15
): string {
  // Using staticmap.openstreetmap.de or similar
  // Format: https://static-maps.yandex.ru/1.x/?ll=LNG,LAT&z=ZOOM&l=map&size=600,450
  // Or better, use a free service like static-maps-api.vercel.app or similar
  // For now, let's use a reliable one or just provide the Leaflet preview in UI.
  // The user asked for "OpenStreetMap static image".
  // One way is using https://staticmap.openstreetmap.de/staticmap.php?center=LAT,LNG&zoom=15&size=600x450&markers=LAT,LNG,ol-marker

  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=600x450&markers=${lat},${lng},ol-marker`;
}

/**
 * Generates a Google Maps link for the given coordinates.
 */
export function getGoogleMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Calculates the distance between two coordinates using the Haversine formula.
 * Returns distance in kilometers.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
