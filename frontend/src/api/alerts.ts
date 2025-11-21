import client from './client';
import { KpiDefinition, LevelCompareMetric } from '../types/metrics';
import { AlertRow } from '../types/tables';

export interface AlertsResponse {
  kpisTop: KpiDefinition[];
  kpisSecond: KpiDefinition[];
  timeSeries: Record<string, { x: string; y: number }[]>;
  callRows: AlertRow[];
  brandFranchiseStoreCompare: LevelCompareMetric[];
}

export async function getAlerts(): Promise<AlertsResponse> {
  const response = await client.get<AlertsResponse>('/alerts');
  return response.data;
}

