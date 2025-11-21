import client from './client';
import { KpiDefinition, LevelCompareMetric } from '../types/metrics';

export interface JourneyPolicyResponse {
  kpisTop: KpiDefinition[];
  kpisCheckIn: KpiDefinition[];
  timeSeries: Record<string, { x: string; y: number }[]>;
  storeRows: any[];
  brandFranchiseStoreCompare: LevelCompareMetric[];
}

export async function getJourneyPolicy(): Promise<JourneyPolicyResponse> {
  const response = await client.get<JourneyPolicyResponse>('/journey-policy');
  return response.data;
}

