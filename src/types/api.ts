import { type GridColumn } from '@glideapps/glide-data-grid';
import { type StudentRecord } from '../config/StudentTableConfig';

/**
 * Request payload for LLM completion API
 */
export interface LLMCompletionRequest {
  /**
   * Array of student records to process
   */
  rows: StudentRecord[];

  /**
   * Array of column definitions
   */
  columns: GridColumn[];

  /**
   * User-provided prompt for LLM completion
   */
  prompt: string;
}

/**
 * Response payload from LLM completion API
 */
export interface LLMCompletionResponse {
  /**
   * Array of LLM-generated results, one per input row
   */
  llm_results: string[];

  /**
   * Optional error information if the request failed
   */
  error?: APIError;
}

/**
 * Error response from API
 */
export interface APIError {
  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Machine-readable error code for handling specific error cases
   */
  code: LLMErrorCode;
}

/**
 * Possible error codes from the LLM API
 */
export type LLMErrorCode = 
  | 'AUTH_ERROR'     // Invalid API key or authentication failed
  | 'RATE_LIMIT'     // OpenAI rate limit exceeded
  | 'TIMEOUT'        // Request timed out
  | 'PARSE_ERROR'    // Failed to parse LLM response
  | 'INTERNAL_ERROR' // Unexpected server error

/**
 * Sort direction for table columns
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort configuration for a table column
 */
export interface ColumnSort {
  /**
   * Column ID to sort by
   */
  columnId: string;

  /**
   * Sort direction
   */
  direction: SortDirection;
}

/**
 * Export format options
 */
export type ExportFormat = 'csv' | 'json';

/**
 * Export configuration
 */
export interface ExportConfig {
  /**
   * Format to export data in
   */
  format: ExportFormat;

  /**
   * Optional filename (without extension)
   * If not provided, will use default from config
   */
  filename?: string;
}

/**
 * Export result
 */
export interface ExportResult {
  /**
   * Success status
   */
  success: boolean;

  /**
   * Error message if export failed
   */
  error?: string;

  /**
   * Exported data as string (CSV or JSON)
   */
  data?: string;

  /**
   * Generated filename with extension
   */
  filename?: string;
} 