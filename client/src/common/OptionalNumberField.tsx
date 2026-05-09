import { TextField } from '@mui/material';

interface OptionalNumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
  min?: number;
}

export const OptionalNumberField = ({
  label,
  value,
  onChange,
  disabled = false,
  min
}: OptionalNumberFieldProps) => (
  <TextField
    type="number"
    label={label}
    value={value ?? ''}
    disabled={disabled}
    inputProps={{ min }}
    placeholder="—"
    InputLabelProps={{ shrink: true }}
    onChange={(e) => {
      const raw = e.target.value;
      if (raw === '') {
        onChange(undefined);
        return;
      }
      const next = Number(raw);
      if (!Number.isNaN(next)) onChange(next);
    }}
    size="small"
    fullWidth
  />
);
