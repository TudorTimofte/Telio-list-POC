import { AgGridReact } from 'ag-grid-react';

import React, { useState, useEffect, useMemo } from 'react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const fetchData = async () => {
  const res = await fetch('http://localhost:3001/api/messages');
  return res.json();
};

export default function TableAgGrid() {
  const [rowData, setRowData] = useState([]);
  const [quickFilter, setQuickFilter] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [submited, setSubmited] = useState('');

  const columnDefs = useMemo(() => [
    { headerName: '', checkboxSelection: true, width: 40, pinned: 'left' },
    { headerName: 'Title', field: 'title', filter: true, flex: 2 },
    { headerName: 'Last Name', field: 'last name', filter: true, flex: 1 },
    { headerName: 'First Name', field: 'first name', filter: true, flex: 1 },
    { headerName: 'Assigned to', field: 'assigned to', filter: true, flex: 1 },
    { headerName: 'SIDIS Nr.', field: 'sidis', filter: true, flex: 1 },
    { headerName: 'Cell', field: 'cell', filter: true, flex: 1 },
    { headerName: 'Status', field: 'Status', filter: true, flex: 1 },
    { headerName: 'Submited', field: 'Submited', filter: true, flex: 1 },
    { headerName: 'Last interaction', field: 'last interaction', filter: true, flex: 1 },
  ], []);


  // Extract unique filter values from data
  const assignedToOptions = useMemo(() => Array.from(new Set(rowData.map(r => r['assigned to']))), [rowData]);
  const statusOptions = useMemo(() => Array.from(new Set(rowData.map(r => r['Status']))), [rowData]);
  const submitedOptions = useMemo(() => Array.from(new Set(rowData.map(r => r['Submited']))), [rowData]);

  // Filtering logic
  const filteredRows = useMemo(() => {
    return rowData.filter(row => {
      if (assignedTo && row['assigned to'] !== assignedTo) return false;
      if (status && row['Status'] !== status) return false;
      if (submited && row['Submited'] !== submited) return false;
      if (quickFilter) {
        const searchLower = quickFilter.toLowerCase();
        return Object.values(row).some(val => String(val).toLowerCase().includes(searchLower));
      }
      return true;
    });
  }, [rowData, assignedTo, status, submited, quickFilter]);

  useEffect(() => {
    fetchData().then(setRowData);
  }, []);

  return (
    <div className="=py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-bold text-gray-900">Approvals Board (AG Grid)</h2>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[120px]">
                <option value="">Assigned to</option>
                {assignedToOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[100px]">
                <option value="">Status</option>
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={submited} onChange={e => setSubmited(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[110px]">
                <option value="">Submited</option>
                {submitedOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <input type="text" placeholder="Search" value={quickFilter} onChange={e => setQuickFilter(e.target.value)} className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-40" />
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium flex items-center gap-2 shadow-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" /></svg>
                All filters
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium flex items-center gap-1 shadow-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-9m0 0-3.75 3.75M12 7.5l3.75 3.75" /></svg>
                Download
              </button>
            </div>
          </div>
        </div>
        <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
          <AgGridReact
            rowData={filteredRows}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            pagination={true}
            paginationPageSize={10}
            quickFilterText={quickFilter}
            suppressRowClickSelection={true}
            rowSelection="multiple"
          />
        </div>
      </div>
    </div>
  );
}
