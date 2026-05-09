import type { FastifyInstance } from 'fastify';
import { ALLOWED_MODELS, type AllowedModel } from '../lib/allowed-models.js';

export interface ModelsResponse {
  models: readonly AllowedModel[];
}

export async function registerModelsRoute(app: FastifyInstance): Promise<void> {
  app.get('/models', async (): Promise<ModelsResponse> => {
    return { models: ALLOWED_MODELS };
  });
}
