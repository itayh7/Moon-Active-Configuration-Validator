export const ALLOWED_MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-5'] as const;

export type AllowedModel = (typeof ALLOWED_MODELS)[number];

export function isAllowedModel(value: unknown): value is AllowedModel {
  return typeof value === 'string' && (ALLOWED_MODELS as readonly string[]).includes(value);
}
