import React from 'react';
import styled from 'styled-components';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  /** The icon component from Lucide to display */
  icon: LucideIcon;
  /** The text label to display next to the icon */
  label: string;
  /** Optional tooltip text */
  tooltip?: string;
  /** Whether the button is in a disabled state */
  disabled?: boolean;
  /** Click handler for the button */
  onClick: () => void;
  /** Optional variant for different button styles */
  variant?: 'primary' | 'secondary';
}

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: ${props => 
    props.variant === 'primary' 
      ? '#3b82f6'
      : '#1e293b'};
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => 
      props.variant === 'primary' 
        ? '#2563eb'
        : '#334155'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

/**
 * A modern toolbar button component that combines an icon with a text label.
 * Supports hover states, tooltips, and different variants.
 */
export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  tooltip,
  disabled = false,
  onClick,
  variant = 'secondary',
}) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      title={tooltip}
    >
      <Icon />
      {label}
    </StyledButton>
  );
}; 