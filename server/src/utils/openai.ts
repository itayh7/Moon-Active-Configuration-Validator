import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { ZodType } from 'zod';

let cachedClient: OpenAI | null = null;

function requireClient(): OpenAI {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new LlmError('OPENAI_API_KEY is not set');
  }
  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

export class LlmError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'LlmError';
  }
}

export interface CallLlmOptions {
  model: string;
  schemaName?: string;
}

export async function callLLM<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: ZodType<T>,
  opts: CallLlmOptions
): Promise<T> {
  const client = requireClient();
  const schemaName = opts.schemaName ?? 'response';

  let completion;
  try {
    completion = await client.beta.chat.completions.parse({
      model: opts.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: zodResponseFormat(schema, schemaName)
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new LlmError(`LLM request failed: ${detail}`, err);
  }

  const choice = completion.choices[0];
  if (!choice) {
    throw new LlmError('LLM returned no choices');
  }
  if (choice.message.refusal) {
    throw new LlmError(`LLM refused the request: ${choice.message.refusal}`);
  }
  const parsed = choice.message.parsed;
  if (parsed == null) {
    throw new LlmError('LLM returned no parsed structured output');
  }
  return parsed as T;
}
