import { TextField } from '@mui/material';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
}

export const NumberField = ({ label, value, onChange, disabled = false, min }: NumberFieldProps) => (
  <TextField
    type="number"
    label={label}
    value={Number.isFinite(value) ? value : ''}
    disabled={disabled}
    inputProps={{ min }}
    onChange={(e) => {
      const next = e.target.value === '' ? 0 : Number(e.target.value);
      if (!Number.isNaN(next)) onChange(next);
    }}
    size="small"
    fullWidth
  />
);
