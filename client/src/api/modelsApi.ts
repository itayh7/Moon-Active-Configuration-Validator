import { httpClient } from './httpClient';
import { MODELS_ENDPOINT } from '../definitions/constants';

export interface ModelsResponse {
  models: string[];
}

export async function fetchModels(): Promise<ModelsResponse> {
  const { data } = await httpClient.get<ModelsResponse>(MODELS_ENDPOINT);
  return data;
}
