import { useEffect, useState } from 'react';
import { KpiGrid } from '../components/kpi/KpiGrid';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { StoreTable } from '../components/tables/StoreTable';
import { MetricSelector } from '../components/compare/MetricSelector';
import { TripleGaugeCompare } from '../components/compare/TripleGaugeCompare';
import { LevelScopeHint } from '../components/compare/LevelScopeHint';
import { NarrativePanel } from '../components/narrative/NarrativePanel';
import { PageHeader } from '../components/layout/PageHeader';
import { getOverview } from '../api/overview';
import { useFilters } from '../context/FiltersContext';
import { ColumnDef } from '../types/tables';
import { METRIC_OPTIONS } from '../types/metrics';
import { NarrativeContent } from '../types/narrative';
import { LevelCompareMetric } from '../types/metrics';
import { getActiveLevels } from '../utils/levels';

export function OverviewPage() {
  const { filters } = useFilters();
  const { active: activeLevels } = getActiveLevels(filters);
  const [data, setData] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState('total_sessions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOverview(filters)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters.brand, filters.franchiseId, filters.storeId, filters.owner, filters.channel, filters.engagementMode, filters.callDate]);

  // Filter key metrics for hero switcher (3-5 key metrics)
  const allLevelMetrics: LevelCompareMetric[] = data?.brandFranchiseStoreCompare || [];
  const keyMetricIds = [
    'policy_adherence_rate',
    'upsell_attempt_rate',
    'friendliness_score',
    'order_handle_time',
    'average_check'
  ];
  const overviewLevelMetrics = allLevelMetrics.filter(m => keyMetricIds.includes(m.id));


  if (loading || !data) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const selectedMetricOption = METRIC_OPTIONS.find(m => m.id === selectedMetric);
  const timeSeriesData = data.timeSeries[selectedMetric] || [];
  const chartSeries = [
    {
      id: selectedMetric,
      label: selectedMetricOption?.label || selectedMetric,
      data: timeSeriesData,
    },
  ];

  const storeColumns: ColumnDef<any>[] = [
    {
      id: 'franchisee_id',
      header: 'Franchisee ID',
      accessor: (row) => row.franchisee_id || row.franchise_id || 'N/A',
    },
    {
      id: 'store_id',
      header: 'Store ID',
      accessor: (row) => row.store_id,
    },
    {
      id: 'total_sessions',
      header: 'Total Sessions',
      accessor: (row) => row.total_sessions || 0,
    },
    {
      id: 'order_handle_time',
      header: 'Order Handle Time',
      accessor: (row) => `${row.order_handle_time?.toFixed(1) || 0} mins`,
    },
    {
      id: 'policy_adherence_rate',
      header: 'Policy Adherence Rate',
      accessor: (row) => `${row.policy_adherence_rate?.toFixed(1) || 0}%`,
    },
    {
      id: 'upsell_attempt_rate',
      header: 'Upsell Attempt Rate',
      accessor: (row) => `${row.upsell_attempt_rate?.toFixed(1) || 0}%`,
    },
    {
      id: 'friendliness_score',
      header: 'Friendliness Score',
      accessor: (row) => row.friendliness_score?.toFixed(1) || 'N/A',
    },
  ];

  // Filter kpisVolume to only include volume/AOV metrics (exclude order_handle_time)
  const volumeKpis = data.kpisVolume.filter(kpi => 
    kpi.id !== 'order_handle_time'
  );

  // Compute insights from data
  const totalSessions = volumeKpis.find(k => k.id === 'total_sessions')?.value || 0;
  const avgCheck = volumeKpis.find(k => k.id === 'average_check')?.value || 0;
  const levelCompare = data.brandFranchiseStoreCompare || [];
  const policyRate = levelCompare.find(m => m.id === 'policy_adherence_rate');
  const upsellRate = levelCompare.find(m => m.id === 'upsell_attempt_rate');
  const handleTime = levelCompare.find(m => m.id === 'order_handle_time');
  
  // Find peak hour from time series
  const hourlySessions = data.timeSeries.total_sessions || [];
  const peakHourData = hourlySessions.reduce((max: any, curr: any) => 
    curr.y > (max?.y || 0) ? curr : max, null);
  const peakHour = peakHourData?.x || 'N/A';
  const peakSessions = peakHourData?.y || 0;
  
  // Store performance analysis
  const storeRows = data.storeRows || [];
  const topStore = storeRows.reduce((max: any, curr: any) => 
    (curr.total_sessions || 0) > (max?.total_sessions || 0) ? curr : max, storeRows[0]);
  const bottomStore = storeRows.reduce((min: any, curr: any) => 
    (curr.total_sessions || 0) < (min?.total_sessions || 0) ? curr : min, storeRows[0]);

  const narrative: NarrativeContent = {
    title: "Performance Insights",
    blocks: [
      {
        id: "volume-efficiency",
        heading: "Volume & Efficiency Trends",
        body: `Today's total sessions reached ${totalSessions.toLocaleString()}, with peak activity at ${peakHour} (${peakSessions} sessions). Average check stands at $${avgCheck.toFixed(2)}, ${handleTime ? `while order handle time shows ${handleTime.brandValue.toFixed(1)} mins at brand level vs ${handleTime.storeValue.toFixed(1)} mins at store level—a ${((handleTime.storeValue - handleTime.brandValue) / handleTime.brandValue * 100).toFixed(1)}% gap indicating efficiency opportunities.` : 'indicating strong revenue per transaction.'}`
      },
      {
        id: "quality-sales",
        heading: "Quality & Sales Performance",
        body: `${policyRate ? `Policy adherence is ${policyRate.brandValue.toFixed(1)}% at brand level, ${policyRate.franchiseeValue.toFixed(1)}% at franchisee level, and ${policyRate.storeValue.toFixed(1)}% at store level. ` : ''}${upsellRate ? `Upsell attempt rate shows ${upsellRate.brandValue.toFixed(1)}% brand-wide, with a ${(upsellRate.brandValue - upsellRate.storeValue).toFixed(1)} percentage point gap to store level (${upsellRate.storeValue.toFixed(1)}%). ` : ''}Look for stores below ${policyRate?.storeValue.toFixed(1) || '90'}% policy adherence or ${upsellRate?.storeValue.toFixed(1) || '65'}% upsell attempts as coaching opportunities.`
      },
      {
        id: "peak-hours",
        heading: "Peak Hour Analysis",
        body: `The busiest hour is ${peakHour} with ${peakSessions} sessions. ${hourlySessions.length > 0 ? `Handle time trends show ${hourlySessions[0]?.y < hourlySessions[hourlySessions.length - 1]?.y ? 'increasing' : 'decreasing'} pressure throughout the day. ` : ''}Monitor ${peakHour} closely for staffing needs—if handle time exceeds ${handleTime ? (handleTime.brandValue * 1.2).toFixed(1) : '3.0'} mins during peak, consider additional support.`
      },
      {
        id: "store-performance",
        heading: "Store Performance Gaps",
        body: `${topStore ? `Top performer: ${topStore.store_id} with ${topStore.total_sessions} sessions and ${topStore.policy_adherence_rate?.toFixed(1) || 'N/A'}% policy adherence. ` : ''}${bottomStore && topStore ? `Bottom performer: ${bottomStore.store_id} with ${bottomStore.total_sessions} sessions (${((1 - bottomStore.total_sessions / topStore.total_sessions) * 100).toFixed(0)}% lower volume). ` : ''}Focus coaching on stores with handle time above ${handleTime ? (handleTime.storeValue * 1.1).toFixed(1) : '2.8'} mins or policy adherence below ${policyRate ? (policyRate.storeValue * 0.95).toFixed(1) : '90'}%.`
      }
    ],
    footerNote: "Key action: Review stores with >10% gaps vs brand averages for targeted support."
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Overview"
        description="High-level call volume, efficiency, quality, and sales snapshot for the selected filters."
      />
      
          {overviewLevelMetrics.length > 0 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Key Metrics Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Compare Brand vs Franchisee vs Store performance across key metrics.
                </p>
              </div>
              <LevelScopeHint activeLevels={activeLevels} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewLevelMetrics.map((metric) => (
                  <TripleGaugeCompare key={metric.id} metric={metric} activeLevels={activeLevels} />
                ))}
              </div>
            </div>
          )}

      <div>
        <h3 className="text-lg font-semibold mb-3">Volume & Revenue</h3>
        <KpiGrid kpis={volumeKpis} />
      </div>

      <NarrativePanel content={narrative} />

      <div>
        <MetricSelector value={selectedMetric} onChange={setSelectedMetric} />
        <TimeSeriesChart
          title={`${selectedMetricOption?.label || selectedMetric} by Hour`}
          xLabel="Hour"
          yLabel={selectedMetricOption?.label}
          series={chartSeries}
        />
      </div>

      <StoreTable columns={storeColumns} data={data.storeRows} title="Store Summary" />
    </div>
  );
}

