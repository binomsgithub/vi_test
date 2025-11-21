import client from './client';
import { GlobalFilters } from '../types/filters';
import { KpiDefinition, LevelCompareMetric } from '../types/metrics';
import { buildQueryFromFilters } from '../utils/filterParams';

export interface OverviewResponse {
  kpisVolume: KpiDefinition[];
  kpisQuality: KpiDefinition[];
  timeSeries: Record<string, { x: string; y: number }[]>;
  storeRows: any[];
  brandFranchiseStoreCompare: LevelCompareMetric[];
}

export async function getOverview(filters: GlobalFilters): Promise<OverviewResponse> {
  const params = buildQueryFromFilters(filters);
  const response = await client.get<OverviewResponse>(`/overview?${params.toString()}`);
  return response.data;
}

