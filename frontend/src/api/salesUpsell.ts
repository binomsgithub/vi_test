import client from './client';
import { KpiDefinition, LevelCompareMetric } from '../types/metrics';

export interface SalesUpsellResponse {
  kpis: KpiDefinition[];
  timeSeries: Record<string, { x: string; y: number }[]>;
  greetingItems: any[];
  cartItems: any[];
  upsizeItems: any[];
  storeRows: any[];
  brandFranchiseStoreCompare: LevelCompareMetric[];
}

export async function getSalesUpsell(): Promise<SalesUpsellResponse> {
  const response = await client.get<SalesUpsellResponse>('/sales-upsell');
  return response.data;
}

