import { useEffect, useState } from 'react';
import { CompareChart } from '../components/charts/CompareChart';
import { ExploreTable } from '../components/tables/ExploreTable';
import { SegmentFilterPanel } from '../components/compare/SegmentFilterPanel';
import { MetricSelector } from '../components/compare/MetricSelector';
import { NarrativePanel } from '../components/narrative/NarrativePanel';
import { PageHeader } from '../components/layout/PageHeader';
import { getCompare } from '../api/compare';
import { getExplore } from '../api/explore';
import { getFilterOptions } from '../api/filters';
import { SegmentFilters } from '../types/filters';
import { METRIC_OPTIONS } from '../types/metrics';
import { NarrativeContent } from '../types/narrative';

export function ExploreComparePage() {
  const [compareData, setCompareData] = useState<any>(null);
  const [exploreData, setExploreData] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState('total_sessions');
  const [segmentA, setSegmentA] = useState<SegmentFilters>({});
  const [segmentB, setSegmentB] = useState<SegmentFilters>({});
  const [segmentC, setSegmentC] = useState<SegmentFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilterOptions().then(setFilterOptions).catch(console.error);
    getExplore().then(setExploreData).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedMetric) {
      setLoading(true);
      getCompare(selectedMetric, segmentA, segmentB, segmentC)
        .then(setCompareData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedMetric, segmentA, segmentB, segmentC]);

  if (!filterOptions || !exploreData) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const selectedMetricOption = METRIC_OPTIONS.find(m => m.id === selectedMetric);
  
  // Compute insights from compare data
  const exploreRows = exploreData.rows || [];
  const totalExploreRows = exploreData.total || 0;
  const segmentAHasFilters = Object.keys(segmentA).some(k => segmentA[k as keyof SegmentFilters] && segmentA[k as keyof SegmentFilters] !== 'any');
  const segmentBHasFilters = Object.keys(segmentB).some(k => segmentB[k as keyof SegmentFilters] && segmentB[k as keyof SegmentFilters] !== 'any');
  const segmentCHasFilters = Object.keys(segmentC).some(k => segmentC[k as keyof SegmentFilters] && segmentC[k as keyof SegmentFilters] !== 'any');
  
  let segmentComparison = '';
  if (compareData && compareData.series) {
    const seriesA = compareData.series.find(s => s.segmentLabel === 'Segment A');
    const seriesB = compareData.series.find(s => s.segmentLabel === 'Segment B');
    const seriesC = compareData.series.find(s => s.segmentLabel === 'Segment C');
    
    if (seriesA && seriesB && seriesA.data.length > 0 && seriesB.data.length > 0) {
      const avgA = seriesA.data.reduce((sum, d) => sum + d.y, 0) / seriesA.data.length;
      const avgB = seriesB.data.reduce((sum, d) => sum + d.y, 0) / seriesB.data.length;
      const gap = Math.abs(avgA - avgB);
      const pctGap = gap / Math.max(avgA, avgB) * 100;
      segmentComparison = `Segment A averages ${avgA.toFixed(1)} vs Segment B at ${avgB.toFixed(1)}—a ${gap.toFixed(1)} point gap (${pctGap.toFixed(1)}% difference). `;
      if (seriesC && seriesC.data.length > 0) {
        const avgC = seriesC.data.reduce((sum, d) => sum + d.y, 0) / seriesC.data.length;
        segmentComparison += `Segment C: ${avgC.toFixed(1)}. `;
      }
    }
  }
  
  const avgMetricValue = exploreRows.length > 0 && selectedMetric
    ? exploreRows.reduce((sum: number, row: any) => sum + (parseFloat(row[selectedMetric]) || 0), 0) / exploreRows.length
    : 0;

  const narrative: NarrativeContent = {
    title: "Segment Comparison Insights",
    blocks: [
      {
        id: "segment-definitions",
        heading: "Current Segment Configuration",
        body: `${segmentAHasFilters ? 'Segment A has filters applied. ' : 'Segment A: no filters (all data). '}${segmentBHasFilters ? 'Segment B has filters applied. ' : 'Segment B: no filters (all data). '}${segmentCHasFilters ? 'Segment C has filters applied. ' : 'Segment C: no filters (all data). '}${!segmentAHasFilters && !segmentBHasFilters && !segmentCHasFilters ? 'Apply filters to each segment to compare specific cohorts (brands, franchisees, channels, time periods). ' : 'Compare these segments on the selected metric to identify performance drivers.'}`
      },
      {
        id: "metric-differences",
        heading: "Performance Gap Analysis",
        body: `${selectedMetricOption ? `Comparing segments on ${selectedMetricOption.label}. ` : ''}${segmentComparison || 'Load comparison data to see segment differences. '}${compareData && compareData.series ? `${compareData.series.length} segments loaded. ` : ''}${avgMetricValue > 0 ? `Average ${selectedMetricOption?.label || 'metric'} across explore table: ${avgMetricValue.toFixed(1)}. ` : ''}${segmentComparison && segmentComparison.includes('gap') ? 'Identify best practices from the top-performing segment and apply to others. ' : 'Use the chart to visualize hourly patterns and identify when gaps are largest.'}`
      },
      {
        id: "call-level-dive",
        heading: "Call-Level Detail Available",
        body: `${totalExploreRows} total calls in database, ${exploreRows.length} displayed in table. ${exploreRows.length > 0 ? `Average ${selectedMetricOption?.label || 'metric'} in current view: ${avgMetricValue.toFixed(1)}. ` : ''}${exploreRows.length < totalExploreRows ? `Showing page 1 of ${Math.ceil(totalExploreRows / exploreRows.length)} pages. ` : ''}Drill into specific calls to understand behaviors behind segment-level differences. Filter by store, time, or alert flags to isolate patterns.`
      },
      {
        id: "use-cases",
        heading: "Recommended Comparisons",
        body: `${selectedMetric === 'upsell_attempt_rate' ? 'Compare franchisees on upsell performance to identify training opportunities. ' : ''}${selectedMetric === 'order_handle_time' ? 'Compare channels (drive-thru vs dine-in) to understand speed differences. ' : ''}${selectedMetric === 'policy_adherence_rate' ? 'Compare time periods (weekday vs weekend) to optimize staffing. ' : ''}${selectedMetric === 'friendliness_score' ? 'Compare brands or regions to identify cultural or training differences. ' : ''}${!segmentAHasFilters && !segmentBHasFilters ? 'Set up Segment A and B with different filters to start comparing. ' : 'Adjust segment filters to explore different hypotheses about performance drivers.'}`
      }
    ]
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explore & Cohort Compare"
        description="Define segments, compare cohorts on key metrics, and inspect underlying call-level records."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <SegmentFilterPanel
            segmentLabel="Segment A"
            filters={segmentA}
            onChange={setSegmentA}
            filterOptions={filterOptions}
          />
          <SegmentFilterPanel
            segmentLabel="Segment B"
            filters={segmentB}
            onChange={setSegmentB}
            filterOptions={filterOptions}
          />
          <SegmentFilterPanel
            segmentLabel="Segment C"
            filters={segmentC}
            onChange={setSegmentC}
            filterOptions={filterOptions}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <div>
            <MetricSelector value={selectedMetric} onChange={setSelectedMetric} />
            {loading ? (
              <div className="text-center py-8">Loading comparison...</div>
            ) : compareData ? (
              <CompareChart
                metricLabel={selectedMetricOption?.label || selectedMetric}
                series={compareData.series}
              />
            ) : null}
          </div>
          
          <NarrativePanel content={narrative} />
        </div>
      </div>

      <ExploreTable rows={exploreData.rows} />
    </div>
  );
}

