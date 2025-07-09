import { type GridColumn } from '@glideapps/glide-data-grid';

/**
 * Defines the structure of a student record in the table
 */
export interface StudentRecord {
  id: string;
  firstName: string;
  lastName: string;
  major: string;
}

/**
 * Configuration for the student table columns
 */
export const studentTableColumns: GridColumn[] = [
  {
    id: 'firstName',
    title: 'First Name',
    width: 150,
  },
  {
    id: 'lastName',
    title: 'Last Name',
    width: 150,
  },
  {
    id: 'major',
    title: 'Major',
    width: 200,
  },
];

/**
 * Configuration settings for the student table
 */
export const tableConfig = {
  width: '100%',
  height: 400,
  smoothScrollX: true,
  smoothScrollY: true,
  isDraggable: false,
  experimental: {
    strict: true,
  },
}; 