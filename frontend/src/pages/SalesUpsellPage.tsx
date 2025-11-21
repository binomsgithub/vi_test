import { useEffect, useState } from 'react';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { StoreTable } from '../components/tables/StoreTable';
import { ItemTable } from '../components/tables/ItemTable';
import { MetricSelector } from '../components/compare/MetricSelector';
import { BubbleTriadGrid } from '../components/compare/BubbleTriadGrid';
import { NarrativePanel } from '../components/narrative/NarrativePanel';
import { PageHeader } from '../components/layout/PageHeader';
import { getSalesUpsell } from '../api/salesUpsell';
import { ColumnDef } from '../types/tables';
import { NarrativeContent } from '../types/narrative';
import { useFilters } from '../context/FiltersContext';
import { getActiveLevels } from '../utils/levels';

const UPSELL_METRICS = [
  { id: 'overall_upsell_attempt_pct', label: 'Overall Upsell Attempt %' },
  { id: 'overall_upsell_success_pct', label: 'Overall Upsell Success %' },
  { id: 'greeting_upsell_attempt_pct', label: 'Greeting Upsell Attempts %' },
  { id: 'greeting_upsell_success_pct', label: 'Greeting Upsell Success %' },
  { id: 'cart_upsell_attempt_pct', label: 'Cart Upsell Attempts %' },
  { id: 'cart_upsell_success_pct', label: 'Cart Upsell Success %' },
  { id: 'upsize_attempt_pct', label: 'Upsize Attempts %' },
  { id: 'upsize_success_pct', label: 'Upsize Success %' },
];

export function SalesUpsellPage() {
  const { filters } = useFilters();
  const { active: activeLevels } = getActiveLevels(filters);
  const [data, setData] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState('overall_upsell_attempt_pct');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSalesUpsell()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const selectedMetricOption = UPSELL_METRICS.find(m => m.id === selectedMetric);
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
      id: 'store_id',
      header: 'Store ID',
      accessor: (row) => row.store_id,
    },
    {
      id: 'greeting_upsell_attempt_pct',
      header: 'Greeting Upsell Attempts %',
      accessor: (row) => `${row.greeting_upsell_attempt_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'greeting_upsell_success_pct',
      header: 'Greeting Upsell Success %',
      accessor: (row) => `${row.greeting_upsell_success_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'cart_upsell_attempt_pct',
      header: 'Cart Upsell Attempts %',
      accessor: (row) => `${row.cart_upsell_attempt_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'cart_upsell_success_pct',
      header: 'Cart Upsell Success %',
      accessor: (row) => `${row.cart_upsell_success_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'upsize_attempt_pct',
      header: 'Upsize Attempts %',
      accessor: (row) => `${row.upsize_attempt_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'upsize_success_pct',
      header: 'Upsize Success %',
      accessor: (row) => `${row.upsize_success_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'overall_upsell_attempt_pct',
      header: 'Overall Upsell Attempt %',
      accessor: (row) => `${row.overall_upsell_attempt_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'overall_upsell_success_pct',
      header: 'Overall Upsell Success %',
      accessor: (row) => `${row.overall_upsell_success_pct?.toFixed(1) || 0}%`,
    },
  ];

  // Compute insights from data
  const levelCompare = data.brandFranchiseStoreCompare || [];
  const overallAttempt = levelCompare.find(m => m.id === 'overall_upsell_attempt_pct');
  const overallSuccess = levelCompare.find(m => m.id === 'overall_upsell_success_pct');
  const greetingAttempt = levelCompare.find(m => m.id === 'greeting_upsell_attempt_pct');
  const greetingSuccess = levelCompare.find(m => m.id === 'greeting_upsell_success_pct');
  const cartAttempt = levelCompare.find(m => m.id === 'cart_upsell_attempt_pct');
  const upsizeAttempt = levelCompare.find(m => m.id === 'upsize_attempt_pct');
  const upsizeSuccess = levelCompare.find(m => m.id === 'upsize_success_pct');
  
  const greetingItems = data.greetingItems || [];
  const topGreetingItem = greetingItems.reduce((max: any, curr: any) => 
    (curr.success / (curr.attempts || 1)) > (max?.success / (max?.attempts || 1)) ? curr : max, greetingItems[0]);
  const greetingSuccessRate = topGreetingItem ? (topGreetingItem.success / topGreetingItem.attempts * 100) : 0;
  
  const storeRows = data.storeRows || [];
  const avgUpsellAttempt = storeRows.length > 0
    ? storeRows.reduce((sum: number, row: any) => sum + (parseFloat(row.overall_upsell_attempt_pct) || 0), 0) / storeRows.length
    : 0;

  const narrative: NarrativeContent = {
    title: "Upsell Performance Insights",
    blocks: [
      {
        id: "overall-funnel",
        heading: "Overall Upsell Funnel Health",
        body: `${overallAttempt ? `Overall attempt rate is ${overallAttempt.brandValue.toFixed(1)}% brand-wide, ${overallAttempt.franchiseeValue.toFixed(1)}% franchisee-level, and ${overallAttempt.storeValue.toFixed(1)}% at stores—a ${(overallAttempt.brandValue - overallAttempt.storeValue).toFixed(1)} percentage point opportunity gap. ` : ''}${overallSuccess ? `Success rate is ${overallSuccess.storeValue.toFixed(1)}% store-level, meaning ${overallAttempt ? (overallAttempt.storeValue * overallSuccess.storeValue / 100).toFixed(1) : 'N/A'}% of all orders include a successful upsell. ` : ''}${overallAttempt && overallSuccess ? `Conversion rate (success/attempt) is ${(overallSuccess.storeValue / overallAttempt.storeValue * 100).toFixed(1)}%—${(overallSuccess.storeValue / overallAttempt.storeValue * 100) > 50 ? 'strong' : 'needs improvement'}. ` : ''}Target stores below ${overallAttempt ? (overallAttempt.storeValue * 0.9).toFixed(1) : '65'}% attempt rate.`
      },
      {
        id: "greeting-cart",
        heading: "Greeting vs Cart Performance",
        body: `${greetingAttempt && cartAttempt ? `Greeting attempts (${greetingAttempt.storeValue.toFixed(1)}%) are ${(cartAttempt.storeValue - greetingAttempt.storeValue).toFixed(1)} percentage points lower than cart attempts (${cartAttempt.storeValue.toFixed(1)}%). ` : ''}${greetingSuccess && cartAttempt ? `Greeting success rate is ${greetingSuccess.storeValue.toFixed(1)}% vs cart at ${(cartAttempt.storeValue * (greetingSuccess.storeValue / greetingAttempt.storeValue)).toFixed(1)}% estimated. ` : ''}${greetingAttempt && greetingAttempt.storeValue < cartAttempt.storeValue ? `Early-stage upsells are underutilized—increase greeting attempts to ${(cartAttempt.storeValue * 0.9).toFixed(1)}% to capture more revenue. ` : 'Both stages performing well.'}`
      },
      {
        id: "upsize-performance",
        heading: "Upsize Conversion Trends",
        body: `${upsizeAttempt ? `Upsize attempts are at ${upsizeAttempt.storeValue.toFixed(1)}% store-level, ${upsizeSuccess ? `with ${upsizeSuccess.storeValue.toFixed(1)}% success rate—a ${(upsizeSuccess.storeValue / upsizeAttempt.storeValue * 100).toFixed(1)}% conversion. ` : ''}` : ''}${upsizeAttempt && overallAttempt ? `Upsize represents ${(upsizeAttempt.storeValue / overallAttempt.storeValue * 100).toFixed(0)}% of all upsell attempts. ` : ''}${upsizeSuccess && upsizeSuccess.storeValue < 15 ? `Upsize success below 15% indicates opportunity—focus training on value communication for drinks and fries. ` : 'Upsize performance is on target.'}`
      },
      {
        id: "item-resonance",
        heading: "Top Performing Items",
        body: `${topGreetingItem ? `Best converting greeting item: "${topGreetingItem.item_name}" with ${greetingSuccessRate.toFixed(1)}% success rate (${topGreetingItem.success}/${topGreetingItem.attempts} attempts). ` : ''}${greetingItems.length > 0 ? `Total greeting items attempted: ${greetingItems.reduce((sum: number, item: any) => sum + item.attempts, 0)}. ` : ''}Focus coaching on replicating "${topGreetingItem?.item_name || 'top items'}" success across all stores. Items with <${(greetingSuccessRate * 0.7).toFixed(1)}% success need offer refinement.`
      },
      {
        id: "store-revenue",
        heading: "Store-Level Revenue Opportunity",
        body: `Average upsell attempt across stores is ${avgUpsellAttempt.toFixed(1)}%. ${storeRows.length > 0 ? `${storeRows.filter((s: any) => parseFloat(s.overall_upsell_attempt_pct) < avgUpsellAttempt * 0.9).length} stores are below ${(avgUpsellAttempt * 0.9).toFixed(1)}% and represent the highest ROI coaching targets. ` : ''}${overallAttempt ? `If all stores reached ${overallAttempt.brandValue.toFixed(1)}% attempt rate (brand target), estimated revenue lift is ${((overallAttempt.brandValue - avgUpsellAttempt) * 0.5).toFixed(1)} percentage points. ` : ''}Prioritize stores with high volume but low upsell rates for maximum impact.`
      }
    ]
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales & Upsell Performance"
        description="See how well teams drive add-ons, upsizes, and incremental revenue per call."
      />
      
      <BubbleTriadGrid metrics={data.brandFranchiseStoreCompare || []} activeLevels={activeLevels} />

      <NarrativePanel content={narrative} />

      <div>
        <MetricSelector 
          value={selectedMetric} 
          onChange={setSelectedMetric}
          options={UPSELL_METRICS}
        />
        <TimeSeriesChart
          title={`${selectedMetricOption?.label || selectedMetric} by Hour`}
          xLabel="Hour"
          yLabel={selectedMetricOption?.label}
          series={chartSeries}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ItemTable items={data.greetingItems} title="Greeting Upsell" />
        <ItemTable items={data.cartItems} title="Cart Upsell" />
        <ItemTable items={data.upsizeItems} title="Upsize" />
      </div>

      <StoreTable columns={storeColumns} data={data.storeRows} title="Store-Level Upsell Metrics" />
    </div>
  );
}

