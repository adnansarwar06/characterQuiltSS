import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import './index.css';
import App from './App';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const ThemedApp = () => {
  const { theme } = useTheme();
  return (
    <StyledThemeProvider theme={theme}>
      <App />
    </StyledThemeProvider>
  );
};

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </React.StrictMode>
);
