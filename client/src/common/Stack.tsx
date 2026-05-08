import type { ReactNode } from 'react';
import { Stack as MuiStack } from '@mui/material';

interface StackProps {
  children: ReactNode;
  spacing?: number;
  direction?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
}

export const Stack = ({
  children,
  spacing = 2,
  direction = 'column',
  alignItems = 'stretch'
}: StackProps) => (
  <MuiStack direction={direction} spacing={spacing} alignItems={alignItems}>
    {children}
  </MuiStack>
);
