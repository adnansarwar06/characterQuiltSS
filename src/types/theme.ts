/**
 * Theme interface defining all themeable properties
 */
export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  grid: {
    background: string;
    borderColor: string;
    headerBackground: string;
    rowHoverBackground: string;
  };
} 