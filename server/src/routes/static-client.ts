import { existsSync } from 'node:fs';
import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';

export async function registerStaticClientRoute(app: FastifyInstance): Promise<void> {
  const dir = process.env.CLIENT_DIST_DIR;
  if (!dir || !existsSync(dir)) return;

  await app.register(fastifyStatic, {
    root: dir,
    prefix: '/'
  });
}
