export type DateFilterOperator =
  | "is_in_range"
  | "is_on_the_day"
  | "is_before"
  | "is_after"
  | "is_on_or_after"
  | "is_on_or_before"
  | "is_in_the_last"
  | "is_next"
  | "is_previous"
  | "is_any_time"
  | "is_null"
  | "is_not_null";

export type DateFilterUnit = "days" | "weeks" | "months" | "years";

export interface CallDateFilter {
  operator: DateFilterOperator;
  // ISO 8601 date strings: "YYYY-MM-DD"
  from?: string;
  to?: string;
  quantity?: number;       // for relative operators (last/next/previous)
  unit?: DateFilterUnit;   // for relative operators
}

export interface GlobalFilters {
  brand?: string | "any";
  owner?: string | "any";
  franchiseId?: string | "any";
  storeId?: string | "any";
  channel?: string | "any";
  engagementMode?: string | "any";
  callDate: CallDateFilter;
}

export interface SegmentFilters {
  brand?: string | "any";
  franchiseId?: string | "any";
  storeId?: string | "any";
  engagement?: string | "any";
  channel?: string | "any";
}

