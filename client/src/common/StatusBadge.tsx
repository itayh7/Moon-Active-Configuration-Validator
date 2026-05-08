import { Chip, CircularProgress } from '@mui/material';
import { COLORS } from '../definitions/colors';

export type StatusVariant = 'ok' | 'error' | 'loading' | 'idle';

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
}

const VARIANT_BG: Record<StatusVariant, string> = {
  ok: COLORS.success,
  error: COLORS.danger,
  loading: COLORS.info,
  idle: COLORS.muted
};

export const StatusBadge = ({ variant, label }: StatusBadgeProps) => (
  <Chip
    label={label}
    icon={variant === 'loading' ? <CircularProgress size={14} sx={{ color: COLORS.textOnAccent }} /> : undefined}
    sx={{
      backgroundColor: VARIANT_BG[variant],
      color: COLORS.textOnAccent,
      fontWeight: 500
    }}
  />
);
