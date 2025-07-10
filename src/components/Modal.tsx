import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { type Theme } from '../types/theme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Overlay = styled.div<{ $theme: Theme }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div<{ $theme: Theme }>`
  background-color: ${props => props.$theme.colors.surface};
  color: ${props => props.$theme.colors.text};
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.$theme.shadows.lg};
`;

const Header = styled.div<{ $theme: Theme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2<{ $theme: Theme }>`
  margin: 0;
  color: ${props => props.$theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button<{ $theme: Theme }>`
  background: none;
  border: none;
  color: ${props => props.$theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.$theme.colors.text};
  }
`;

/**
 * Reusable modal component with theme support
 */
export const Modal: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <Overlay $theme={theme} onClick={onClose}>
      <ModalContainer
        $theme={theme}
        onClick={e => e.stopPropagation()}
      >
        <Header $theme={theme}>
          <Title $theme={theme}>{title}</Title>
          <CloseButton $theme={theme} onClick={onClose}>×</CloseButton>
        </Header>
        {children}
      </ModalContainer>
    </Overlay>
  );
}; 