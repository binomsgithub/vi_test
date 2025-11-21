import { LevelCompareMetric } from '../../types/metrics';
import { LevelCompareBar } from './LevelCompareBar';

interface LevelCompareStripProps {
  title?: string;
  metrics: LevelCompareMetric[];
}

export function LevelCompareStrip({ title, metrics }: LevelCompareStripProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <LevelCompareBar key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}

