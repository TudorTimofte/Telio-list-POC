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

export async function fetchEmployeeList<T = unknown>(
  payload: EmployeeListRequest
): Promise<T> {

  const response = await fetch('testemployee/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(
      `Employee list request failed with status ${response.status}`
    );
  }

  return await response.json();
}
