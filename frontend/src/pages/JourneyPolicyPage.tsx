import { useEffect, useState } from 'react';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { StoreTable } from '../components/tables/StoreTable';
import { MetricSelector } from '../components/compare/MetricSelector';
import { LevelCompareMatrix } from '../components/compare/LevelCompareMatrix';
import { NarrativePanel } from '../components/narrative/NarrativePanel';
import { PageHeader } from '../components/layout/PageHeader';
import { getJourneyPolicy } from '../api/journeyPolicy';
import { ColumnDef } from '../types/tables';
import { METRIC_OPTIONS } from '../types/metrics';
import { NarrativeContent } from '../types/narrative';
import { useFilters } from '../context/FiltersContext';
import { getActiveLevels } from '../utils/levels';

const JOURNEY_METRICS = [
  { id: 'policy_adherence_rate', label: 'Policy Adherence Rate' },
  { id: 'brand_greeting_pct', label: 'Brand Greeting %' },
  { id: 'engaged_without_wait_pct', label: 'Engaged w/o wait %' },
  { id: 'personalization_pct', label: 'Personalization %' },
  { id: 'mobile_checkin_pct', label: 'Mobile Check-In %' },
  { id: 'loyalty_check_pct', label: 'Loyalty Check %' },
  { id: 'cart_confirmation_pct', label: 'Cart Confirmation %' },
  { id: 'price_confirmation_pct', label: 'Price Confirmation %' },
];

export function JourneyPolicyPage() {
  const { filters } = useFilters();
  const { active: activeLevels } = getActiveLevels(filters);
  const [data, setData] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState('policy_adherence_rate');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getJourneyPolicy()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const selectedMetricOption = JOURNEY_METRICS.find(m => m.id === selectedMetric);
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
      id: 'policy_adherence_rate',
      header: 'Policy Adherence Rate',
      accessor: (row) => `${row.policy_adherence_rate?.toFixed(1) || 0}%`,
    },
    {
      id: 'brand_greeting_pct',
      header: 'Brand Greeting %',
      accessor: (row) => `${row.brand_greeting_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'engaged_without_wait_pct',
      header: 'Engaged w/o wait %',
      accessor: (row) => `${row.engaged_without_wait_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'personalization_pct',
      header: 'Personalization %',
      accessor: (row) => `${row.personalization_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'mobile_checkin_pct',
      header: 'Mobile Check-In %',
      accessor: (row) => `${row.mobile_checkin_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'loyalty_check_pct',
      header: 'Loyalty Check %',
      accessor: (row) => `${row.loyalty_check_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'cart_confirmation_pct',
      header: 'Cart Confirmation %',
      accessor: (row) => `${row.cart_confirmation_pct?.toFixed(1) || 0}%`,
    },
    {
      id: 'price_confirmation_pct',
      header: 'Price Confirmation %',
      accessor: (row) => `${row.price_confirmation_pct?.toFixed(1) || 0}%`,
    },
  ];

  // Compute insights from data
  const levelCompare = data.brandFranchiseStoreCompare || [];
  const policyRate = levelCompare.find(m => m.id === 'policy_adherence_rate');
  const brandGreeting = levelCompare.find(m => m.id === 'brand_greeting_pct');
  const engagedWait = levelCompare.find(m => m.id === 'engaged_without_wait_pct');
  const personalization = levelCompare.find(m => m.id === 'personalization_pct');
  const mobileCheckin = levelCompare.find(m => m.id === 'mobile_checkin_pct');
  const cartConfirm = levelCompare.find(m => m.id === 'cart_confirmation_pct');
  const priceConfirm = levelCompare.find(m => m.id === 'price_confirmation_pct');
  
  const storeRows = data.storeRows || [];
  const avgPolicyRate = storeRows.length > 0 
    ? storeRows.reduce((sum: number, row: any) => sum + (parseFloat(row.policy_adherence_rate) || 0), 0) / storeRows.length 
    : 0;
  const topPolicyStore = storeRows.reduce((max: any, curr: any) => 
    (parseFloat(curr.policy_adherence_rate) || 0) > (parseFloat(max?.policy_adherence_rate) || 0) ? curr : max, storeRows[0]);
  const lowPolicyStore = storeRows.reduce((min: any, curr: any) => 
    (parseFloat(curr.policy_adherence_rate) || 0) < (parseFloat(min?.policy_adherence_rate) || 0) ? curr : min, storeRows[0]);

  const narrative: NarrativeContent = {
    title: "Policy Adherence Insights",
    blocks: [
      {
        id: "greeting-contact",
        heading: "First Contact Performance",
        body: `${brandGreeting ? `Brand greeting rate is ${brandGreeting.brandValue.toFixed(1)}% at brand level, dropping to ${brandGreeting.storeValue.toFixed(1)}% at store level—a ${(brandGreeting.brandValue - brandGreeting.storeValue).toFixed(1)} percentage point gap. ` : ''}${engagedWait ? `Engaged without wait stands at ${engagedWait.brandValue.toFixed(1)}% brand-wide vs ${engagedWait.storeValue.toFixed(1)}% store-level. ` : ''}Stores below ${brandGreeting ? (brandGreeting.storeValue * 0.95).toFixed(1) : '85'}% brand greeting need immediate script reinforcement.`
      },
      {
        id: "personalization-loyalty",
        heading: "Personalization & Loyalty Trends",
        body: `${personalization ? `Personalization usage is ${personalization.brandValue.toFixed(1)}% brand-wide, ${personalization.franchiseeValue.toFixed(1)}% at franchisee level, and ${personalization.storeValue.toFixed(1)}% at stores—showing ${personalization.storeValue < personalization.brandValue ? 'underutilization' : 'strong adoption'}. ` : ''}${mobileCheckin ? `Mobile check-in recognition is at ${mobileCheckin.storeValue.toFixed(1)}% store-level. ` : ''}Target stores below ${personalization ? (personalization.storeValue * 0.9).toFixed(1) : '70'}% personalization for training on leveraging guest data.`
      },
      {
        id: "order-accuracy",
        heading: "Confirmation Rates & Risk",
        body: `${cartConfirm ? `Cart confirmation is ${cartConfirm.brandValue.toFixed(1)}% brand-level, ${cartConfirm.storeValue.toFixed(1)}% store-level. ` : ''}${priceConfirm ? `Price confirmation shows ${priceConfirm.brandValue.toFixed(1)}% brand vs ${priceConfirm.storeValue.toFixed(1)}% store. ` : ''}${cartConfirm && priceConfirm ? `The ${(cartConfirm.brandValue - cartConfirm.storeValue).toFixed(1)} and ${(priceConfirm.brandValue - priceConfirm.storeValue).toFixed(1)} percentage point gaps indicate ${((cartConfirm.brandValue - cartConfirm.storeValue) + (priceConfirm.brandValue - priceConfirm.storeValue)) / 2 > 2 ? 'elevated error risk' : 'acceptable variance'}. ` : ''}Stores with confirmations below ${cartConfirm ? (cartConfirm.storeValue * 0.95).toFixed(1) : '90'}% need order accuracy coaching.`
      },
      {
        id: "store-consistency",
        heading: "Store-Level Policy Gaps",
        body: `Average policy adherence across stores is ${avgPolicyRate.toFixed(1)}%. ${topPolicyStore ? `Top performer: ${topPolicyStore.store_id} at ${topPolicyStore.policy_adherence_rate?.toFixed(1) || 'N/A'}%. ` : ''}${lowPolicyStore && topPolicyStore ? `Lowest: ${lowPolicyStore.store_id} at ${lowPolicyStore.policy_adherence_rate?.toFixed(1) || 'N/A'}%—a ${(parseFloat(topPolicyStore.policy_adherence_rate) - parseFloat(lowPolicyStore.policy_adherence_rate)).toFixed(1)} percentage point gap. ` : ''}${policyRate ? `Brand target is ${policyRate.brandValue.toFixed(1)}%; ${storeRows.filter((s: any) => parseFloat(s.policy_adherence_rate) < policyRate.brandValue * 0.95).length} stores are below ${(policyRate.brandValue * 0.95).toFixed(1)}% and need focused coaching.` : 'Review store table for specific gaps.'}`
      }
    ]
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Flow & Policy"
        description="Track each step of the guest journey and adherence to required policy behaviors."
      />
      
      <LevelCompareMatrix metrics={data.brandFranchiseStoreCompare || []} activeLevels={activeLevels} />

      <NarrativePanel content={narrative} />

      <div>
        <MetricSelector 
          value={selectedMetric} 
          onChange={setSelectedMetric}
          options={JOURNEY_METRICS}
        />
        <TimeSeriesChart
          title={`${selectedMetricOption?.label || selectedMetric} by Hour`}
          xLabel="Hour"
          yLabel={selectedMetricOption?.label}
          series={chartSeries}
        />
      </div>

      <StoreTable columns={storeColumns} data={data.storeRows} title="Store-Level Policy Metrics" />
    </div>
  );
}

