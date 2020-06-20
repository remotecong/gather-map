import { getCachedItem, cacheItem } from "./cache";

export async function saveTerritory({ id, points, residences }) {
  console.log("SAVING TERRITORY", { id, points, residences });
  return cacheItem(`territory-${id}`, { id, points, residences });
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

export async function saveLookupsForTerritory(name, lookups) {
  return cacheItem(`territory-${name}-lookups`, lookups);
}

export async function getLookupsForTerritory(name, lookups) {
  return getCachedItem(`territory-${name}-lookups`);
}
