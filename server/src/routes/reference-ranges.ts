import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  readReferenceRanges,
  writeReferenceRanges,
  ReferenceRangesError
} from '../lib/reference-ranges-store.js';
import { ReferenceRangesSchema, type ReferenceRanges } from '../schemas/reference-ranges.js';

interface ErrorBody {
  status: 'error';
  message: string;
}

export async function registerReferenceRangesRoute(app: FastifyInstance): Promise<void> {
  app.get(
    '/reference-ranges',
    async (request: FastifyRequest, reply: FastifyReply): Promise<ReferenceRanges | ErrorBody> => {
      try {
        return await readReferenceRanges();
      } catch (err) {
        if (err instanceof ReferenceRangesError) {
          request.log.error({ err }, 'reference-ranges read failed');
          reply.status(500);
          return { status: 'error', message: err.message };
        }
        throw err;
      }
    }
  );

  app.put(
    '/reference-ranges',
    async (request: FastifyRequest, reply: FastifyReply): Promise<ReferenceRanges | ErrorBody> => {
      const parsed = ReferenceRangesSchema.safeParse(request.body);
      if (!parsed.success) {
        reply.status(400);
        return { status: 'error', message: parsed.error.message };
      }

      try {
        await writeReferenceRanges(parsed.data);
        return parsed.data;
      } catch (err) {
        if (err instanceof ReferenceRangesError) {
          request.log.error({ err }, 'reference-ranges write failed');
          reply.status(500);
          return { status: 'error', message: err.message };
        }
        throw err;
      }
    }
  );
}
