
import './App.css';
// import TableUI from './components/TableUI/TableUI';
import TableAgGrid from './components/TableAgGrid/TableAgGrid';
import tableConfigs from './tableConfigs.json';
import { fetchEmployeeList, type EmployeeListRequest } from './api/employeeApi';


import React, { useEffect, useState } from 'react';

function App() {
  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/messages')
      .then(res => res.json())
      .then(data => setMockData(Array.isArray(data) ? data : []));
  }, []);

  // useEffect(() => {
  //  const payload: EmployeeListRequest = {
  //     Columns: (tableConfigs.config1.Columns || []).map((column) => ({
  //       ColumnName: column.ColumnName,
  //       Visible: !column.Hidden,
  //     })),
  //     FilterJson: '', // No filters applied
  //     Sortings: [],
  //     Paging: {
  //       CurrentPage: tableConfigs.config1.Paging?.CurrentPage || 1,
  //       PageSize: tableConfigs.config1.Paging?.PageSize || 10,
  //     },
  //   };
  //   console.log('Prepared EmployeeListRequest payload:', payload);

  //   // fetchEmployeeList(payload)
  //   //   .then((data) => {
  //   //     console.log('Received employee list response:', data);
  //   //     // if (Array.isArray(data)) {
  //   //     //   setMockData(data);
  //   //     //   return;
  //   //     // }

  //   //     // if (Array.isArray(data?.items)) {
  //   //     //   setMockData(data.items);
  //   //     //   return;
  //   //     // }

  //   //     // if (Array.isArray(data?.data)) {
  //   //     //   setMockData(data.data);
  //   //     //   return;
  //   //     // }

  //   //     // setMockData([]);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error('Failed to fetch employee list', error);
  //   //     setMockData([]);
  //   //   });
  // }, []);

  return (
    <div>
      {/* <TableUI config={tableConfigs.config1} data={mockData} />
      <div className="my-12 border-t border-gray-300 w-full max-w-7xl mx-auto" /> */}
      <TableAgGrid config={tableConfigs.config1} data={mockData} />
    </div>
  );
}

// Imports now handled inside TableUI folder
export default App;
