import { LevelCompareMetric, LevelType } from '../../types/metrics';
import { MatrixCell } from './MatrixCell';

interface MatrixRowProps {
  metric: LevelCompareMetric;
  activeLevels: LevelType[];
}

export function MatrixRow({ metric, activeLevels }: MatrixRowProps) {
  const values: number[] = [];
  if (activeLevels.includes("brand")) values.push(metric.brandValue);
  if (activeLevels.includes("franchisee")) values.push(metric.franchiseeValue);
  if (activeLevels.includes("store")) values.push(metric.storeValue);

  const rowMin = values.length > 0 ? Math.min(...values) : 0;
  const rowMax = values.length > 0 ? Math.max(...values) : 0;

  const cols = activeLevels.length;
  const gridTemplate = `minmax(0,2fr) repeat(${cols}, minmax(0,1fr))`;

  return (
    <div
      className="grid gap-3 items-center text-xs py-2 border-b border-slate-100 last:border-b-0"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      <div className="text-slate-700 font-medium text-xs pr-2">
        {metric.label}
      </div>
      {activeLevels.includes("brand") && (
        <MatrixCell
          level="brand"
          label="Brand"
          value={metric.brandValue}
          unit={metric.unit}
          rowMin={rowMin}
          rowMax={rowMax}
        />
      )}
      {activeLevels.includes("franchisee") && (
        <MatrixCell
          level="franchisee"
          label="Franchisee"
          value={metric.franchiseeValue}
          unit={metric.unit}
          rowMin={rowMin}
          rowMax={rowMax}
        />
      )}
      {activeLevels.includes("store") && (
        <MatrixCell
          level="store"
          label="Store"
          value={metric.storeValue}
          unit={metric.unit}
          rowMin={rowMin}
          rowMax={rowMax}
        />
      )}
    </div>
  );
}

