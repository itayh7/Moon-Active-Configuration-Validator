import type { ReactNode } from 'react';
import { Container, Stack } from '@mui/material';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Stack spacing={3}>{children}</Stack>
  </Container>
);
