import { getCachedItem, cacheItem } from "./cache";

export async function saveTerritory({ name, points }) {
  return cacheItem(`territory-${name}`, points);
}

export async function loadTerritory(name) {
  return getCachedItem(`territory-${name}`);
}

export async function getTerritoryList() {
  return Object.keys(localStorage)
    .map(k => k.match(/territory-(.*)$/))
    .filter(k => k)
    .map(k => k[1]);
}
