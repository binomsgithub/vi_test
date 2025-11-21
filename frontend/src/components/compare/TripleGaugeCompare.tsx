import { LevelCompareMetric, LevelType } from '../../types/metrics';

interface TripleGaugeCompareProps {
  metric: LevelCompareMetric;
  activeLevels: LevelType[];
}

interface GaugeProps {
  level: LevelType;
  label: string;
  value: number;
  unit?: string;
  isBaseline?: boolean;
  deltaVsBaseline?: number;
  compact?: boolean;
}

function Gauge({ level, label, value, unit, isBaseline, deltaVsBaseline, compact = false }: GaugeProps) {
  // Normalize value to 0-100 for percentage display
  let normalizedValue: number;
  if (unit === '%') {
    normalizedValue = Math.max(0, Math.min(100, value));
  } else {
    // For non-percentage, scale to 0-100 based on a reasonable max
    const maxValue = unit === '$' ? 50 : unit === 'mins' ? 10 : 100;
    normalizedValue = Math.min(100, (value / maxValue) * 100);
  }

  const color =
    level === 'brand'
      ? 'text-purple-900'
      : level === 'franchisee'
      ? 'text-purple-500'
      : 'text-teal-500';

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

  const formatDelta = (delta: number, u?: string): string => {
    const absDelta = Math.abs(delta);
    if (u === '%') {
      return `${absDelta.toFixed(1)}pp`;
    } else if (u === '$') {
      return `$${absDelta.toFixed(2)}`;
    } else if (u === 'mins') {
      return `${absDelta.toFixed(1)}m`;
    }
    return `${absDelta.toFixed(1)}`;
  };

  // Use smaller size when compact
  const size = compact ? 16 : 40;
  const gaugeSize = compact ? 'w-16 h-16' : 'w-20 h-20';
  const textSize = compact ? 'text-sm' : 'text-lg';
  const svgSize = compact ? 64 : 80;
  const radius = compact ? 28 : 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${gaugeSize}`}>
        <svg className={`transform -rotate-90 ${gaugeSize}`}>
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={compact ? "4" : "5"}
            fill="none"
            className="text-slate-200"
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={compact ? "4" : "5"}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`${textSize} font-bold ${color}`}>
              {formatValue(value, unit)}
            </div>
          </div>
        </div>
      </div>
      <div className={`${compact ? 'mt-1' : 'mt-2'} text-center`}>
        <div className={`${compact ? 'text-[10px]' : 'text-xs'} font-semibold text-slate-700`}>{label}</div>
        {isBaseline ? (
          <div className={`${compact ? 'text-[9px]' : 'text-[10px]'} text-slate-500 ${compact ? 'mt-0' : 'mt-0.5'}`}>Baseline</div>
        ) : deltaVsBaseline !== undefined ? (
          <div
            className={`${compact ? 'text-[9px]' : 'text-[10px]'} font-medium ${compact ? 'mt-0' : 'mt-0.5'} ${
              deltaVsBaseline >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {deltaVsBaseline >= 0 ? '▲' : '▼'} {formatDelta(deltaVsBaseline, unit)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function TripleGaugeCompare({ metric, activeLevels }: TripleGaugeCompareProps) {
  const showBrand = activeLevels.includes("brand");
  const showFranchise = activeLevels.includes("franchisee");
  const showStore = activeLevels.includes("store");
  const activeCount = activeLevels.length;
  const isCompact = activeCount === 3; // Use compact mode when all 3 are shown

  const vsBrandFranchisee = showFranchise ? metric.franchiseeValue - metric.brandValue : undefined;
  const vsBrandStore = showStore ? metric.storeValue - metric.brandValue : undefined;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-sm font-semibold text-slate-900 text-center">
          {metric.label}
        </h2>
        <div className={`flex ${isCompact ? 'gap-3' : 'gap-4'} justify-center w-full`}>
          {showBrand && (
            <Gauge
              level="brand"
              label="Brand"
              value={metric.brandValue}
              unit={metric.unit}
              isBaseline={true}
              compact={isCompact}
            />
          )}
          {showFranchise && (
            <Gauge
              level="franchisee"
              label="Franchisee"
              value={metric.franchiseeValue}
              unit={metric.unit}
              deltaVsBaseline={vsBrandFranchisee}
              compact={isCompact}
            />
          )}
          {showStore && (
            <Gauge
              level="store"
              label="Store"
              value={metric.storeValue}
              unit={metric.unit}
              deltaVsBaseline={vsBrandStore}
              compact={isCompact}
            />
          )}
        </div>
      </div>
    </div>
  );
}

