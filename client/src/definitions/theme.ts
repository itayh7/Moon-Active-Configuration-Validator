import { createTheme } from '@mui/material';
import { COLORS } from './colors';

export const theme = createTheme({
  palette: {
    primary: { main: COLORS.primary },
    success: { main: COLORS.success },
    error: { main: COLORS.danger },
    info: { main: COLORS.info },
    background: {
      default: COLORS.background,
      paper: COLORS.surface
    }
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
  }
});
