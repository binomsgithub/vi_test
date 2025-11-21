import { GlobalFilters } from "../types/filters";

export function buildQueryFromFilters(filters: GlobalFilters): URLSearchParams {
  const params = new URLSearchParams();

  // Existing filters
  if (filters.brand && filters.brand !== "any") {
    params.set("brand", filters.brand);
  }
  if (filters.owner && filters.owner !== "any") {
    params.set("owner", filters.owner);
  }
  if (filters.franchiseId && filters.franchiseId !== "any") {
    params.set("franchiseId", filters.franchiseId);
  }
  if (filters.storeId && filters.storeId !== "any") {
    params.set("storeId", filters.storeId);
  }
  if (filters.channel && filters.channel !== "any") {
    params.set("channel", filters.channel);
  }
  if (filters.engagementMode && filters.engagementMode !== "any") {
    params.set("engagementMode", filters.engagementMode);
  }

  // Call date filter
  const cd = filters.callDate;
  if (cd) {
    params.set("callDateOperator", cd.operator);
    if (cd.from) {
      params.set("callDateFrom", cd.from);
    }
    if (cd.to) {
      params.set("callDateTo", cd.to);
    }
    if (cd.quantity != null) {
      params.set("callDateQuantity", String(cd.quantity));
    }
    if (cd.unit) {
      params.set("callDateUnit", cd.unit);
    }
  }

  return params;
}

