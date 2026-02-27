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

const EMPLOYEE_LIST_URL = "http://localhost:5000/testemployee/list";

export async function fetchEmployeeList(payload: EmployeeListRequest) {
  console.log('fetchEmployeeList >>>', payload);
  const response = await fetch(EMPLOYEE_LIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  }).then((res) => {
    console.log('Raw response:', res);
    return res;
  });
  if (!response.ok) {
    throw new Error(`Employee list request failed with status ${response.status}`);
  }

  return response.json();
}
