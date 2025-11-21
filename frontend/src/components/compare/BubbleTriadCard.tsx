import { LevelCompareMetric, LevelType } from '../../types/metrics';

interface BubbleTriadCardProps {
  metric: LevelCompareMetric;
  activeLevels: LevelType[];
}

interface BubbleProps {
  level: LevelType;
  value: number;
  unit?: string;
  x: number;
  y: number;
  size: number;
}

function Bubble({ level, value, unit, x, y, size }: BubbleProps) {
  const color =
    level === 'brand'
      ? 'bg-purple-900'
      : level === 'franchisee'
      ? 'bg-purple-500'
      : 'bg-teal-500';

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
    <div
      className={`absolute flex items-center justify-center text-white font-semibold shadow-lg ${color}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '9999px',
        transform: 'translate(-50%, -50%)',
        fontSize: size > 50 ? '12px' : size > 40 ? '11px' : '10px',
      }}
    >
      <div className="text-center px-1">
        {formatValue(value, unit)}
      </div>
    </div>
  );
}

export function BubbleTriadCard({ metric, activeLevels }: BubbleTriadCardProps) {
  const showBrand = activeLevels.includes("brand");
  const showFranchise = activeLevels.includes("franchisee");
  const showStore = activeLevels.includes("store");
  const activeCount = activeLevels.length;

  // Collect values only for active levels
  const values: number[] = [];
  if (showBrand) values.push(metric.brandValue);
  if (showFranchise) values.push(metric.franchiseeValue);
  if (showStore) values.push(metric.storeValue);

  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 1;
  const range = max - min || 1;

  const size = (v: number) => {
    const normalized = (v - min) / range;
    // Increased size range: 48px to 80px for better visibility
    return 48 + normalized * 32;
  };

  const brandSize = showBrand ? size(metric.brandValue) : 0;
  const franchiseeSize = showFranchise ? size(metric.franchiseeValue) : 0;
  const storeSize = showStore ? size(metric.storeValue) : 0;

  // Calculate deltas only for active pairs
  const deltaFranchisee = showBrand && showFranchise ? metric.franchiseeValue - metric.brandValue : undefined;
  const deltaStore = showBrand && showStore ? metric.storeValue - metric.brandValue : undefined;
  const deltaFranchiseStore = showFranchise && showStore ? metric.storeValue - metric.franchiseeValue : undefined;

  const formatDelta = (delta: number, u?: string): string => {
    const absDelta = Math.abs(delta);
    const sign = delta >= 0 ? '+' : '−';
    if (u === '%') {
      return `${sign}${absDelta.toFixed(1)}pp`;
    } else if (u === '$') {
      return `${sign}$${absDelta.toFixed(2)}`;
    } else if (u === 'mins') {
      return `${sign}${absDelta.toFixed(1)}m`;
    }
    return `${sign}${absDelta.toFixed(1)}`;
  };

  // Determine bubble positions based on active levels
  // Adjusted positions to prevent overlap when all 3 are active
  let brandPos = { x: 50, y: 25 };
  let franchiseePos = { x: 25, y: 70 };
  let storePos = { x: 75, y: 70 };

  if (activeCount === 1 && showBrand) {
    brandPos = { x: 50, y: 50 }; // Center
  } else if (activeCount === 2) {
    if (showBrand && showFranchise) {
      brandPos = { x: 30, y: 50 };
      franchiseePos = { x: 70, y: 50 };
    } else if (showBrand && showStore) {
      brandPos = { x: 30, y: 50 };
      storePos = { x: 70, y: 50 };
    } else if (showFranchise && showStore) {
      franchiseePos = { x: 30, y: 50 };
      storePos = { x: 70, y: 50 };
    }
  } else if (activeCount === 3) {
    // When all 3 are active, spread them out more to prevent overlap
    brandPos = { x: 50, y: 25 };
    franchiseePos = { x: 20, y: 75 };
    storePos = { x: 80, y: 75 };
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 min-h-[280px]">
      <div className="text-xs font-semibold text-slate-800">
        {metric.label}
      </div>
      <div className="relative h-52">
        {/* SVG lines connecting bubbles - only draw lines between active bubbles */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {showBrand && showFranchise && (
            <line
              x1={`${brandPos.x}%`}
              y1={`${brandPos.y}%`}
              x2={`${franchiseePos.x}%`}
              y2={`${franchiseePos.y}%`}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
          {showBrand && showStore && (
            <line
              x1={`${brandPos.x}%`}
              y1={`${brandPos.y}%`}
              x2={`${storePos.x}%`}
              y2={`${storePos.y}%`}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
          {showFranchise && showStore && (
            <line
              x1={`${franchiseePos.x}%`}
              y1={`${franchiseePos.y}%`}
              x2={`${storePos.x}%`}
              y2={`${storePos.y}%`}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}
        </svg>

        {/* Delta labels - only show for active pairs */}
        {deltaFranchisee !== undefined && showBrand && showFranchise && (
          <div
            className="absolute text-[9px] text-slate-500 font-medium"
            style={{
              left: `${(brandPos.x + franchiseePos.x) / 2}%`,
              top: `${(brandPos.y + franchiseePos.y) / 2}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {formatDelta(deltaFranchisee, metric.unit)}
          </div>
        )}
        {deltaStore !== undefined && showBrand && showStore && (
          <div
            className="absolute text-[9px] text-slate-500 font-medium"
            style={{
              left: `${(brandPos.x + storePos.x) / 2}%`,
              top: `${(brandPos.y + storePos.y) / 2}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {formatDelta(deltaStore, metric.unit)}
          </div>
        )}
        {deltaFranchiseStore !== undefined && showFranchise && showStore && (
          <div
            className="absolute text-[9px] text-slate-500 font-medium"
            style={{
              left: `${(franchiseePos.x + storePos.x) / 2}%`,
              top: `${(franchiseePos.y + storePos.y) / 2}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {formatDelta(deltaFranchiseStore, metric.unit)}
          </div>
        )}

        {/* Bubbles - only render active ones */}
        {showBrand && (
          <Bubble
            level="brand"
            value={metric.brandValue}
            unit={metric.unit}
            x={brandPos.x}
            y={brandPos.y}
            size={brandSize}
          />
        )}
        {showFranchise && (
          <Bubble
            level="franchisee"
            value={metric.franchiseeValue}
            unit={metric.unit}
            x={franchiseePos.x}
            y={franchiseePos.y}
            size={franchiseeSize}
          />
        )}
        {showStore && (
          <Bubble
            level="store"
            value={metric.storeValue}
            unit={metric.unit}
            x={storePos.x}
            y={storePos.y}
            size={storeSize}
          />
        )}
      </div>

      {/* Legend - only show active levels */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
        {showBrand && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-900" />
            <span>Brand</span>
          </div>
        )}
        {showFranchise && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Franchisee</span>
          </div>
        )}
        {showStore && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span>Store</span>
          </div>
        )}
      </div>
    </div>
  );
}

