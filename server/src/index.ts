import 'dotenv/config';
import Fastify, { type FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { registerHealthRoute } from './routes/health.js';
import { registerValidateConfigRoute } from './routes/validate-config.js';
import { registerModelsRoute } from './routes/models.js';
import { registerReferenceRangesRoute } from './routes/reference-ranges.js';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: true,
  credentials: true
});

fastify.setErrorHandler((error: FastifyError, _request, reply) => {
  fastify.log.error(error);
  const statusCode = error.statusCode ?? 500;
  reply.status(statusCode).send({
    status: 'error',
    message: error.message ?? 'Internal Server Error'
  });
});

await registerHealthRoute(fastify);
await registerValidateConfigRoute(fastify);
await registerModelsRoute(fastify);
await registerReferenceRangesRoute(fastify);

try {
  await fastify.listen({ port: PORT, host: HOST });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
