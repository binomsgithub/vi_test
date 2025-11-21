import { GlobalFilters } from "../types/filters";
import { LevelType } from "../types/metrics";

export interface ActiveLevels {
  active: LevelType[];      // e.g., ["brand", "franchisee", "store"]
}

export function getActiveLevels(filters: GlobalFilters): ActiveLevels {
  const hasStore = filters.storeId && filters.storeId !== "any";
  const hasFranchise = !hasStore && filters.franchiseId && filters.franchiseId !== "any";

  if (hasStore) {
    // Store selected: show all three
    return { active: ["brand", "franchisee", "store"] };
  }

  if (hasFranchise) {
    // Franchise selected: show brand + franchise
    return { active: ["brand", "franchisee"] };
  }

  // Nothing or only brand selected: show brand only
  return { active: ["brand"] };
}

export function getScopeLabel(activeLevels: LevelType[]): string {
  const hasStore = activeLevels.includes("store");
  const hasFranchise = activeLevels.includes("franchisee");

  if (hasStore) {
    return "Store vs Franchise vs Brand comparisons for the selected store.";
  }
  if (hasFranchise) {
    return "Franchise vs Brand view. Select a store to see store-level comparisons.";
  }
  return "Brand-level view. Narrow down by franchise or store to see deeper comparisons.";
}

