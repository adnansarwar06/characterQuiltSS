import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { type Theme } from '../types/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: string;
  children: React.ReactNode;
}

const StyledButton = styled.button<{ $theme: Theme; $variant: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  box-shadow: ${props => props.$theme.shadows.sm};

  background-color: ${props =>
    props.$variant === 'primary'
      ? props.$theme.colors.primary
      : props.$theme.colors.secondary};

  color: ${props =>
    props.$variant === 'primary'
      ? '#ffffff'
      : props.$theme.colors.text};

  &:hover:not(:disabled) {
    background-color: ${props =>
      props.$variant === 'primary'
        ? props.$theme.colors.primaryHover
        : props.$theme.colors.secondaryHover};
    box-shadow: ${props => props.$theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Icon = styled.span`
  font-size: 1.1em;
  display: inline-flex;
  align-items: center;
`;

/**
 * Reusable button component with theme support
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <StyledButton $theme={theme} $variant={variant} {...props}>
      {icon && <Icon>{icon}</Icon>}
      {children}
    </StyledButton>
  );
}; 