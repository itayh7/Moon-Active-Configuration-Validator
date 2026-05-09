export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export const HEALTH_ENDPOINT = '/health';
export const MODELS_ENDPOINT = '/models';
export const VALIDATE_CONFIG_ENDPOINT = '/validate-config';
export const REFERENCE_RANGES_ENDPOINT = '/reference-ranges';

export const APP_TITLE = 'Moon Active Configuration Validator';

export const REQUEST_TIMEOUT_MS = 30_000;

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const RANGE_FIELDS = ['reward_min', 'reward_max', 'time_limit_min', 'time_limit_max'] as const;
export type RangeField = (typeof RANGE_FIELDS)[number];
