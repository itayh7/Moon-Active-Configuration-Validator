import OpenAI from 'openai';

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

export async function generateWelcomeMessage(): Promise<string> {
  const client = getClient();
  if (!client) return FALLBACK_MESSAGE;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [{ role: 'user', content: WELCOME_PROMPT }],
    max_tokens: 80,
    temperature: 0.9
  });

  return completion.choices[0]?.message?.content?.trim() ?? FALLBACK_MESSAGE;
}
