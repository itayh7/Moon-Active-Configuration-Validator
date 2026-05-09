import type { ReactNode } from 'react';
import { Stack } from '@mui/material';

interface FieldRowProps {
  children: ReactNode;
}

export const FieldRow = ({ children }: FieldRowProps) => (
  <Stack direction="row" spacing={1.5} sx={{ '& > *': { flex: 1 } }}>
    {children}
  </Stack>
);
