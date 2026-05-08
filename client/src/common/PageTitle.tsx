import { Typography } from '@mui/material';

interface PageTitleProps {
  text: string;
}

export const PageTitle = ({ text }: PageTitleProps) => (
  <Typography variant="h4" component="h1" gutterBottom>
    {text}
  </Typography>
);
