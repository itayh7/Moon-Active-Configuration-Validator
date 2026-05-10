import type { FastifyInstance } from 'fastify';

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

export async function registerHealthRoute(app: FastifyInstance): Promise<void> {
  app.get('/health', async (): Promise<HealthResponse> => ({
    status: 'ok',
    timestamp: new Date().toISOString()
  }));
}
