export interface EmployeeColumnRequest {
  ColumnName: string;
  Visible: boolean;
}

export interface EmployeeSortingRequest {
  ColumnName: string;
  Direction: number;
}

export interface EmployeePagingRequest {
  CurrentPage: number;
  PageSize: number;
}

export interface EmployeeListRequest {
  Columns: EmployeeColumnRequest[];
  FilterJson: string;
  Sortings: EmployeeSortingRequest[];
  Paging: EmployeePagingRequest;
}

const EMPLOYEE_LIST_ENDPOINT = 'testemployee/list';

type ErrorResponse = {
  message?: string;
  error?: string;
};

function buildEmployeeListRequestOptions(payload: EmployeeListRequest): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };
}

async function buildRequestError(response: Response): Promise<Error> {
  const statusLabel = `status ${response.status}${response.statusText ? ` (${response.statusText})` : ''}`;

  try {
    const errorPayload = (await response.json()) as ErrorResponse;
    const details = errorPayload.message ?? errorPayload.error;

    if (details) {
      return new Error(`Employee list request failed with ${statusLabel}: ${details}`);
    }
  } catch {
    // Ignore JSON parsing errors and fall back to the default message.
  }

  return new Error(`Employee list request failed with ${statusLabel}`);
}

export async function fetchEmployeeList<T = unknown>(
  payload: EmployeeListRequest
): Promise<T> {
  const response = await fetch(
    EMPLOYEE_LIST_ENDPOINT,
    buildEmployeeListRequestOptions(payload)
  );

  if (!response.ok) {
    throw await buildRequestError(response);
  }

  return (await response.json()) as T;
}
