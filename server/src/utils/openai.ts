import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { ZodType } from 'zod';

const FALLBACK_MESSAGE =
  'Welcome to the Moon Active Configuration Validator! (Set OPENAI_API_KEY to enable AI-generated greetings.)';

const WELCOME_PROMPT =
  'Generate a short, creative welcome message for a game configuration validator. One sentence, under 20 words, friendly tone.';

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

function requireClient(): OpenAI {
  const client = getClient();
  if (!client) {
    throw new LlmError('OPENAI_API_KEY is not set');
  }
  return client;
}

export class LlmError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'LlmError';
  }
}

export async function generateWelcomeMessage(): Promise<string> {
  const client = getClient();
  if (!client) return FALLBACK_MESSAGE;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [{ role: 'user', content: WELCOME_PROMPT }],
    max_tokens: 80,
    temperature: 0.0
  });

  return completion.choices[0]?.message?.content?.trim() ?? FALLBACK_MESSAGE;
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
