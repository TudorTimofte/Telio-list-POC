
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
      {/* <TableUI config={tableConfigs.config1} data={mockData} />
      <div className="my-12 border-t border-gray-300 w-full max-w-7xl mx-auto" /> */}
      <TableAgGrid config={tableConfigs.config1} data={mockData} />
        <button
          style={{ marginTop: '20px' }}
          onClick={async () => {
            const payload = {
              Columns: [
                { ColumnName: 'FirstName', Visible: true },
                { ColumnName: 'Age', Visible: false }
              ],
              FilterJson: '{"Name":"Aaron"}',
              Sortings: [
                { ColumnName: 'LastName', Direction: 1 }
              ],
              Paging: { CurrentPage: 1, PageSize: 10 }
            };
            try {
              const response = await fetch('/testemployee/list', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              });
              const result = await response.json();
              alert('API call successful! Check console for result.');
              console.log(result);
            } catch (error) {
              alert('API call failed!');
              console.error(error);
            }
          }}
        >
          Call Test Employee API
        </button>
    </div>
  );
}

// Imports now handled inside TableUI folder
export default App;
