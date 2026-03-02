
import './App.css';
// import TableUI from './components/TableUI/TableUI';
import TableAgGrid from './components/TableAgGrid/TableAgGrid';
import tableConfigs from './tableConfigs.json';
import { fetchEmployeeList, type EmployeeListRequest } from './api/employeeApi';
import type { FilterSelectionItem, RowData } from './components/FiltersMenu/FiltersMenu.types';


import React, { useState } from 'react';
import useTestEmployeeList from './hooks/useTestEmployeeList';

function App() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data, count, loading, error } = useTestEmployeeList({ page: pageIndex + 1, pageSize });

  // When pageSize changes, reset to first page
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  const fetchEmployeesByFilters = async (filters: FilterSelectionItem[]) => {
    const normalizedFilters = filters.filter((item) => item.values.length > 0);
    const filterObject = normalizedFilters.reduce<Record<string, string[]>>(
      (accumulator, current) => {
        accumulator[current.fieldName] = current.values;
        return accumulator;
      },
      {},
    );

    console.log('11111>>>', filterObject);

    const payload: EmployeeListRequest = {
      Columns: [
        { ColumnName: 'FirstName', Visible: true },
        { ColumnName: 'Age', Visible: false }
      ],
      FilterJson: JSON.stringify(filterObject),
      Sortings: [],
      Paging: { CurrentPage: 1, PageSize: 10 },
    };

    try {
      // const data = await fetchEmployeeList(payload);

      // if (Array.isArray(data)) {
      //   setMockData(data);
      //   return;
      // }

      // if (Array.isArray(data?.items)) {
      //   setMockData(data.items);
      //   return;
      // }

      // if (Array.isArray(data?.Data)) {
      //   setMockData(data.Data);
      //   return;
      // }

      // setMockData([]);
    } catch (error) {
      console.error('Failed to fetch employee list', error);
      setMockData([]);
    }
  };

  return (
    <div>
      <TableAgGrid
        config={tableConfigs.config1}
        data={data}
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
