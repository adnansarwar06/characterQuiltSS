import { useCallback, useState } from 'react';
import {
  DataEditor,
  GridCellKind,
  type Item,
  type GridCell,
  type EditableGridCell,
  type GridColumn,
} from '@glideapps/glide-data-grid';
import '@glideapps/glide-data-grid/dist/index.css';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #357abd;
  }
`;

const EditorContainer = styled.div`
  height: 400px;
  border: 1px solid #ccc;
`;

type RowData = Record<string, string>;

interface Props {
  initialData: Array<{ id: string; firstName: string; lastName: string; major: string }>;
}

export const StudentTable: React.FC<Props> = ({ initialData }) => {
  const [columns, setColumns] = useState<GridColumn[]>([
    { title: "First Name", id: "firstName", width: 150 },
    { title: "Last Name", id: "lastName", width: 150 },
    { title: "Major", id: "major", width: 150 },
  ]);

  const [rows, setRows] = useState<RowData[]>(initialData);

  const getCellContent = useCallback(([col, row]: Item): GridCell => {
    if (row < 0 || row >= rows.length || col < 0 || col >= columns.length) {
      return {
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: true,
      };
    }

    const rowData = rows[row];
    const column = columns[col];
    
    if (!column?.id) {
      return {
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: true,
      };
    }

    return {
      kind: GridCellKind.Text,
      data: rowData[column.id] || "",
      displayData: rowData[column.id] || "",
      allowOverlay: true,
    };
  }, [columns, rows]);

  const onCellEdited = useCallback(([col, row]: Item, newValue: EditableGridCell) => {
    if (newValue.kind !== GridCellKind.Text) return;
    if (row < 0 || row >= rows.length || col < 0 || col >= columns.length) return;
    
    const column = columns[col];
    if (!column?.id) return;

    setRows(prevRows => {
      const newRows = [...prevRows];
      if (row >= 0 && row < newRows.length) {
        const newRow = { ...newRows[row] };
        if (column.id) {
          newRow[column.id] = newValue.data;
          newRows[row] = newRow;
        }
      }
      return newRows;
    });
  }, [columns, rows]);

  const addRow = useCallback(() => {
    const newRow: RowData = { id: `row-${Date.now()}` };
    columns.forEach(col => {
      if (col.id) {
        newRow[col.id] = "";
      }
    });
    setRows(old => [...old, newRow]);
  }, [columns]);

  const addColumn = useCallback(() => {
    const name = prompt("Enter column name:");
    if (!name) return;
    
    const id = name.toLowerCase().replace(/\s+/g, "_");
    
    setColumns(old => [...old, { title: name, id, width: 150 }]);
    setRows(old => old.map(row => ({ ...row, [id]: "" })));
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
    const updatedRow: RowData = { ...currentRow };

    // Prompt for each column value
    columns.forEach(column => {
      if (column.id) {
        const newValue = prompt(
          `Enter new value for ${column.title}:`,
          currentRow[column.id]
        );
        if (newValue !== null) {
          updatedRow[column.id] = newValue;
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
    const columnId = column.id;
    const currentValue = currentRow[columnId] || "";
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

  return (
    <Container>
      <ButtonContainer>
        <Button onClick={addRow}>Add Row</Button>
        <Button onClick={addColumn}>Add Column</Button>
        <Button onClick={updateColumn}>Update Column</Button>
        <Button onClick={updateRow}>Update Row</Button>
        <Button onClick={updateCell}>Update Cell</Button>
      </ButtonContainer>
      <EditorContainer>
        <DataEditor
          width="100%"
          height={400}
          rows={rows.length}
          columns={columns}
          getCellContent={getCellContent}
          onCellEdited={onCellEdited}
          rowMarkers="both"
          isDraggable={false}
        />
      </EditorContainer>
    </Container>
  );
}; 