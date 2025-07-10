import { type Theme } from '../types/theme';

/**
 * Theme configuration for light and dark modes
 */
export const themeConfig: Record<'light' | 'dark', Theme> = {
  light: {
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      primary: '#64748b',
      primaryHover: '#475569',
      secondary: '#e2e8f0',
      secondaryHover: '#cbd5e1',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      error: '#ef4444',
      success: '#22c55e',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    grid: {
      background: '#ffffff',
      borderColor: '#e2e8f0',
      headerBackground: '#f8fafc',
      rowHoverBackground: '#f1f5f9',
    },
  },
  dark: {
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#64748b',
      primaryHover: '#475569',
      secondary: '#334155',
      secondaryHover: '#475569',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#334155',
      error: '#ef4444',
      success: '#22c55e',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4)',
    },
    grid: {
      background: '#1e293b',
      borderColor: '#334155',
      headerBackground: '#0f172a',
      rowHoverBackground: '#334155',
    },
  },
} as const; 