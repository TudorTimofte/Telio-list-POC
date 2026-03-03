
import './App.css';
// import TableUI from './components/TableUI/TableUI';
import TableAgGrid from './components/TableAgGrid/TableAgGrid';
import tableConfigs from './tableConfigs.json';
import { fetchEmployeeList, type EmployeeListRequest } from './api/employeeApi';
import type { FilterSelectionItem } from './components/FiltersMenu/FiltersMenu.types';


import { useState } from 'react';
import useTestEmployeeList from './hooks/useTestEmployeeList';

interface EmployeeListResponse {
  Data?: Record<string, unknown>[];
}

function App() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState<Record<string, unknown>[]>([]);
  const { data, count, loading, error } = useTestEmployeeList({ page: pageIndex + 1, pageSize });

  // When pageSize changes, reset to first page
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  const fetchEmployeesByFilters = async (filters: FilterSelectionItem[]) => {
   const normalizedFilters = filters.filter(
    (item) => item.values.length > 0
  );


  // Build FilterJson string with repeated keys for multiple selections
  let filterJsonStr = '';
  normalizedFilters.forEach((current) => {
    current.values.forEach((value) => {
      if (filterJsonStr.length > 0) filterJsonStr += ',';
      filterJsonStr += `"${current.fieldName}":"${value}"`;
    });
  });
  filterJsonStr = filterJsonStr ? `{${filterJsonStr}}` : '';

  const payload: EmployeeListRequest = {
    Columns: [
      { ColumnName: 'FirstName', Visible: true },
      { ColumnName: 'LastName', Visible: true },
      { ColumnName: 'AssignedTo', Visible: true },
      { ColumnName: 'Salary', Visible: true },
      { ColumnName: 'Age', Visible: true },
      { ColumnName: 'LastLogin', Visible: true }
    ],
    FilterJson: filterJsonStr,
    // FilterJson: JSON.stringify({ "Name": "Aaron" }),
    Sortings: [
      { ColumnName: 'LastName', Direction: 1 }
    ],
    Paging: { CurrentPage: 1, PageSize: 10 },
  };


    console.log('Filter payload', payload.FilterJson);

    try {
      const response = await fetchEmployeeList<EmployeeListResponse>(payload);
      console.log('response>>>>', response);

      if (response && response.Data) {
        setFilteredData(response.Data);
      }

    } catch (error) {
      console.error('Failed to fetch employee list', error);
      setFilteredData([]);
    }
  };

  return (
    <div>
      <TableAgGrid
        config={tableConfigs.config1}
        data={filteredData.length > 0 ? filteredData : data}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        total={count}
        loading={loading}
        onFiltersChange={fetchEmployeesByFilters}
      />
      {error && <div className="text-red-500 mt-4">Error loading data</div>}
    </div>
  );
}

// Imports now handled inside TableUI folder
export default App;
