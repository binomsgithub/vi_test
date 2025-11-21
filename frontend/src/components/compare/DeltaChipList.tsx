import { LevelCompareMetric, LevelType } from '../../types/metrics';
import { DeltaChipRow } from './DeltaChipRow';
import { getScopeLabel } from '../../utils/levels';
import { LevelScopeHint } from './LevelScopeHint';

interface DeltaChipListProps {
  metrics: LevelCompareMetric[];
  activeLevels: LevelType[];
}

export function DeltaChipList({ metrics, activeLevels }: DeltaChipListProps) {
  if (!metrics?.length) return null;

  const hasStore = activeLevels.includes("store");
  const hasFranchise = activeLevels.includes("franchisee");
  
  const title = hasStore 
    ? "Store vs Brand & Franchise"
    : hasFranchise 
    ? "Franchise vs Brand"
    : "Brand View";

  return (
    <div className="space-y-3 mb-6">
      <LevelScopeHint activeLevels={activeLevels} />
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          {title}
        </h2>
        <div className="text-[11px] text-slate-500">
          {getScopeLabel(activeLevels)}
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((m) => (
          <DeltaChipRow key={m.id} metric={m} activeLevels={activeLevels} />
        ))}
      </div>
    </div>
  );
}

