import { useState } from 'react';
import styled from 'styled-components';
import { type GridColumn } from '@glideapps/glide-data-grid';
import { apiConfig } from '../config/ApiConfig';
import { type StudentRecord } from '../config/StudentTableConfig';
import { type LLMCompletionRequest, type LLMCompletionResponse } from '../types/api';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  color: #333;
`;

const Description = styled.p`
  margin: 0 0 1.5rem;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${props => props.variant === 'primary' ? '#4a90e2' : '#e2e8f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#357abd' : '#cbd5e1'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⚠️';
  }
`;

const ExamplePrompts = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const ExamplePromptTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const ExamplePromptList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: #718096;

  li {
    margin-bottom: 0.25rem;
    cursor: pointer;
    &:hover {
      color: #4a90e2;
    }
  }
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rows: StudentRecord[];
  columns: GridColumn[];
  onComplete: (results: string[]) => void;
}

const EXAMPLE_PROMPTS = [
  "Predict potential career paths based on student data",
  "Analyze study patterns and suggest improvements",
  "Identify students who might need additional support",
  "Suggest extracurricular activities based on interests",
];

/**
 * Dialog component for running AI analysis on student data
 */
export const RunLLMCompletionDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  rows,
  columns,
  onComplete,
}) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  /**
   * Handles the form submission and API call
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload: LLMCompletionRequest = {
        rows,
        columns,
        prompt,
      };

      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.llmComplete}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData.code as keyof typeof apiConfig.llmDialog.errorMessages;
        throw new Error(apiConfig.llmDialog.errorMessages[errorCode] || apiConfig.llmDialog.errorMessages.default);
      }

      const data: LLMCompletionResponse = await response.json();
      onComplete(data.llm_results);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : apiConfig.llmDialog.errorMessages.default);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent onClick={e => e.stopPropagation()}>
        <Title>{apiConfig.llmDialog.dialogTitle}</Title>
        <Description>
          Enter a prompt to analyze the student data. The AI will generate insights for each student
          based on your prompt. The results will be added as a new column in the table.
        </Description>
        <Form onSubmit={handleSubmit}>
          <TextArea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={apiConfig.llmDialog.promptPlaceholder}
            disabled={isLoading}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ExamplePrompts>
            <ExamplePromptTitle>Example Prompts:</ExamplePromptTitle>
            <ExamplePromptList>
              {EXAMPLE_PROMPTS.map((example, index) => (
                <li key={index} onClick={() => handleExampleClick(example)}>
                  {example}
                </li>
              ))}
            </ExamplePromptList>
          </ExamplePrompts>
          <ButtonGroup>
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              {apiConfig.llmDialog.cancelButtonText}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  {apiConfig.llmDialog.loadingText}
                </>
              ) : (
                apiConfig.llmDialog.submitButtonText
              )}
            </Button>
          </ButtonGroup>
        </Form>
      </DialogContent>
    </DialogOverlay>
  );
}; 