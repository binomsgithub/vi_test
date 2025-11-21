import { LevelCompareMetric } from '../../types/metrics';
import { TierCard } from './TierCard';

interface MetricTierRowProps {
  metric: LevelCompareMetric;
}

export function MetricTierRow({ metric }: MetricTierRowProps) {
  const baseline = metric.brandValue;
  const franchiseeDelta = metric.franchiseeValue - baseline;
  const storeDelta = metric.storeValue - baseline;

  return (
    <div className="flex flex-col gap-2 bg-slate-50 rounded-2xl p-3">
      <div className="text-sm font-semibold text-slate-700 mb-1">
        {metric.label}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TierCard
          level="brand"
          label="Brand"
          value={metric.brandValue}
          unit={metric.unit}
          isBaseline={true}
        />
        <TierCard
          level="franchisee"
          label="Franchisee"
          value={metric.franchiseeValue}
          unit={metric.unit}
          deltaVsBaseline={franchiseeDelta}
        />
        <TierCard
          level="store"
          label="Store"
          value={metric.storeValue}
          unit={metric.unit}
          deltaVsBaseline={storeDelta}
        />
      </div>
    </div>
  );
}

