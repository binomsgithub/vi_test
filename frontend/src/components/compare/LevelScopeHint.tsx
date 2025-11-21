import React from "react";
import { LevelType } from "../../types/metrics";

interface LevelScopeHintProps {
  activeLevels: LevelType[];
}

export const LevelScopeHint: React.FC<LevelScopeHintProps> = ({ activeLevels }) => {
  const hasStore = activeLevels.includes("store");
  const hasFranchise = activeLevels.includes("franchisee");

  let message: string | null = null;

  if (!hasStore && !hasFranchise) {
    // Brand only
    message =
      "Showing brand-level metrics only. Select a franchise or store to see comparisons.";
  } else if (!hasStore && hasFranchise) {
    // Brand + Franchise
    message =
      "Comparing franchise vs brand. Select a store to add store-level comparison.";
  } else {
    // Brand + Franchise + Store: no hint
    return null;
  }

  return (
    <div className="mb-2 rounded-xl bg-sky-50 border border-sky-100 px-3 py-2 flex items-start gap-2 text-[11px] text-sky-800">
      <span className="mt-[2px] h-4 w-4 flex items-center justify-center rounded-full bg-sky-100 text-[10px] font-semibold text-sky-700">
        i
      </span>
      <span>{message}</span>
    </div>
  );
};

