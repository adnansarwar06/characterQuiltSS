import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudentTable } from '../StudentTable';
import { apiConfig } from '../../config/ApiConfig';

const mockInitialData = [
  { id: '1', firstName: 'John', lastName: 'Doe', major: 'Computer Science' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', major: 'Biology' },
];

declare global {
  namespace NodeJS {
    interface Global {
      fetch: jest.Mock;
      URL: {
        createObjectURL: jest.Mock;
        revokeObjectURL: jest.Mock;
      };
    }
  }
}

describe('StudentTable', () => {
  beforeEach(() => {
    // Mock fetch for LLM API calls
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ llm_results: ['Result 1', 'Result 2'] }),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders table with initial data', () => {
    render(<StudentTable initialData={mockInitialData} />);
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
  });

  it('allows sorting by clicking column headers', async () => {
    render(<StudentTable initialData={mockInitialData} />);
    
    // Find and click the First Name column header
    const firstNameHeader = screen.getByText(/First Name/);
    fireEvent.click(firstNameHeader);

    // Check for sort indicator
    await waitFor(() => {
      expect(firstNameHeader.textContent).toContain(apiConfig.table.sort.ascendingIcon);
    });

    // Click again for descending sort
    fireEvent.click(firstNameHeader);
    await waitFor(() => {
      expect(firstNameHeader.textContent).toContain(apiConfig.table.sort.descendingIcon);
    });

    // Click again to remove sort
    fireEvent.click(firstNameHeader);
    await waitFor(() => {
      expect(firstNameHeader.textContent).toContain(apiConfig.table.sort.unsortedIcon);
    });
  });

  it('exports data in CSV format', async () => {
    const { getByText } = render(<StudentTable initialData={mockInitialData} />);
    
    // Mock URL.createObjectURL and document.createElement
    const mockUrl = 'blob:test';
    const mockAnchor = { click: jest.fn(), href: '', download: '' };
    
    global.URL.createObjectURL = jest.fn().mockReturnValue(mockUrl);
    global.URL.revokeObjectURL = jest.fn();
    document.createElement = jest.fn().mockReturnValue(mockAnchor as unknown as HTMLElement);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();

    // Click export button
    fireEvent.click(getByText('Export CSV'));

    // Verify export success message
    await waitFor(() => {
      expect(screen.getByText(apiConfig.table.export.successText)).toBeInTheDocument();
    });

    // Verify URL and anchor manipulation
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
  });

  it('runs AI analysis and adds new column', async () => {
    const { getByText, getByPlaceholderText } = render(
      <StudentTable initialData={mockInitialData} />
    );

    // Open AI dialog
    fireEvent.click(getByText(apiConfig.llmDialog.buttonText));

    // Enter prompt and submit
    const promptInput = getByPlaceholderText(apiConfig.llmDialog.promptPlaceholder);
    fireEvent.change(promptInput, { target: { value: 'Analyze study patterns' } });
    fireEvent.click(getByText(apiConfig.llmDialog.submitButtonText));

    // Wait for API call and verify success
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${apiConfig.baseUrl}${apiConfig.endpoints.llmComplete}`,
        expect.any(Object)
      );
      expect(screen.getByText(apiConfig.llmDialog.successText)).toBeInTheDocument();
    });

    // Verify new column was added
    expect(screen.getByText(apiConfig.llmDialog.newColumnTitle)).toBeInTheDocument();
  });
}); 