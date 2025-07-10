import React from 'react';
import styled from 'styled-components';
import { PlusCircle, PlusSquare, Download, Brain } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { type ExportFormat } from '../../types/api';
import { uiConfig } from '../../config/UIConfig';

interface ActionToolbarProps {
  /** Handler for adding a new row */
  onAddRow: () => void;
  /** Handler for adding a new column */
  onAddColumn: () => void;
  /** Handler for exporting data */
  onExport: (format: ExportFormat) => void;
  /** Handler for opening the AI analysis dialog */
  onOpenAIDialog: () => void;
  /** Whether export is in progress */
  isExporting?: boolean;
}

const ToolbarContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 0;
  margin-bottom: 20px;
`;

/**
 * A modern toolbar component that contains action buttons for the student table.
 * Includes buttons for adding rows/columns, exporting data, and running AI analysis.
 */
export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onAddRow,
  onAddColumn,
  onExport,
  onOpenAIDialog,
  isExporting = false,
}) => {
  return (
    <ToolbarContainer>
      <ToolbarButton
        icon={PlusCircle}
        label={uiConfig.toolbar.addRow.text}
        tooltip={uiConfig.toolbar.addRow.tooltip}
        onClick={onAddRow}
      />
      <ToolbarButton
        icon={PlusSquare}
        label={uiConfig.toolbar.addColumn.text}
        tooltip={uiConfig.toolbar.addColumn.tooltip}
        onClick={onAddColumn}
      />
      <ToolbarButton
        icon={Download}
        label={uiConfig.toolbar.export.text}
        tooltip={uiConfig.toolbar.export.tooltip}
        onClick={() => onExport('csv')}
        disabled={isExporting}
      />
      <ToolbarButton
        icon={Brain}
        label={uiConfig.toolbar.aiAnalysis.text}
        tooltip={uiConfig.toolbar.aiAnalysis.tooltip}
        onClick={onOpenAIDialog}
        variant="primary"
      />
    </ToolbarContainer>
  );
}; 