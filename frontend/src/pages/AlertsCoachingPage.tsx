import { useEffect, useState } from 'react';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { AlertsTable } from '../components/tables/AlertsTable';
import { MetricSelector } from '../components/compare/MetricSelector';
import { SalesUpsellLevelCompareStrip } from '../components/compare/SalesUpsellLevelCompareStrip';
import { NarrativePanel } from '../components/narrative/NarrativePanel';
import { PageHeader } from '../components/layout/PageHeader';
import { getAlerts } from '../api/alerts';
import { NarrativeContent } from '../types/narrative';

const ALERT_METRICS = [
  { id: 'disrespectful_language', label: 'Disrespectful Language' },
  { id: 'unfriendly_tone', label: 'Unfriendly Tone' },
  { id: 'repeated_mistakes', label: 'Repeated Mistakes' },
  { id: 'missed_allergy_disclosure', label: 'Missed Allergy Disclosure' },
  { id: 'item_unavailability', label: 'Item Unavailability' },
  { id: 'discount_requested', label: 'Discount Requested' },
  { id: 'coupon_mentioned', label: 'Coupon Mentioned' },
  { id: 'guest_complaint', label: 'Guest Complaint' },
  { id: 'price_objection', label: 'Price Objection' },
];

export function AlertsCoachingPage() {
  const [data, setData] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState('disrespectful_language');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAlerts()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const selectedMetricOption = ALERT_METRICS.find(m => m.id === selectedMetric);
  const timeSeriesData = data.timeSeries[selectedMetric] || [];
  const chartSeries = [
    {
      id: selectedMetric,
      label: selectedMetricOption?.label || selectedMetric,
      data: timeSeriesData,
    },
  ];

  // Compute insights from data
  const levelCompare = data.brandFranchiseStoreCompare || [];
  const disrespectful = levelCompare.find(m => m.id === 'disrespectful_language');
  const unfriendlyTone = levelCompare.find(m => m.id === 'unfriendly_tone');
  const repeatedMistakes = levelCompare.find(m => m.id === 'repeated_mistakes');
  const allergyDisclosure = levelCompare.find(m => m.id === 'missed_allergy_disclosure');
  const itemUnavailable = levelCompare.find(m => m.id === 'item_unavailability');
  const discountRequested = levelCompare.find(m => m.id === 'discount_requested');
  const guestComplaint = levelCompare.find(m => m.id === 'guest_complaint');
  const trainingClips = levelCompare.find(m => m.id === 'training_clips');
  const idealConversations = levelCompare.find(m => m.id === 'ideal_conversations');
  
  const callRows = data.callRows || [];
  const totalCalls = callRows.length;
  const disrespectfulCount = callRows.filter((r: any) => r.disrespectful_language === 'Yes').length;
  const unfriendlyCount = callRows.filter((r: any) => r.unfriendly_tone === 'Yes').length;
  const allergyCount = callRows.filter((r: any) => r.missed_allergy_disclosure === 'Yes').length;
  const complaintCount = callRows.filter((r: any) => r.guest_complaint === 'Yes').length;
  
  // Find peak alert hour
  const hourlyAlerts = data.timeSeries.disrespectful_language || [];
  const peakAlertHour = hourlyAlerts.reduce((max: any, curr: any) => 
    curr.y > (max?.y || 0) ? curr : max, hourlyAlerts[0]);

  const narrative: NarrativeContent = {
    title: "Alerts & Coaching Insights",
    blocks: [
      {
        id: "risk-alerts",
        heading: "Critical Risk Indicators",
        body: `${disrespectful ? `Disrespectful language: ${disrespectful.storeValue} incidents store-level (${disrespectful.brandValue} brand-wide). ` : ''}${unfriendlyTone ? `Unfriendly tone: ${unfriendlyTone.storeValue} cases. ` : ''}${repeatedMistakes ? `Repeated mistakes: ${repeatedMistakes.storeValue} occurrences. ` : ''}${allergyDisclosure ? `Missed allergy disclosures: ${allergyDisclosure.storeValue}—${allergyDisclosure.storeValue > 50 ? 'CRITICAL safety risk' : 'monitor closely'}. ` : ''}${totalCalls > 0 ? `Out of ${totalCalls} calls analyzed, ${disrespectfulCount} (${(disrespectfulCount / totalCalls * 100).toFixed(1)}%) had disrespectful language and ${allergyCount} (${(allergyCount / totalCalls * 100).toFixed(1)}%) missed allergy disclosures. ` : ''}${disrespectfulCount > 0 || allergyCount > 0 ? 'Immediate coaching required for these high-risk interactions.' : 'No critical alerts detected.'}`
      },
      {
        id: "service-friction",
        heading: "Operational Friction Points",
        body: `${itemUnavailable ? `Item unavailability: ${itemUnavailable.storeValue} incidents store-level—${itemUnavailable.storeValue > 200 ? 'high inventory issues' : 'manageable'}. ` : ''}${discountRequested ? `Discount requests: ${discountRequested.storeValue} cases. ` : ''}${guestComplaint ? `Guest complaints: ${guestComplaint.storeValue} (${guestComplaint.brandValue} brand-wide). ` : ''}${totalCalls > 0 ? `${complaintCount} calls (${(complaintCount / totalCalls * 100).toFixed(1)}%) had guest complaints. ` : ''}${itemUnavailable && itemUnavailable.storeValue > 200 ? `Inventory management needs attention—${itemUnavailable.storeValue} unavailable items suggests supply chain or ordering issues. ` : ''}${discountRequested && discountRequested.storeValue > 250 ? `High discount requests (${discountRequested.storeValue}) may indicate pricing sensitivity—review promotional strategy. ` : ''}`
      },
      {
        id: "training-ideal",
        heading: "Positive Examples Available",
        body: `${trainingClips ? `Training clips available: ${trainingClips.storeValue} store-level examples. ` : ''}${idealConversations ? `Ideal conversations: ${idealConversations.storeValue} calls (${idealConversations.brandValue} brand-wide) demonstrate best practices. ` : ''}${idealConversations && totalCalls > 0 ? `This represents ${(idealConversations.storeValue / totalCalls * 100).toFixed(1)}% of all calls—${(idealConversations.storeValue / totalCalls * 100) > 80 ? 'excellent baseline' : 'room for improvement'}. ` : ''}${trainingClips && trainingClips.storeValue > 0 ? `Use these ${trainingClips.storeValue} clips in coaching sessions to show desired behaviors. ` : ''}${idealConversations && idealConversations.storeValue < idealConversations.brandValue * 0.9 ? `Target increasing ideal conversations to ${(idealConversations.brandValue * 0.9).toFixed(0)}+ through focused training.` : 'Ideal conversation rate is healthy.'}`
      },
      {
        id: "time-patterns",
        heading: "Peak Alert Times",
        body: `${peakAlertHour ? `Peak alert hour: ${peakAlertHour.x} with ${peakAlertHour.y} disrespectful language incidents. ` : ''}${hourlyAlerts.length > 0 ? `Alert trend shows ${hourlyAlerts[0]?.y < hourlyAlerts[hourlyAlerts.length - 1]?.y ? 'increasing' : 'decreasing'} pressure throughout the day. ` : ''}${peakAlertHour && peakAlertHour.y > 5 ? `High alert count (${peakAlertHour.y}) at ${peakAlertHour.x} suggests staffing or process gaps during peak hours. ` : ''}${peakAlertHour ? `Monitor ${peakAlertHour.x} closely—consider additional support or process adjustments if alerts exceed ${(peakAlertHour.y * 1.2).toFixed(0)} during this period. ` : ''}Review hourly trends to identify patterns and schedule coaching accordingly.`
      },
      {
        id: "coaching-queue",
        heading: "Prioritized Coaching List",
        body: `${totalCalls} calls in coaching queue. ${disrespectfulCount > 0 ? `${disrespectfulCount} require immediate attention for disrespectful language. ` : ''}${allergyCount > 0 ? `${allergyCount} need safety training for missed allergy disclosures. ` : ''}${complaintCount > 0 ? `${complaintCount} guest complaints need resolution review. ` : ''}${totalCalls > 0 ? `Priority order: ${allergyCount > 0 ? '1) Safety (allergy disclosures), ' : ''}${disrespectfulCount > 0 ? '2) Brand risk (disrespectful language), ' : ''}${complaintCount > 0 ? '3) Guest satisfaction (complaints)' : ''}. ` : ''}${totalCalls > 0 ? `${(totalCalls - disrespectfulCount - allergyCount - complaintCount)} calls are lower priority but still need review. ` : ''}Use manager summaries and recording links to provide targeted, specific feedback.`
      }
    ]
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts & Coaching Queue"
        description="Monitor risk alerts, service friction signals, and prioritize calls for targeted coaching reviews."
      />
      
      <SalesUpsellLevelCompareStrip
        title="Alerts – Brand vs Franchisee vs Store"
        metrics={data.brandFranchiseStoreCompare || []}
      />

      <NarrativePanel content={narrative} />

      <div>
        <MetricSelector 
          value={selectedMetric} 
          onChange={setSelectedMetric}
          options={ALERT_METRICS}
        />
        <TimeSeriesChart
          title={`${selectedMetricOption?.label || selectedMetric} by Hour`}
          xLabel="Hour"
          yLabel="Count"
          series={chartSeries}
        />
      </div>

      <AlertsTable alerts={data.callRows} />
    </div>
  );
}

