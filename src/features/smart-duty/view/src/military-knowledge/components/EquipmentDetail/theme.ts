import { createTheme } from '@mui/material/styles';

export const equipmentColors = {
  bg: '#020c1b',
  bgElevated: '#0a1628',
  card: '#0d1f35',
  cardBorder: 'rgba(0, 212, 255, 0.12)',
  cardBorderSubtle: 'rgba(255, 255, 255, 0.06)',
  textPrimary: '#e8f4ff',
  textSecondary: '#7a9bb8',
  textMuted: '#4a6a85',
  accent: '#00d4ff',
  accentOrange: '#f5a623',
  accentRed: '#ff4d6a',
  timelineBadge: '#1565c0',
  chipBg: 'rgba(0, 212, 255, 0.08)',
};

export const equipmentTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: equipmentColors.accent },
    background: {
      default: equipmentColors.bg,
      paper: equipmentColors.card,
    },
    text: {
      primary: equipmentColors.textPrimary,
      secondary: equipmentColors.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600, letterSpacing: '0.04em' },
    subtitle2: { fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em' },
    caption: { fontSize: '0.65rem', color: equipmentColors.textMuted },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: equipmentColors.bg,
          margin: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
