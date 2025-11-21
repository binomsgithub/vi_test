import { LevelCompareMetric, LevelType } from '../../types/metrics';
import { BubbleTriadCard } from './BubbleTriadCard';
import { getScopeLabel } from '../../utils/levels';
import { LevelScopeHint } from './LevelScopeHint';

interface BubbleTriadGridProps {
  metrics: LevelCompareMetric[];
  activeLevels: LevelType[];
}

export function BubbleTriadGrid({ metrics, activeLevels }: BubbleTriadGridProps) {
  if (!metrics?.length) return null;

  return (
    <div className="mb-6 space-y-3">
      <LevelScopeHint activeLevels={activeLevels} />
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">
          Upsell Performance – Brand vs Franchisee vs Store
        </h3>
        <p className="text-xs text-slate-500">
          {getScopeLabel(activeLevels)} Bubble size represents relative value. Lines show deltas between levels.
        </p>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <BubbleTriadCard key={m.id} metric={m} activeLevels={activeLevels} />
        ))}
      </div>
    </div>
  );
}

