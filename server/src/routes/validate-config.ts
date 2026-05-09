import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { ConfigSchema } from '../schemas/config.js';
import { readReferenceRanges, ReferenceRangesError } from '../lib/reference-ranges-store.js';
import { validateConfigWithLlm } from '../lib/llm-config-validator/index.js';
import { LlmError } from '../utils/openai.js';
import type { LlmFeedback } from '../lib/llm-config-validator/post-process.js';
import { ALLOWED_MODELS, isAllowedModel, type AllowedModel } from '../lib/allowed-models.js';

class InvalidModelError extends Error {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'InvalidModelError';
  }
}

function requireModel(value: unknown): AllowedModel {
  if (value === undefined || value === '') {
    throw new InvalidModelError(
      `Query parameter "model" is required. Allowed values: ${ALLOWED_MODELS.join(', ')}`
    );
  }
  if (!isAllowedModel(value)) {
    throw new InvalidModelError(
      `Model "${String(value)}" is not allowed. Allowed values: ${ALLOWED_MODELS.join(', ')}`
    );
  }
  return value;
}

interface SchemaValidationError {
  path: string;
  message: string;
}

interface SchemaValidationResult {
  valid: boolean;
  errors: SchemaValidationError[];
}

interface SuccessBody {
  schema_validation: SchemaValidationResult;
  llm_feedback: LlmFeedback;
}

interface FailureBody {
  schema_validation: SchemaValidationResult;
}

interface ErrorBody {
  status: 'error';
  message: string;
}

function zodErrorsToList(err: ZodError): SchemaValidationError[] {
  return err.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message
  }));
}

export async function registerValidateConfigRoute(app: FastifyInstance): Promise<void> {
  app.post(
    '/validate-config',
    async (
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<SuccessBody | FailureBody | ErrorBody> => {
      const parsed = ConfigSchema.safeParse(request.body);
      if (!parsed.success) {
        reply.status(400);
        return {
          schema_validation: { valid: false, errors: zodErrorsToList(parsed.error) }
        };
      }

      const modelParam = (request.query as Record<string, unknown> | undefined)?.model;
      const model = requireModel(modelParam);

      let ranges;
      try {
        ranges = await readReferenceRanges();
      } catch (err) {
        if (err instanceof ReferenceRangesError) {
          request.log.error({ err }, 'reference-ranges read failed');
          reply.status(500);
          return { status: 'error', message: err.message };
        }
        throw err;
      }

      let llmFeedback: LlmFeedback;
      try {
        llmFeedback = await validateConfigWithLlm({
          config: parsed.data,
          ranges,
          model
        });
      } catch (err) {
        if (err instanceof LlmError) {
          request.log.error({ err }, 'LLM call failed');
          reply.status(502);
          return { status: 'error', message: err.message };
        }
        throw err;
      }

      return {
        schema_validation: { valid: true, errors: [] },
        llm_feedback: llmFeedback
      };
    }
  );
}
