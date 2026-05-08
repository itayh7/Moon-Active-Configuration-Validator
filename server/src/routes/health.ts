import type { FastifyInstance } from 'fastify';
import { generateWelcomeMessage } from '../utils/openai.js';

export interface HealthResponse {
  status: 'ok';
  message: string;
  timestamp: string;
}

export async function registerHealthRoute(app: FastifyInstance): Promise<void> {
  app.get('/health', async (): Promise<HealthResponse> => {
    const message = await generateWelcomeMessage();
    return {
      status: 'ok',
      message,
      timestamp: new Date().toISOString()
    };
  });
}
