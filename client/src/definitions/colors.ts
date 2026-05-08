export const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  danger: '#c62828',
  warning: '#ed6c02',
  info: '#0288d1',
  muted: '#9e9e9e',
  background: '#fafafa',
  surface: '#ffffff',
  textOnAccent: '#ffffff'
} as const;

export type ColorKey = keyof typeof COLORS;
