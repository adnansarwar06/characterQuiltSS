/**
 * Configuration for API endpoints and related settings
 */
export const apiConfig = {
  /**
   * Base URL for API endpoints
   */
  baseUrl: 'http://localhost:8000',

  /**
   * API endpoint paths
   */
  endpoints: {
    llmComplete: '/api/llm-complete',
  },

  /**
   * UI text configurations for LLM completion dialog
   */
  llmDialog: {
    buttonText: 'Run AI Analysis',
    dialogTitle: 'AI Analysis',
    promptPlaceholder: 'Enter your analysis prompt (e.g., "Predict likely career paths", "Classify study habits")...',
    submitButtonText: 'Analyze',
    cancelButtonText: 'Cancel',
    loadingText: 'Processing with AI...',
    errorMessages: {
      AUTH_ERROR: 'OpenAI API key is invalid or not configured. Please check your backend configuration.',
      RATE_LIMIT: 'OpenAI rate limit exceeded. Please try again in a few minutes.',
      TIMEOUT: 'Request timed out. Please try again.',
      PARSE_ERROR: 'Failed to process AI response. Please try a different prompt.',
      INTERNAL_ERROR: 'An unexpected error occurred. Please try again or contact support.',
      default: 'An error occurred while processing your request',
    },
    successText: 'AI analysis complete',
    newColumnTitle: 'AI Analysis Result',
  },

  /**
   * Table configuration
   */
  table: {
    /**
     * Export settings
     */
    export: {
      buttonText: 'Export Data',
      csvFileName: (date: string) => `student_records_${date}.csv`,
      jsonFileName: (date: string) => `student_records_${date}.json`,
      loadingText: 'Preparing export...',
      successText: 'Export complete',
      errorText: 'Failed to export data',
    },

    /**
     * Sorting settings
     */
    sort: {
      ascendingIcon: '↑',
      descendingIcon: '↓',
      unsortedIcon: '↕',
      tooltipText: 'Click to sort',
    },
  },
} as const; 