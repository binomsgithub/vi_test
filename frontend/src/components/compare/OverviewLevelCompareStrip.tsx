import { LevelCompareMetric } from '../../types/metrics';
import { MetricTierRow } from './MetricTierRow';

interface OverviewLevelCompareStripProps {
  title?: string;
  metrics: LevelCompareMetric[];
}

export function OverviewLevelCompareStrip({ 
  title = "Brand vs Franchisee vs Store", 
  metrics 
}: OverviewLevelCompareStripProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-900" /> Brand
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-500" /> Franchisee
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-teal-500" /> Store
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((metric) => (
          <MetricTierRow key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}

