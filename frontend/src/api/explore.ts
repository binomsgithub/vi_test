import client from './client';
import { ExploreRow } from '../types/tables';

export interface ExploreResponse {
  rows: ExploreRow[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getExplore(page: number = 1, pageSize: number = 50): Promise<ExploreResponse> {
  const response = await client.get<ExploreResponse>(`/explore?page=${page}&pageSize=${pageSize}`);
  return response.data;
}

