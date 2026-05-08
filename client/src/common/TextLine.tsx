import { Typography } from '@mui/material';

type TextVariant = 'body' | 'caption' | 'subtitle';

interface TextLineProps {
  text: string;
  variant?: TextVariant;
}

const VARIANT_MAP: Record<TextVariant, 'body1' | 'caption' | 'subtitle1'> = {
  body: 'body1',
  caption: 'caption',
  subtitle: 'subtitle1'
};

export const TextLine = ({ text, variant = 'body' }: TextLineProps) => (
  <Typography variant={VARIANT_MAP[variant]}>{text}</Typography>
);
