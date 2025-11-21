import client from './client';

export interface FilterOptions {
  brands: string[];
  owners: string[];
  franchiseIds: string[];
  storeIds: string[];
  channels: string[];
  engagementModes: string[];
  callDates: string[];
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const response = await client.get<FilterOptions>('/filters');
  return response.data;
}

