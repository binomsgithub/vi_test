import client from './client';
import { SegmentFilters } from '../types/filters';

export interface CompareResponse {
  series: {
    segmentLabel: string;
    data: { x: string; y: number }[];
  }[];
}

export async function getCompare(
  metric: string,
  segmentA: SegmentFilters,
  segmentB: SegmentFilters,
  segmentC: SegmentFilters
): Promise<CompareResponse> {
  const params = new URLSearchParams({
    metric,
    segmentA: JSON.stringify(segmentA),
    segmentB: JSON.stringify(segmentB),
    segmentC: JSON.stringify(segmentC),
  });
  const response = await client.get<CompareResponse>(`/compare?${params.toString()}`);
  return response.data;
}

