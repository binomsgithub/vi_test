import { LevelCompareMetric, LevelType } from '../../types/metrics';

interface DeltaChipProps {
  label: string;
  delta: number;
  unit?: string;
}

function DeltaChip({ label, delta, unit }: DeltaChipProps) {
  const positive = delta >= 0;
  const color = positive
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : 'bg-rose-100 text-rose-700 border-rose-200';
  const sign = positive ? '+' : '−';
  const abs = Math.abs(delta);

  const formatDelta = (val: number, u?: string): string => {
    if (u === '%') {
      return `${val.toFixed(1)}pp`;
    } else if (u === '$') {
      return `$${val.toFixed(2)}`;
    } else if (u === 'mins') {
      return `${val.toFixed(1)}m`;
    }
    return val.toFixed(1);
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${color} font-medium`}
    >
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
      <span className="text-xs font-semibold">
        {sign}
        {formatDelta(abs, unit)}
      </span>
    </span>
  );
}

interface DeltaChipRowProps {
  metric: LevelCompareMetric;
  activeLevels: LevelType[];
}

export function DeltaChipRow({ metric, activeLevels }: DeltaChipRowProps) {
  const hasStore = activeLevels.includes("store");
  const hasFranchise = activeLevels.includes("franchisee");

  // Determine primary value and deltas based on active levels
  let primaryValue: number;
  let primaryLabel: string;
  let primaryColor: string;
  let vsBrand: number | undefined;
  let vsFranchise: number | undefined;

  if (!hasStore && !hasFranchise) {
    // Brand-only view
    primaryValue = metric.brandValue;
    primaryLabel = "Brand";
    primaryColor = "text-purple-900";
    vsBrand = undefined;
    vsFranchise = undefined;
  } else if (!hasStore && hasFranchise) {
    // Franchise vs Brand
    primaryValue = metric.franchiseeValue;
    primaryLabel = "Franchise";
    primaryColor = "text-purple-500";
    vsBrand = metric.franchiseeValue - metric.brandValue;
    vsFranchise = undefined;
  } else {
    // Store vs Brand & Franchise
    primaryValue = metric.storeValue;
    primaryLabel = "Store";
    primaryColor = "text-teal-600";
    vsBrand = metric.storeValue - metric.brandValue;
    vsFranchise = metric.storeValue - metric.franchiseeValue;
  }

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

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-colors">
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-800 mb-1">
          {metric.label}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span>
            <span className={`font-medium ${primaryColor}`}>
              {primaryLabel}: {formatValue(primaryValue, metric.unit)}
            </span>
          </span>
          {hasFranchise && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                Brand: {formatValue(metric.brandValue, metric.unit)}
              </span>
            </>
          )}
          {hasStore && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                Franchise: {formatValue(metric.franchiseeValue, metric.unit)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {vsBrand !== undefined && (
          <DeltaChip label={`${primaryLabel} vs Brand`} delta={vsBrand} unit={metric.unit} />
        )}
        {vsFranchise !== undefined && (
          <DeltaChip label={`${primaryLabel} vs Franchise`} delta={vsFranchise} unit={metric.unit} />
        )}
      </div>
    </div>
  );
}

