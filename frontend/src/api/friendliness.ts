import client from './client';
import { KpiDefinition, DistributionData, LevelCompareMetric } from '../types/metrics';

export interface FriendlinessResponse {
  kpis: KpiDefinition[];
  timeSeries: Record<string, { x: string; y: number }[]>;
  distribution: DistributionData[];
  storeRows: any[];
  brandFranchiseStoreCompare: LevelCompareMetric[];
}

export async function getFriendliness(): Promise<FriendlinessResponse> {
  const response = await client.get<FriendlinessResponse>('/friendliness');
  return response.data;
}

