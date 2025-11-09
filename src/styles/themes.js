import colors from './colors';

// Thème clair pour l’application
export const lightTheme = {
  name: 'light',
  background: colors.backgroundLight,
  surface: colors.surfaceLight,
  text: colors.textPrimary,
  textSecondary: colors.textSecondary,
  card: {
    background: colors.surfaceLight,
    border: colors.border,
  },
  button: {
    background: colors.primary,
    text: colors.white,
  },
  header: {
    background: colors.primary,
    text: colors.white,
  },
  border: colors.border,
  accent: colors.accent,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  info: colors.info,
};

// Thème sombre pour l’application
export const darkTheme = {
  name: 'dark',
  background: colors.backgroundDark,
  surface: colors.surfaceDark,
  text: colors.white,
  textSecondary: colors.muted,
  card: {
    background: colors.surfaceDark,
    border: '#3a3a3a',
  },
  button: {
    background: colors.primaryDark,
    text: colors.white,
  },
  header: {
    background: colors.primaryDark,
    text: colors.white,
  },
  border: '#3a3a3a',
  accent: colors.accent,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  info: colors.info,
};

export default { lightTheme, darkTheme };