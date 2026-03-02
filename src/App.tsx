
import './App.css';
import TableUI from './TableUI/TableUI';
import TableAgGrid from './TableAgGrid/TableAgGrid';
import tableConfigs from './tableConfigs.json';


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
      />
      {error && <div className="text-red-500 mt-4">Error loading data</div>}
    </div>
  );
}

// Imports now handled inside TableUI folder
export default App;
