/**
 * Configuration for UI elements including icons and text
 */
export const uiConfig = {
  /**
   * Header configuration
   */
  header: {
    title: 'Student Records',
  },

  /**
   * Toolbar button configurations
   */
  toolbar: {
    addRow: {
      text: 'Add Row',
      tooltip: 'Add a new student record',
    },
    addColumn: {
      text: 'Add Column',
      tooltip: 'Add a new column',
    },
    export: {
      text: 'Export',
      tooltip: 'Export data to CSV or JSON',
      formats: {
        csv: 'CSV',
        json: 'JSON',
      },
      selectPlaceholder: 'Select format...',
    },
    aiAnalysis: {
      text: 'AI Analysis',
      tooltip: 'Run AI analysis on data',
    },
  },

  /**
   * Modal configurations
   */
  modals: {
    addRow: {
      title: 'Add New Student',
      submitText: 'Add Student',
      cancelText: 'Cancel',
    },
    editCell: {
      title: 'Edit Value',
      submitText: 'Save',
      cancelText: 'Cancel',
    },
    editColumn: {
      title: 'Edit Column',
      submitText: 'Save',
      cancelText: 'Cancel',
    },
  },

  /**
   * Form field labels and placeholders
   */
  forms: {
    firstName: {
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
    },
    lastName: {
      label: 'Last Name',
      placeholder: 'Enter last name',
      required: true,
    },
    major: {
      label: 'Major',
      placeholder: 'Enter major',
      required: true,
    },
  },
} as const; 