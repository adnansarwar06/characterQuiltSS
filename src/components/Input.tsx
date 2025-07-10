import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { type Theme } from '../types/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Container = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label<{ $theme: Theme }>`
  display: block;
  margin-bottom: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$theme.colors.text};
`;

const StyledInput = styled.input<{ $theme: Theme; $hasError: boolean }>`
  width: 100%;
  padding: 8px 12px;
  font-size: 0.875rem;
  border-radius: 6px;
  border: 1px solid ${props => props.$hasError ? props.$theme.colors.error : props.$theme.colors.border};
  background-color: ${props => props.$theme.colors.surface};
  color: ${props => props.$theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? props.$theme.colors.error : props.$theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.$hasError 
      ? `${props.$theme.colors.error}33`
      : `${props.$theme.colors.primary}33`};
  }

  &::placeholder {
    color: ${props => props.$theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div<{ $theme: Theme }>`
  margin-top: 4px;
  font-size: 0.75rem;
  color: ${props => props.$theme.colors.error};
`;

/**
 * Reusable input component with theme support
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    const { theme } = useTheme();

    return (
      <Container>
        <Label $theme={theme}>{label}</Label>
        <StyledInput
          ref={ref}
          $theme={theme}
          $hasError={!!error}
          {...props}
        />
        {error && <ErrorText $theme={theme}>{error}</ErrorText>}
      </Container>
    );
  }
); 