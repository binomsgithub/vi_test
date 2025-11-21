import { LevelCompareMetric, LevelType } from '../../types/metrics';
import { MatrixRow } from './MatrixRow';
import { getScopeLabel } from '../../utils/levels';
import { LevelScopeHint } from './LevelScopeHint';

interface LevelCompareMatrixProps {
  metrics: LevelCompareMetric[];
  activeLevels: LevelType[];
}

export function LevelCompareMatrix({ metrics, activeLevels }: LevelCompareMatrixProps) {
  if (!metrics?.length) return null;

  const cols = activeLevels.length;
  const gridTemplate = `minmax(0,2fr) repeat(${cols}, minmax(0,1fr))`;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 space-y-3">
      <LevelScopeHint activeLevels={activeLevels} />
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">
          Policy Metrics Comparison
        </h3>
        <p className="text-xs text-slate-500">
          {getScopeLabel(activeLevels)} Heat intensity indicates relative performance within each metric row.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div
            className="grid gap-3 items-center text-xs pb-2 mb-2 border-b-2 border-slate-200"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="text-slate-600 font-semibold text-xs">Metric</div>
            {activeLevels.includes("brand") && (
              <div className="text-center">
                <div className="text-slate-600 font-semibold">Brand</div>
              </div>
            )}
            {activeLevels.includes("franchisee") && (
              <div className="text-center">
                <div className="text-slate-600 font-semibold">Franchisee</div>
              </div>
            )}
            {activeLevels.includes("store") && (
              <div className="text-center">
                <div className="text-slate-600 font-semibold">Store</div>
              </div>
            )}
          </div>

          {/* Rows */}
          <div>
            {metrics.map((m) => (
              <MatrixRow key={m.id} metric={m} activeLevels={activeLevels} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

