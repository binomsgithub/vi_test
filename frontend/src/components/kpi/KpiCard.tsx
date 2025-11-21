import { KpiDefinition } from '../../types/metrics';

interface KpiCardProps {
  kpi: KpiDefinition;
}

export function KpiCard({ kpi }: KpiCardProps) {
  const formatValue = (value: number | null): string => {
    if (value === null) return 'N/A';
    const decimals = kpi.decimals ?? 0;
    return value.toFixed(decimals);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="text-sm text-gray-600 mb-1">{kpi.label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatValue(kpi.value)}
        </span>
        {kpi.suffix && (
          <span className="text-sm text-gray-500">{kpi.suffix}</span>
        )}
        {kpi.trendDelta !== null && kpi.trendDelta !== undefined && (
          <span
            className={`text-sm ${
              kpi.trendDelta >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {kpi.trendDelta >= 0 ? '▲' : '▼'} {Math.abs(kpi.trendDelta).toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}

