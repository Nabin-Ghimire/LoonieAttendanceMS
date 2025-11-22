let _lastCoords = null;
let _lastAt = 0;

/**
 * Get current location. By default returns cached coordinates if available and not older than maxAgeMs.
 * @param {{enableHighAccuracy?:boolean,timeout?:number,maximumAge?:number,forceRefresh?:boolean,maxAgeMs?:number}} opts
 */
export default function getCurrentLocation(opts = {}) {
  const { enableHighAccuracy = true, timeout = 10000, maximumAge = 0, forceRefresh = false, maxAgeMs = 300000 } = opts;

  return new Promise((resolve, reject) => {
    if (!navigator || !navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    const now = Date.now();
    if (!forceRefresh && _lastCoords && (now - _lastAt) <= maxAgeMs) {
      resolve(_lastCoords);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // normalize formatting: 6 decimal places
        const coords = { latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) };
        _lastCoords = coords;
        _lastAt = Date.now();
        resolve(coords);
      },
      (err) => reject(err),
      { enableHighAccuracy, timeout, maximumAge }
    );
  });
}

export function clearCachedLocation() {
  _lastCoords = null;
  _lastAt = 0;
}
