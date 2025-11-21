import { LevelCompareMetric } from '../../types/metrics';

interface HeroMetricSwitcherProps {
  metrics: LevelCompareMetric[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function HeroMetricSwitcher({
  metrics,
  selectedId,
  onChange,
}: HeroMetricSwitcherProps) {
  if (!metrics?.length) return null;

  return (
    <div className="inline-flex bg-slate-100 rounded-full p-1 text-xs">
      {metrics.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`px-3 py-1 rounded-full transition-all ${
            selectedId === m.id
              ? 'bg-white shadow-sm text-slate-900 font-medium'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

