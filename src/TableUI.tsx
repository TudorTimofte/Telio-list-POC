import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
  {
    id: 'select',
    header: () => <input type="checkbox" className="accent-blue-600 w-4 h-4" />,
    cell: () => <input type="checkbox" className="accent-blue-600 w-4 h-4" />,
    size: 32,
  },
  columnHelper.accessor('title', {
    header: 'Title',
    cell: info => <span className="font-semibold text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('last name', {
    header: 'Last Name',
    cell: info => <span className="text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('first name', {
    header: 'First Name',
    cell: info => <span className="text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('assigned to', {
    header: 'Assigned to',
    cell: info => (
      <span className="flex items-center gap-1 text-gray-700">
        {info.getValue()} <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </span>
    ),
  }),
  columnHelper.accessor('sidis', {
    header: 'SIDIS Nr.',
    cell: info => <span className="text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('cell', {
    header: 'Cell',
    cell: info => <span className="text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('Status', {
    header: 'Status',
    cell: info => {
      const value = info.getValue();
      let color = 'bg-gray-200 text-gray-700';
      if (value === 'Pending') color = 'bg-gray-100 text-gray-700';
      if (value === 'Approved') color = 'bg-green-100 text-green-800';
      if (value === 'In Progress') color = 'bg-blue-100 text-blue-800';
      if (value === 'Unassigned') color = 'bg-gray-100 text-gray-500';
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{value}</span>
      );
    },
  }),
  columnHelper.accessor('Submited', {
    header: 'Submited',
    cell: info => <span className="text-xs text-gray-500">{info.getValue()}</span>,
  }),
  columnHelper.accessor('last interaction', {
    header: 'Last interaction',
    cell: info => <span className="text-xs text-gray-500">{info.getValue()}</span>,
  }),
];

function fetchMessages() {
  return fetch('http://localhost:3001/api/messages').then(res => res.json());
}

export default function TableUI() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  });

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading data</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Header Bar with Tabs and Controls */}
        <div className="flex flex-col gap-4 px-8 pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-bold text-gray-900">Approvals Board</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 shadow-none">Requests <span className="inline-block bg-blue-600 text-white rounded-full px-2 text-xs">4</span></button>
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 shadow-none">Messages <span className="inline-block bg-gray-400 text-white rounded-full px-2 text-xs">4</span></button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[120px]">
                  Assigned to
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[100px]">
                  Status
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[110px]">
                  Submited
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <input type="text" placeholder="Search" className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-40" />
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
        {/* Table */}
        <div className="overflow-x-auto rounded-b-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 bg-gray-50"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-3 py-2 whitespace-nowrap align-middle text-[15px] text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
