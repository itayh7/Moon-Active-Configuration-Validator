import { Button } from '@mui/material';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
}

export const ActionButton = ({
  label,
  onClick,
  disabled = false,
  variant = 'contained'
}: ActionButtonProps) => (
  <Button variant={variant} onClick={onClick} disabled={disabled}>
    {label}
  </Button>
);
