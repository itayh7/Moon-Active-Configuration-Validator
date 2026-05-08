import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

export const SectionCard = ({ title, children }: SectionCardProps) => (
  <Card variant="outlined">
    <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
    <CardContent>{children}</CardContent>
  </Card>
);
