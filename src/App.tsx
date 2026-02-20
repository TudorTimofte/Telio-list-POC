
import './App.css';
import TableUI from './TableUI/TableUI';
import TableAgGrid from './TableAgGrid/TableAgGrid';
import tableConfigs from './tableConfigs.json';


import React, { useEffect, useState } from 'react';

function App() {
  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/messages')
      .then(res => res.json())
      .then(data => setMockData(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div>
      <TableUI config={tableConfigs.config1} data={mockData} />
      <div className="my-12 border-t border-gray-300 w-full max-w-7xl mx-auto" />
      <TableAgGrid config={tableConfigs.config3} data={mockData} />
    </div>
  );
}

// Imports now handled inside TableUI folder
export default App;
