import { useEffect, useState } from 'react';
import { DistributionChart } from '../components/charts/DistributionChart';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { StoreTable } from '../components/tables/StoreTable';
import { DeltaChipList } from '../components/compare/DeltaChipList';
import { NarrativePanel } from '../components/narrative/NarrativePanel';
import { PageHeader } from '../components/layout/PageHeader';
import { getFriendliness } from '../api/friendliness';
import { ColumnDef } from '../types/tables';
import { NarrativeContent } from '../types/narrative';
import { useFilters } from '../context/FiltersContext';
import { getActiveLevels } from '../utils/levels';

export function FriendlinessPage() {
  const { filters } = useFilters();
  const { active: activeLevels } = getActiveLevels(filters);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFriendliness()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Prepare multi-series chart data
  const friendlinessSeries = [
    {
      id: 'tone',
      label: 'Tone',
      data: data.timeSeries.tone || [],
    },
    {
      id: 'responsiveness',
      label: 'Responsiveness',
      data: data.timeSeries.responsiveness || [],
    },
    {
      id: 'patience',
      label: 'Patience',
      data: data.timeSeries.patience || [],
    },
    {
      id: 'engagement',
      label: 'Engagement',
      data: data.timeSeries.engagement || [],
    },
    {
      id: 'resolution',
      label: 'Resolution',
      data: data.timeSeries.resolution || [],
    },
    {
      id: 'friendliness_score',
      label: 'Friendliness Score',
      data: data.timeSeries.friendliness_score || [],
    },
    {
      id: 'guest_sentiment_score',
      label: 'Guest Sentiment Score',
      data: data.timeSeries.guest_sentiment_score || [],
    },
  ];

  const storeColumns: ColumnDef<any>[] = [
    {
      id: 'store_id',
      header: 'Store ID',
      accessor: (row) => row.store_id,
    },
    {
      id: 'friendliness_score',
      header: 'Friendliness Score',
      accessor: (row) => row.friendliness_score?.toFixed(1) || 'N/A',
    },
    {
      id: 'guest_sentiment_score',
      header: 'Guest Sentiment Score',
      accessor: (row) => row.guest_sentiment_score?.toFixed(1) || 'N/A',
    },
    {
      id: 'tone',
      header: 'Tone',
      accessor: (row) => row.tone?.toFixed(1) || 'N/A',
    },
    {
      id: 'responsiveness',
      header: 'Responsiveness',
      accessor: (row) => row.responsiveness?.toFixed(1) || 'N/A',
    },
    {
      id: 'patience',
      header: 'Patience',
      accessor: (row) => row.patience?.toFixed(1) || 'N/A',
    },
    {
      id: 'engagement',
      header: 'Engagement',
      accessor: (row) => row.engagement?.toFixed(1) || 'N/A',
    },
    {
      id: 'resolution',
      header: 'Resolution',
      accessor: (row) => row.resolution?.toFixed(1) || 'N/A',
    },
  ];

  // Compute insights from data
  const levelCompare = data.brandFranchiseStoreCompare || [];
  const friendlinessScore = levelCompare.find(m => m.id === 'friendliness_score');
  const sentimentScore = levelCompare.find(m => m.id === 'guest_sentiment_score');
  const tone = levelCompare.find(m => m.id === 'tone');
  const responsiveness = levelCompare.find(m => m.id === 'responsiveness');
  const patience = levelCompare.find(m => m.id === 'patience');
  const engagement = levelCompare.find(m => m.id === 'engagement');
  const resolution = levelCompare.find(m => m.id === 'resolution');
  
  const distribution = data.distribution || [];
  const warmCheerful = distribution.find(d => d.label === 'Warm and Cheerful');
  const courteous = distribution.find(d => d.label === 'Courteous');
  const unfriendly = distribution.find(d => d.label === 'Unfriendly');
  const tense = distribution.find(d => d.label === 'Tense');
  
  const storeRows = data.storeRows || [];
  const avgFriendliness = storeRows.length > 0
    ? storeRows.reduce((sum: number, row: any) => sum + (parseFloat(row.friendliness_score) || 0), 0) / storeRows.length
    : 0;
  const topStore = storeRows.reduce((max: any, curr: any) => 
    (parseFloat(curr.friendliness_score) || 0) > (parseFloat(max?.friendliness_score) || 0) ? curr : max, storeRows[0]);
  const lowStore = storeRows.reduce((min: any, curr: any) => 
    (parseFloat(curr.friendliness_score) || 0) < (parseFloat(min?.friendliness_score) || 0) ? curr : min, storeRows[0]);

  const narrative: NarrativeContent = {
    title: "Friendliness & Sentiment Insights",
    blocks: [
      {
        id: "tone-emotional",
        heading: "Overall Experience Scores",
        body: `${friendlinessScore ? `Friendliness score is ${friendlinessScore.brandValue.toFixed(1)} brand-wide, ${friendlinessScore.franchiseeValue.toFixed(1)} franchisee-level, and ${friendlinessScore.storeValue.toFixed(1)} at stores. ` : ''}${sentimentScore ? `Guest sentiment is ${sentimentScore.storeValue.toFixed(1)} store-level—${sentimentScore.storeValue >= 4.5 ? 'excellent' : sentimentScore.storeValue >= 4.0 ? 'good' : 'needs improvement'}. ` : ''}${tone ? `Tone scores ${tone.storeValue.toFixed(1)} at store level, ${tone.storeValue < tone.brandValue ? `${(tone.brandValue - tone.storeValue).toFixed(1)} points below brand target. ` : 'meeting brand standards. '}` : ''}${friendlinessScore && friendlinessScore.storeValue < 4.5 ? `Target stores below ${(friendlinessScore.storeValue * 0.95).toFixed(1)} for tone training.` : 'All stores performing well.'}`
      },
      {
        id: "responsiveness-patience",
        heading: "Service Quality Dimensions",
        body: `${responsiveness ? `Responsiveness: ${responsiveness.storeValue.toFixed(1)} store-level (${responsiveness.brandValue.toFixed(1)} brand target). ` : ''}${patience ? `Patience: ${patience.storeValue.toFixed(1)}—${patience.storeValue >= 4.6 ? 'strong' : 'moderate'} performance. ` : ''}${responsiveness && patience ? `Combined score of ${((responsiveness.storeValue + patience.storeValue) / 2).toFixed(1)} indicates ${((responsiveness.storeValue + patience.storeValue) / 2) >= 4.5 ? 'excellent' : 'acceptable'} service quality. ` : ''}${responsiveness && responsiveness.storeValue < 4.4 ? `Stores with responsiveness below ${(responsiveness.storeValue * 0.95).toFixed(1)} need active listening training. ` : ''}`
      },
      {
        id: "engagement-resolution",
        heading: "Interaction Completeness",
        body: `${engagement ? `Engagement score: ${engagement.storeValue.toFixed(1)} store-level. ` : ''}${resolution ? `Resolution: ${resolution.storeValue.toFixed(1)}. ` : ''}${engagement && resolution ? `Combined ${((engagement.storeValue + resolution.storeValue) / 2).toFixed(1)} shows ${((engagement.storeValue + resolution.storeValue) / 2) >= 4.5 ? 'strong' : 'adequate'} issue resolution. ` : ''}${engagement && engagement.storeValue < 4.3 ? `Focus on stores with engagement below ${(engagement.storeValue * 0.95).toFixed(1)} to improve guest connection. ` : 'Engagement levels are healthy.'}`
      },
      {
        id: "crew-behaviors",
        heading: "Behavior Distribution Analysis",
        body: `${warmCheerful ? `Warm & Cheerful: ${warmCheerful.value.toFixed(1)}% of interactions—${warmCheerful.value >= 20 ? 'strong brand alignment' : 'needs improvement'}. ` : ''}${courteous ? `Courteous: ${courteous.value.toFixed(1)}%, ` : ''}${unfriendly ? `Unfriendly: ${unfriendly.value.toFixed(1)}% (${unfriendly.value > 5 ? 'above target—investigate' : 'within acceptable range'}), ` : ''}${tense ? `Tense: ${tense.value.toFixed(1)}%. ` : ''}${warmCheerful && warmCheerful.value < 20 ? `Target increasing Warm & Cheerful to >${(warmCheerful.value * 1.2).toFixed(0)}% through positive reinforcement training. ` : 'Distribution is healthy.'}`
      },
      {
        id: "location-voice",
        heading: "Store-Level Performance Gaps",
        body: `Average friendliness across stores: ${avgFriendliness.toFixed(1)}. ${topStore ? `Top: ${topStore.store_id} at ${topStore.friendliness_score?.toFixed(1) || 'N/A'}. ` : ''}${lowStore && topStore ? `Lowest: ${lowStore.store_id} at ${lowStore.friendliness_score?.toFixed(1) || 'N/A'}—a ${(parseFloat(topStore.friendliness_score) - parseFloat(lowStore.friendliness_score)).toFixed(1)} point gap. ` : ''}${friendlinessScore ? `${storeRows.filter((s: any) => parseFloat(s.friendliness_score) < friendlinessScore.brandValue * 0.95).length} stores below ${(friendlinessScore.brandValue * 0.95).toFixed(1)} need prioritized coaching. ` : ''}${friendlinessScore && avgFriendliness < friendlinessScore.brandValue ? `If all stores reached ${friendlinessScore.brandValue.toFixed(1)} (brand target), estimated sentiment improvement of ${(friendlinessScore.brandValue - avgFriendliness).toFixed(1)} points.` : 'All stores meeting targets.'}`
      }
    ]
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Friendliness & Sentiment"
        description="Measure guest-perceived tone, patience, engagement, and overall sentiment across locations and time."
      />
      
      <DeltaChipList metrics={data.brandFranchiseStoreCompare || []} activeLevels={activeLevels} />

      <NarrativePanel content={narrative} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart
          title="Friendliness Distribution"
          data={data.distribution}
        />
        <TimeSeriesChart
          title="Friendliness Metrics Over Time"
          xLabel="Hour"
          yLabel="Score"
          series={friendlinessSeries}
        />
      </div>

      <StoreTable columns={storeColumns} data={data.storeRows} title="Store-Level Friendliness Metrics" />
    </div>
  );
}

