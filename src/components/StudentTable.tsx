import { useCallback, useState, useMemo } from 'react';
import {
  DataEditor,
  GridCellKind,
  type Item,
  type GridCell,
  type EditableGridCell,
  type GridColumn,
  type SizedGridColumn,
} from '@glideapps/glide-data-grid';
import '@glideapps/glide-data-grid/dist/index.css';
import styled from 'styled-components';
import { RunLLMCompletionDialog } from './RunLLMCompletionDialog';
import { Modal } from './Modal';
import { apiConfig } from '../config/ApiConfig';
import { type StudentRecord } from '../config/StudentTableConfig';
import { type ColumnSort, type SortDirection, type ExportFormat } from '../types/api';
import { ActionToolbar } from './common/ActionToolbar';
import { Button } from './Button';
import { DownloadIcon } from './icons/DownloadIcon';
import { BrainIcon } from './icons/BrainIcon';
import { PlusIcon } from './icons/PlusIcon';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  background-color: #f1f5f9;
  padding: 20px;
  box-sizing: border-box;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  position: relative;
  background-color: #f1f5f9;
  min-height: 100vh;
  padding-bottom: 100px;
  padding-left: 40px;
  padding-top: 20px;
`;

const TitleBox = styled.div`
  background-color: #f1f5f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: fit-content;
  min-width: 300px;
  max-width: 500px;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;

  button {
    background-color: #0f172a;
    color: white;
    &:hover {
      background-color: #1e293b;
    }
  }
`;

const AddRowButton = styled(Button)`
  position: absolute;
  bottom: -50px;
  left: 0;
  background-color: #f1f5f9;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  height: 40px;
  min-width: 80px;
  padding: 6px 8px;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

const AddColumnButton = styled(Button)`
  position: absolute;
  top: 0;
  left: calc(100% + 10px);
  background-color: #f1f5f9;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  height: 40px;
  min-width: 150px;
  padding: 6px 8px;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

const PlayButtonOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
`;

const PlayButton = styled.button`
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e2e8f0;
  }

  &.visible {
    opacity: 1;
  }

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 6px solid #1e293b;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    margin-left: 2px;
  }
`;

const EditorContainer = styled.div`
  border: none;
  border-radius: 8px;
  overflow: visible;
  background-color: #f1f5f9;
  height: fit-content;
  width: fit-content;
  position: relative;

  /* Show play button on cell hover */
  &:hover ${PlayButton} {
    opacity: 1;
  }
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' }>`
  padding: 8px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${props => props.type === 'success' ? props.theme.colors.success + '20' : props.theme.colors.error + '20'};
  color: ${props => props.type === 'success' ? props.theme.colors.success : props.theme.colors.error};
`;

const EditModal = styled(Modal)`
  .modal-content {
    width: 400px;
    padding: 2rem;
  }
`;

const EditInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  
  &.primary {
    background-color: #3b82f6;
    color: white;
    
    &:hover {
      background-color: #2563eb;
    }
  }
  
  &.secondary {
    background-color: #e5e7eb;
    color: #374151;
    
    &:hover {
      background-color: #d1d5db;
    }
  }
`;

interface Props {
  initialData: StudentRecord[];
}

export const StudentTable: React.FC<Props> = ({ initialData }) => {
  const [columns, setColumns] = useState<SizedGridColumn[]>([
    { title: "Index", id: "index", width: 80 },
    { title: "First Name", id: "firstName", width: 150 },
    { title: "Last Name", id: "lastName", width: 150 },
    { title: "Major", id: "major", width: 150 },
  ]);

  const [rows, setRows] = useState<StudentRecord[]>(
    // Only keep rows that have actual data
    initialData.filter(row => 
      Object.entries(row).some(([key, value]) => 
        key !== 'id' && value !== undefined && value !== null && value !== ""
      )
    )
  );
  const [isLLMDialogOpen, setIsLLMDialogOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [sort, setSort] = useState<ColumnSort | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [aiAnalysisCount, setAiAnalysisCount] = useState(0);
  const [editModal, setEditModal] = useState<{
    type: 'cell' | 'column' | 'title';
    value: string;
    position?: Item;
    columnIndex?: number;
  } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<Item | null>(null);
  const [tableTitle, setTableTitle] = useState("Student Records");

  /**
   * Clear status message after delay
   */
  const showStatusMessage = useCallback((text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  /**
   * Sort rows based on current sort configuration
   */
  const sortedRows = useMemo(() => {
    if (!sort?.columnId) return rows;

    return [...rows].sort((a, b) => {
      const aValue = String(a[sort.columnId as keyof StudentRecord] || '');
      const bValue = String(b[sort.columnId as keyof StudentRecord] || '');
      
      if (sort.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [rows, sort]);

  /**
   * Filter out empty rows and get actual row count
   */
  const nonEmptyData = useMemo(() => {
    // Show all rows, including empty ones after adding
    const dataRows = sortedRows;

    // Include all columns - they should all be visible
    const dataColumns = columns.filter(col => {
      if (!col.id || col.id === 'id') return false;
      return true; // Show all columns, including empty ones
    });

    // Calculate total width based on column widths
    const totalWidth = dataColumns.reduce((sum, col) => sum + col.width, 0);

    return {
      rows: dataRows,
      columns: dataColumns,
      height: Math.max((dataRows.length + 1) * 40, 120), // Reduced from 45px to 40px per row, minimum 120px
      width: totalWidth
    };
  }, [sortedRows, columns]);

  /**
   * Enhanced column definitions with custom header click handling
   */
  const enhancedColumns = useMemo(() => {
    return columns.map((col, index) => ({
        ...col,
      themeOverride: {
        textDark: "#1e293b",
        bgHeader: "#f1f5f9",
        bgHeaderHovered: "#e2e8f0",
        bgHeaderHasFocus: "#e2e8f0",
        borderColor: "#cbd5e1",
        bgCell: "#f1f5f9",
        bgCellMedium: "#e2e8f0",
        accentColor: "#64748b",
        accentLight: "#94a3b8",
        textMedium: "#64748b",
        textLight: "#94a3b8",
      },
      headerIcon: sort && sort.columnId === col.id ? 
        (sort.direction === 'asc' ? '↑' : sort.direction === 'desc' ? '↓' : '↕') : 
        undefined,
    }));
  }, [columns, sort]);

  const getCellContent = useCallback(([col, row]: Item): GridCell => {
    if (row >= rows.length || col >= nonEmptyData.columns.length) {
      return {
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: false,
        style: "faded"
      };
    }

    const rowData = rows[row];
    const column = nonEmptyData.columns[col];
    
    if (!column?.id) {
      return {
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: false,
        style: "faded"
      };
    }

    // Handle index column
    if (column.id === 'index') {
      return {
        kind: GridCellKind.Text,
        data: String(row + 1),
        displayData: String(row + 1),
        allowOverlay: false,
        style: "normal",
        themeOverride: {
          bgCell: "#f1f5f9",
          bgCellMedium: "#e2e8f0",
        }
      };
    }

    const value = rowData[column.id as keyof StudentRecord];
    if (value === undefined || value === null || value === "") {
      return {
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: true,
        style: "faded",
        themeOverride: {
          bgCell: "#f1f5f9",
          bgCellMedium: "#e2e8f0",
        }
      };
    }

    return {
      kind: GridCellKind.Text,
      data: String(value),
      displayData: String(value),
      allowOverlay: true,
      style: "normal",
      themeOverride: {
        bgCell: "#f1f5f9",
        bgCellMedium: "#e2e8f0",
      }
    };
  }, [nonEmptyData.columns, rows]);

  const onCellEdited = useCallback(([col, row]: Item, newValue: EditableGridCell) => {
    if (newValue.kind !== GridCellKind.Text) return;
    
    const { rows: dataRows, columns: dataColumns } = nonEmptyData;
    if (row >= dataRows.length || col >= dataColumns.length) return;
    
    const column = dataColumns[col];
    if (!column?.id) return;

    const originalRowIndex = sortedRows.findIndex(r => r.id === dataRows[row].id);
    if (originalRowIndex === -1) return;

    setRows(prevRows => {
      const newRows = [...prevRows];
      const newRow = { ...newRows[originalRowIndex] };
        newRow[column.id as keyof StudentRecord] = newValue.data;
      newRows[originalRowIndex] = newRow;
      return newRows;
    });
  }, [nonEmptyData, sortedRows]);

  /**
   * Handle cell click for modal editing
   */
  const onCellClicked = useCallback((location: Item, event: any) => {
    // Check if it's a double-click by tracking clicks
    const now = Date.now();
    const lastClick = (onCellClicked as any).lastClick || 0;
    
    if (now - lastClick < 300) { // Double-click within 300ms
      const [col, row] = location;
      const column = nonEmptyData.columns[col];
      
      if (!column?.id || column.id === 'index') return; // Don't edit index column
      
      const rowData = nonEmptyData.rows[row];
      if (!rowData) return;
      
      const currentValue = String(rowData[column.id as keyof StudentRecord] || '');
      
      setEditModal({
        type: 'cell',
        value: currentValue,
        position: location
      });
    }
    
    (onCellClicked as any).lastClick = now;
  }, [nonEmptyData]);

  /**
   * Handle header click with double-click detection for renaming
   */
  const onHeaderClicked = useCallback((colIndex: number, event?: any) => {
    const now = Date.now();
    const lastHeaderClick = (onHeaderClicked as any).lastClick || 0;
    
    if (now - lastHeaderClick < 300) { // Double-click within 300ms
      const column = columns[colIndex];
      if (!column?.id || column.id === 'index') return; // Don't rename index column
      
      setEditModal({
        type: 'column',
        value: column.title,
        columnIndex: colIndex
      });
      return;
    }
    
    (onHeaderClicked as any).lastClick = now;
    
    // Handle sorting on single click
    const column = columns[colIndex];
    const columnId = column?.id;
    if (typeof columnId !== 'string') return;

    setSort((prevSort): ColumnSort | null => {
      const currentDirection = prevSort?.columnId === columnId ? prevSort.direction : null;
      
      if (currentDirection === 'asc') {
        return { columnId, direction: 'desc' };
      } else if (currentDirection === 'desc') {
        return null;
      }
      return { columnId, direction: 'asc' };
    });
  }, [columns]);

  /**
   * Export data to CSV or JSON
   */
  const exportData = useCallback(async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      let data: string;
      const date = new Date().toISOString().split('T')[0];
      let filename: string;

      if (format === 'csv') {
        const headers = nonEmptyData.columns.map(col => col.title.replace(/[↑↓↕]/g, '').trim()).join(',');
        const rows = nonEmptyData.rows.map(row => 
          nonEmptyData.columns.map(col => 
            JSON.stringify(row[col.id as keyof StudentRecord] || '')
          ).join(',')
        ).join('\n');
        data = `${headers}\n${rows}`;
        filename = apiConfig.table.export.csvFileName(date);
      } else {
        data = JSON.stringify(nonEmptyData.rows, null, 2);
        filename = apiConfig.table.export.jsonFileName(date);
      }

      // Create and trigger download
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showStatusMessage(apiConfig.table.export.successText, 'success');
    } catch (error) {
      showStatusMessage(apiConfig.table.export.errorText, 'error');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [nonEmptyData, showStatusMessage]);

  const addRow = useCallback(() => {
    const newRow: StudentRecord = {
      id: `row-${Date.now()}`,
      firstName: "",
      lastName: "",
      major: "",
    };

    // Add any AI analysis columns that exist
    for (let i = 1; i <= aiAnalysisCount; i++) {
      (newRow as any)[`ai_analysis_${i}`] = "";
    }

    // Add empty values for any custom columns
    columns.forEach(col => {
      const columnId = col.id;
      if (columnId && !['firstName', 'lastName', 'major'].includes(columnId)) {
        (newRow as any)[columnId] = "";
      }
    });

    setRows(prevRows => [...prevRows, newRow]);
  }, [aiAnalysisCount, columns]);

  const addColumn = useCallback(() => {
    const name = prompt("Enter column name:");
    if (!name) return;
    
    const id = name.toLowerCase().replace(/\s+/g, "_");
    
    setColumns(prevColumns => [...prevColumns, { title: name, id, width: 150 }]);
    setRows(prevRows => prevRows.map(row => ({ ...row, [id]: "" })));
  }, []);

  const updateColumn = useCallback(() => {
    const columnIndex = parseInt(prompt("Enter column index to update (0-based):", "0") || "-1");
    if (columnIndex < 0 || columnIndex >= columns.length) {
      alert("Invalid column index!");
      return;
    }

    const newTitle = prompt("Enter new column name:", columns[columnIndex].title);
    if (!newTitle) return;

    setColumns(old => {
      const newColumns = [...old];
      newColumns[columnIndex] = {
        ...newColumns[columnIndex],
        title: newTitle,
      };
      return newColumns;
    });
  }, [columns]);

  const updateRow = useCallback(() => {
    const rowIndex = parseInt(prompt("Enter row index to update (0-based):", "0") || "-1");
    if (rowIndex < 0 || rowIndex >= rows.length) {
      alert("Invalid row index!");
      return;
    }

    const currentRow = rows[rowIndex];
    const updatedRow = { ...currentRow };

    // Prompt for each column value
    columns.forEach(column => {
      if (column.id) {
        const newValue = prompt(
          `Enter new value for ${column.title}:`,
          currentRow[column.id as keyof StudentRecord]?.toString()
        );
        if (newValue !== null) {
          updatedRow[column.id as keyof StudentRecord] = newValue;
        }
      }
    });

    setRows(prevRows => {
      const newRows = [...prevRows];
      if (rowIndex >= 0 && rowIndex < newRows.length) {
        newRows[rowIndex] = updatedRow;
      }
      return newRows;
    });
  }, [columns, rows]);

  const updateCell = useCallback(() => {
    const rowIndex = parseInt(prompt("Enter row index to update (0-based):", "0") || "-1");
    if (rowIndex < 0 || rowIndex >= rows.length) {
      alert("Invalid row index!");
      return;
    }

    const columnIndex = parseInt(prompt("Enter column index to update (0-based):", "0") || "-1");
    if (columnIndex < 0 || columnIndex >= columns.length) {
      alert("Invalid column index!");
      return;
    }

    const column = columns[columnIndex];
    if (!column?.id) {
      alert("Invalid column configuration!");
      return;
    }

    const currentRow = rows[rowIndex];
    const columnId = column.id as keyof StudentRecord;
    const currentValue = currentRow[columnId]?.toString() || "";
    const newValue = prompt(
      `Enter new value for ${column.title} at row ${rowIndex}:`,
      currentValue
    );

    if (newValue === null) return;

    setRows(prevRows => {
      const newRows = [...prevRows];
      if (rowIndex >= 0 && rowIndex < newRows.length) {
        const newRow = { ...newRows[rowIndex] };
        newRow[columnId] = newValue;
        newRows[rowIndex] = newRow;
      }
      return newRows;
    });
  }, [columns, rows]);

  /**
   * Handles the completion of LLM processing by adding a new column
   * and populating it with the results
   */
  const handleLLMComplete = useCallback((results: string[]) => {
    setAiAnalysisCount(prev => {
      const newCount = prev + 1;
      const columnName = `AI Analysis ${newCount}`;
      const columnId = `ai_analysis_${newCount}`;
      
      setColumns(prevColumns => [...prevColumns, { title: columnName, id: columnId, width: 200 }]);
      setRows(prevRows => 
        prevRows.map((row, index) => ({
          ...row,
          [columnId]: results[index] || "",
        }))
      );
      
      return newCount;
    });
  }, []);

  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === column.id ? { ...col, width: Math.max(50, newSize) } : col
      )
    );
  }, []);

  const handleAddRow = useCallback(() => {
    const newRow: StudentRecord = {
      id: `row-${Date.now()}`,
      firstName: "",
      lastName: "",
      major: "",
    };

    // Add any AI analysis columns that exist
    for (let i = 1; i <= aiAnalysisCount; i++) {
      (newRow as any)[`ai_analysis_${i}`] = "";
    }

    // Add empty values for any custom columns
    columns.forEach(col => {
      const columnId = col.id;
      if (columnId && !['index', 'firstName', 'lastName', 'major'].includes(columnId)) {
        (newRow as any)[columnId] = "";
      }
    });

    setRows(prevRows => [...prevRows, newRow]);
  }, [aiAnalysisCount, columns]);

  const handleAddColumn = useCallback(() => {
    const name = prompt("Enter column name:");
    if (!name) return;
    
    const id = name.toLowerCase().replace(/\s+/g, "_");
    
    // Add the new column to the columns array
    setColumns(prevColumns => [...prevColumns, { title: name, id, width: 150 }]);
    
    // Add empty values for this column to all existing rows
    setRows(prevRows => prevRows.map(row => ({ ...row, [id]: "" })));
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportData('csv');
      setStatusMessage({ text: 'Export completed successfully', type: 'success' });
    } catch (error) {
      setStatusMessage({ text: 'Export failed: ' + (error as Error).message, type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Save cell edit
   */
  const saveCellEdit = useCallback((newValue: string) => {
    if (!editModal?.position) return;
    
    const [col, row] = editModal.position;
    const column = nonEmptyData.columns[col];
    
    if (!column?.id) return;
    
    const rowData = nonEmptyData.rows[row];
    const originalRowIndex = sortedRows.findIndex(r => r.id === rowData.id);
    
    if (originalRowIndex === -1) return;

    setRows(prevRows => {
      const newRows = [...prevRows];
      const newRow = { ...newRows[originalRowIndex] };
      newRow[column.id as keyof StudentRecord] = newValue;
      newRows[originalRowIndex] = newRow;
      return newRows;
    });
    
    setEditModal(null);
  }, [editModal, nonEmptyData, sortedRows]);

  /**
   * Save column rename
   */
  const saveColumnRename = useCallback((newName: string) => {
    if (editModal?.columnIndex === undefined) return;
    
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      newColumns[editModal.columnIndex!] = {
        ...newColumns[editModal.columnIndex!],
        title: newName
      };
      return newColumns;
    });
    
    setEditModal(null);
  }, [editModal]);

  /**
   * Handle title click for editing
   */
  const handleTitleClick = useCallback(() => {
    setEditModal({
      type: 'title',
      value: tableTitle,
    });
  }, [tableTitle]);

  /**
   * Save title edit
   */
  const saveTitleEdit = useCallback((newTitle: string) => {
    setTableTitle(newTitle);
    setEditModal(null);
  }, []);

  /**
   * Handle modal save
   */
  const handleModalSave = useCallback(() => {
    if (!editModal) return;
    
    if (editModal.type === 'cell') {
      saveCellEdit(editModal.value);
    } else if (editModal.type === 'column') {
      saveColumnRename(editModal.value);
    } else if (editModal.type === 'title') {
      saveTitleEdit(editModal.value);
    }
  }, [editModal, saveCellEdit, saveColumnRename, saveTitleEdit]);

  /**
   * Handle Enter key press in modal
   */
  const handleModalKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleModalSave();
    }
  }, [handleModalSave]);

  /**
   * Handle mouse move to track hovered cell only
   */
  const onMouseMove = useCallback((args: any) => {
    if (args.kind === "cell" && args.location) {
      setHoveredCell(args.location);
    } else {
      setHoveredCell(null);
    }
  }, []);

  /**
   * Handle play button click
   */
  const handlePlayButtonClick = useCallback((location: Item) => {
    const [col, row] = location;
    const column = nonEmptyData.columns[col];
    
    if (!column?.id || column.id === 'index') return;
    
    const rowData = nonEmptyData.rows[row];
    if (!rowData) return;
    
    const currentValue = String(rowData[column.id as keyof StudentRecord] || '');
    
    setEditModal({
      type: 'cell',
      value: currentValue,
      position: location
    });
  }, [nonEmptyData]);

  /**
   * Calculate play button position
   */
  const getPlayButtonStyle = useCallback((location: Item) => {
    const [col, row] = location;
    const columnWidth = nonEmptyData.columns[col]?.width || 150;
    
    return {
      top: `${row * 40 + 40 + 8}px`, // row height * row index + header height + padding
      left: `${nonEmptyData.columns.slice(0, col).reduce((sum, c) => sum + c.width, 0) + columnWidth - 32}px`, // sum of previous column widths + current column width - button width - padding
    };
  }, [nonEmptyData]);

  return (
    <TableContainer>
      <TitleBox onClick={handleTitleClick}>
        <Title>{tableTitle}</Title>
      </TitleBox>
      
      <ButtonContainer>
        <Button onClick={handleExport} disabled={isExporting}>
          <DownloadIcon /> Export
        </Button>
        <Button onClick={() => setIsLLMDialogOpen(true)} variant="primary" disabled={isExporting}>
          <BrainIcon /> AI Analysis
        </Button>
      </ButtonContainer>

      <EditorContainer>
        <DataEditor
          getCellContent={getCellContent}
          columns={enhancedColumns}
          rows={nonEmptyData.rows.length}
          width={nonEmptyData.width}
          height={nonEmptyData.height}
          smoothScrollX={true}
          smoothScrollY={true}
          onCellEdited={onCellEdited}
          onHeaderClicked={onHeaderClicked}
          onCellClicked={onCellClicked}
          onMouseMove={onMouseMove}
          rowHeight={40}
          getCellsForSelection={true}
          keybindings={{}}
          drawFocusRing={false}
          drawCell={undefined}
          isDraggable={false}
          theme={{
            accentColor: "#3b82f6",
            accentFg: "#ffffff",
            accentLight: "rgba(59, 130, 246, 0.1)",
            textDark: "#1e293b",
            textMedium: "#64748b",
            textLight: "#94a3b8",
            textBubble: "#1e293b",
            bgIconHeader: "#64748b",
            fgIconHeader: "#f1f5f9",
            textHeader: "#1e293b",
            textGroupHeader: "#1e293b",
            bgCell: "#f1f5f9",
            bgCellMedium: "#e2e8f0",
            bgBubble: "#f1f5f9",
            bgBubbleSelected: "#e2e8f0",
            bgSearchResult: "#e2e8f0",
            bgHeader: "#f1f5f9",
            bgHeaderHovered: "#e2e8f0",
            bgHeaderHasFocus: "#e2e8f0",
            borderColor: "#cbd5e1",
            drilldownBorder: "#cbd5e1",
            linkColor: "#3b82f6",
            cellHorizontalPadding: 8,
            cellVerticalPadding: 6,
          }}
          experimental={{
            hyperWrapping: true,
            isSubGrid: false,
          }}
          gridSelection={undefined}
          onGridSelectionChange={() => {}}
          onColumnResize={onColumnResize}
        />

        {/* Play button overlay for cells */}
        <PlayButtonOverlay>
          {hoveredCell && hoveredCell[1] < nonEmptyData.rows.length && (
            <PlayButton
              className="visible"
              style={getPlayButtonStyle(hoveredCell)}
              onClick={() => handlePlayButtonClick(hoveredCell)}
            >
            </PlayButton>
          )}
        </PlayButtonOverlay>

        <AddRowButton onClick={handleAddRow}>
          <PlusIcon /> Add Row
        </AddRowButton>
        <AddColumnButton onClick={handleAddColumn}>
          <PlusIcon /> Add Column
        </AddColumnButton>
      </EditorContainer>

      {statusMessage && (
        <StatusMessage type={statusMessage.type === 'success' ? 'success' : 'error'}>
          {statusMessage.text}
        </StatusMessage>
      )}

      {editModal && (
        <EditModal
          isOpen={true}
          onClose={() => setEditModal(null)}
          title={
            editModal.type === 'cell' ? 'Edit Cell' : 
            editModal.type === 'column' ? 'Rename Column' :
            'Edit Title'
          }
        >
          <EditInput
            type="text"
            value={editModal.value}
            onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
            onKeyPress={handleModalKeyPress}
            placeholder={
              editModal.type === 'cell' ? 'Enter cell value' : 
              editModal.type === 'column' ? 'Enter column name' :
              'Enter title'
            }
            autoFocus
          />
          <ModalButtons>
            <ModalButton
              type="button"
              className="secondary"
              onClick={() => setEditModal(null)}
            >
              Cancel
            </ModalButton>
            <ModalButton
              type="button"
              className="primary"
              onClick={handleModalSave}
            >
              Save
            </ModalButton>
          </ModalButtons>
        </EditModal>
      )}

      {isLLMDialogOpen && (
      <RunLLMCompletionDialog
          isOpen={true}
        onClose={() => setIsLLMDialogOpen(false)}
        rows={rows}
        columns={columns}
        onComplete={handleLLMComplete}
      />
      )}
    </TableContainer>
  );
}; 