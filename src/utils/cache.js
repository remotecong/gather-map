const pkg = require("../../package.json");
const KEY_PREFIX = `gather-map-${pkg.version}`;
export function getLastKnownCoords() {
  return (
    getCachedItem("lk-coords") || {
      lat: 36.11311811576981,
      lng: 264.12948609197935
    }
  );
}

export function getLastKnownZoom() {
  return getCachedItem("lk-zoom") || 12;
}

export function getCachedItem(key) {
  const value = window.localStorage.getItem(KEY_PREFIX + key);
  try {
    return JSON.parse(value);
  } catch (ignore) {
    return value;
  }
}

export function setLastKnownZoom(z) {
  return cacheItem("lk-zoom", z);
}

export function setLastKnownCoords(c) {
  return cacheItem("lk-coords", c);
}

export function cacheItem(key, value) {
  return window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
}
