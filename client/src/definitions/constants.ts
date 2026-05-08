export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export const HEALTH_ENDPOINT = '/health';

export const APP_TITLE = 'Moon Active Configuration Validator';

export const REQUEST_TIMEOUT_MS = 30_000;
