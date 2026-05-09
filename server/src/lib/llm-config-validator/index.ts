import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { callLLM } from '../../utils/openai.js';
import { LlmOutputSchema } from '../../schemas/llm-output.js';
import type { Config } from '../../schemas/config.js';
import type { ReferenceRanges } from '../../schemas/reference-ranges.js';
import { renderUserPrompt } from './user-prompt.js';
import { postProcess, type LlmFeedback } from './post-process.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT_FILE = resolve(__dirname, '../../prompts/system.md');

const systemPromptPromise: Promise<string> = readFile(SYSTEM_PROMPT_FILE, 'utf8');

export interface ValidateConfigInput {
  config: Config;
  ranges: ReferenceRanges;
  model: string;
}

export async function validateConfigWithLlm(
  input: ValidateConfigInput
): Promise<LlmFeedback> {
  const systemPrompt = await systemPromptPromise;
  const userPrompt = renderUserPrompt(input.ranges, input.config);

  const llmOutput = await callLLM(systemPrompt, userPrompt, LlmOutputSchema, {
    model: input.model,
    schemaName: 'validation_result'
  });

  return postProcess(llmOutput);
}
