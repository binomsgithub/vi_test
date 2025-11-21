import { LevelCompareMetric } from '../../types/metrics';
import { StackedSegmentBar } from './StackedSegmentBar';

interface MetricSegmentRowProps {
  metric: LevelCompareMetric;
}

export function MetricSegmentRow({ metric }: MetricSegmentRowProps) {
  // Calculate max value across all three levels for this metric to ensure comparable bars
  const maxValue = Math.max(metric.brandValue, metric.franchiseeValue, metric.storeValue);
  
  return (
    <div className="bg-slate-50 rounded-2xl p-3 space-y-2">
      <div className="text-xs font-semibold text-slate-700 mb-2">
        {metric.label}
      </div>
      <div className="space-y-1.5">
        <StackedSegmentBar
          level="brand"
          label="Brand"
          value={metric.brandValue}
          unit={metric.unit}
          maxValue={maxValue}
        />
        <StackedSegmentBar
          level="franchisee"
          label="Franchisee"
          value={metric.franchiseeValue}
          unit={metric.unit}
          maxValue={maxValue}
        />
        <StackedSegmentBar
          level="store"
          label="Store"
          value={metric.storeValue}
          unit={metric.unit}
          maxValue={maxValue}
        />
      </div>
    </div>
  );
}

