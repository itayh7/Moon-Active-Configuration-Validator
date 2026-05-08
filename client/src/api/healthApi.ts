import { httpClient } from './httpClient';
import { HEALTH_ENDPOINT } from '../definitions/constants';

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await httpClient.get<HealthResponse>(HEALTH_ENDPOINT);
  return data;
}
