import { KpiDefinition } from '../../types/metrics';
import { KpiCard } from './KpiCard';

interface KpiGridProps {
  kpis: KpiDefinition[];
}

export function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

