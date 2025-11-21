import { LevelType } from '../../types/metrics';

interface TierCardProps {
  level: LevelType;
  label: string;
  value: number;
  unit?: string;
  isBaseline?: boolean;
  deltaVsBaseline?: number;
}

export function TierCard({ level, label, value, unit, isBaseline, deltaVsBaseline }: TierCardProps) {
  // Border colors based on level
  const borderColors = {
    brand: 'border-l-4 border-purple-900',
    franchisee: 'border-l-4 border-purple-500',
    store: 'border-l-4 border-teal-500',
  };

  // Format value based on unit
  const formatValue = (val: number, u?: string): string => {
    if (u === '%') {
      return `${val.toFixed(1)}%`;
    } else if (u === '$') {
      return `$${val.toFixed(2)}`;
    } else if (u === 'mins') {
      return `${val.toFixed(1)} mins`;
    }
    return val.toFixed(1);
  };

  // Format delta
  const formatDelta = (delta: number, u?: string): string => {
    const absDelta = Math.abs(delta);
    if (u === '%') {
      return `${absDelta.toFixed(1)} pp`;
    } else if (u === '$') {
      return `$${absDelta.toFixed(2)}`;
    } else if (u === 'mins') {
      return `${absDelta.toFixed(1)} mins`;
    } else if (u === '' || !u) {
      // For numeric values without unit, show as percentage points if it's a rate-like metric
      return `${absDelta.toFixed(1)}`;
    }
    return `${absDelta.toFixed(1)} ${u}`;
  };

  return (
    <div className={`rounded-2xl bg-white shadow-sm p-4 flex flex-col justify-between border-l-4 ${borderColors[level]} min-h-[110px]`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{label}</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center my-3">
        <span className="text-2xl font-bold text-gray-900">{formatValue(value, unit)}</span>
      </div>
      
      <div className="mt-auto pt-2 border-t border-gray-100">
        {isBaseline ? (
          <span className="text-xs text-gray-500 font-medium">Baseline</span>
        ) : deltaVsBaseline !== undefined ? (
          <div className={`text-xs font-semibold ${deltaVsBaseline >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {deltaVsBaseline >= 0 ? '▲' : '▼'} {formatDelta(deltaVsBaseline, unit)} vs Brand
          </div>
        ) : null}
      </div>
      
      {/* Placeholder for future sparkline - hidden for now but structure ready */}
      {/* <div className="mt-2 h-6 w-full bg-slate-100 rounded-md opacity-30" /> */}
    </div>
  );
}

