import { LevelCompareMetric } from '../../types/metrics';
import { MetricSegmentRow } from './MetricSegmentRow';

interface SalesUpsellLevelCompareStripProps {
  title?: string;
  metrics: LevelCompareMetric[];
}

export function SalesUpsellLevelCompareStrip({
  title,
  metrics,
}: SalesUpsellLevelCompareStripProps) {
  if (!metrics?.length) return null;

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-900" /> Brand
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-500" /> Franchisee
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-600" /> Store
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricSegmentRow key={m.id} metric={m} />
        ))}
      </div>
    </div>
  );
}

