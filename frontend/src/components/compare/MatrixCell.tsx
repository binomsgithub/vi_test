import { LevelType } from '../../types/metrics';

interface MatrixCellProps {
  level: LevelType;
  label: string;
  value: number;
  unit?: string;
  rowMin: number;
  rowMax: number;
}

export function MatrixCell({
  level,
  label,
  value,
  unit,
  rowMin,
  rowMax,
}: MatrixCellProps) {
  // Calculate bar width based on actual percentage value (0-100%)
  // For percentage metrics, use the value directly; for others, normalize to a reasonable scale
  let barWidth: number;
  if (unit === '%') {
    // For percentages, use the actual value (0-100)
    barWidth = Math.max(0, Math.min(100, value));
  } else {
    // For non-percentage metrics, normalize to 0-100 based on row min/max
    if (rowMax === rowMin) {
      barWidth = 50; // If all values are the same, show 50%
    } else {
      const normalized = (value - rowMin) / (rowMax - rowMin);
      barWidth = 20 + (normalized * 80); // Scale from 20% to 100%
    }
  }
  const isMax = value === rowMax;

  const formatValue = (val: number, u?: string): string => {
    if (u === '%') {
      return `${val.toFixed(1)}%`;
    } else if (u === '$') {
      return `$${val.toFixed(2)}`;
    } else if (u === 'mins') {
      return `${val.toFixed(1)}m`;
    }
    return val.toFixed(1);
  };

  const color =
    level === 'brand'
      ? 'bg-purple-900'
      : level === 'franchisee'
      ? 'bg-purple-500'
      : 'bg-blue-600';

  return (
    <div className="flex items-center">
      <div className="flex-1 rounded-full px-2 py-1.5 flex items-center justify-between gap-2 bg-slate-100">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-700 font-medium whitespace-nowrap">
            {formatValue(value, unit)}
          </span>
          {isMax && (
            <span className="text-[10px] text-amber-600" title="Highest value">
              👑
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

