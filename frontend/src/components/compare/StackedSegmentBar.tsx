import { LevelType } from '../../types/metrics';

interface StackedSegmentBarProps {
  level: LevelType;
  label: string;
  value: number;
  unit?: string;
  maxValue?: number; // Optional max value for scaling non-percentage metrics
}

export function StackedSegmentBar({ level, label, value, unit, maxValue }: StackedSegmentBarProps) {
  // For percentage metrics, use value directly (0-100%)
  // For other metrics, scale based on maxValue (max across all three levels for this metric)
  let widthPct: number;
  if (unit === '%') {
    widthPct = Math.max(0, Math.min(100, value));
  } else {
    // For non-percentage metrics, use the provided maxValue to scale all bars comparably
    if (maxValue && maxValue > 0) {
      widthPct = Math.min(100, (value / maxValue) * 100);
    } else {
      // Fallback: use value * 1.2 as max if no maxValue provided
      const fallbackMax = Math.max(value * 1.2, 100);
      widthPct = Math.min(100, (value / fallbackMax) * 100);
    }
  }

  // Color based on level
  const color =
    level === "brand"
      ? "bg-purple-900"
      : level === "franchisee"
      ? "bg-purple-500"
      : "bg-blue-600";

  // Format value display
  const formatValue = (val: number, u?: string): string => {
    if (u === '%') {
      return `${val.toFixed(1)}%`;
    } else if (u === '$') {
      return `$${val.toFixed(2)}`;
    } else if (u === 'mins') {
      return `${val.toFixed(1)} mins`;
    }
    return `${val.toFixed(1)}${u ? ` ${u}` : ''}`;
  };

  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <div className="w-20 shrink-0 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <div className="w-16 text-right text-[11px] font-medium text-slate-700">
        {formatValue(value, unit)}
      </div>
    </div>
  );
}

