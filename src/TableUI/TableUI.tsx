import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import TableRowUI from './TableRowUI';
import PaginationUI from './PaginationUI';
import TableFiltersUI from './TableFiltersUI';

const columnHelper = createColumnHelper();

// All possible columns
const allColumns = [
		columnHelper.accessor('From', {
			header: 'From',
			cell: info => <span className="text-gray-900">{info.getValue()}</span>,
		}),
		columnHelper.accessor('To', {
			header: 'To',
			cell: info => <span className="text-gray-900">{info.getValue()}</span>,
		}),
		columnHelper.accessor('Category', {
			header: 'Category',
			cell: info => <span className="text-gray-900">{info.getValue()}</span>,
		}),
		columnHelper.accessor('Resolved', {
			header: 'Resolved',
			cell: info => <span className="text-gray-900">{info.getValue()}</span>,
		}),
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

export default function TableUI({ config, data }) {
	// Filtering state
	const [assignedTo, setAssignedTo] = useState('');
	const [status, setStatus] = useState('');
	const [submited, setSubmited] = useState('');
	const [search, setSearch] = useState('');
	const [pageIndex, setPageIndex] = useState(0);
	const pageSize = 20;

	// Reset pageIndex when filters/search change
	useEffect(() => {
		setPageIndex(0);
	}, [assignedTo, status, submited, search]);

	// Map config column names to data keys
	const columnKeyMap = {
		'Name': 'first name',
		'Status': 'Status',
		'Sent': 'Submited',
		'Assigned to': 'assigned to',
		'Title': 'title',
		'Last Name': 'last name',
		'First Name': 'first name',
		'SIDIS Nr.': 'sidis',
		'Cell': 'cell',
		'Submited': 'Submited',
		'last interaction': 'last interaction',
		'From': 'From',
		'To': 'To',
		'Category': 'Category',
		'Resolved': 'Resolved',
		'Type': 'Type',
	};

	// Filter columns based on config
	const columns = useMemo(() => {
		if (!config?.columns) return allColumns;
		return allColumns.filter(col => {
			// For accessor columns
			if (col.accessorKey) {
				return config.columns.includes(Object.keys(columnKeyMap).find(key => columnKeyMap[key] === col.accessorKey) || col.accessorKey);
			}
			// For select column
			if (col.id === 'select') return false;
			// For others
			return config.columns.includes(col.header);
		});
	}, [config]);

	// Reset pageIndex when filters/search change
	useEffect(() => {
		setPageIndex(0);
	}, [assignedTo, status, submited, search]);

	// Extract unique filter values from data
	const assignedToOptions = useMemo(() => Array.from(new Set((data || []).map(r => r['assigned to']))), [data]);
	const statusOptions = useMemo(() => Array.from(new Set((data || []).map(r => r['Status']))), [data]);
	const submitedOptions = useMemo(() => Array.from(new Set((data || []).map(r => r['Submited']))), [data]);

	// Filter and search logic
	const filteredData = useMemo(() => {
		return (data || []).filter(row => {
			if (assignedTo && row['assigned to'] !== assignedTo) return false;
			if (status && row['Status'] !== status) return false;
			if (submited && row['Submited'] !== submited) return false;
			if (search) {
				const searchLower = search.toLowerCase();
				return Object.values(row).some(val => String(val).toLowerCase().includes(searchLower));
			}
			return true;
		});
	}, [data, assignedTo, status, submited, search]);

	// Pagination logic
	const pageCount = Math.ceil(filteredData.length / pageSize);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="py-10">
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
						<TableFiltersUI
							assignedTo={assignedTo}
							setAssignedTo={setAssignedTo}
							assignedToOptions={assignedToOptions}
							status={status}
							setStatus={setStatus}
							statusOptions={statusOptions}
							submited={submited}
							setSubmited={setSubmited}
							submitedOptions={submitedOptions}
							search={search}
							setSearch={setSearch}
							config={config}
						/>
					</div>
				</div>
				{/* Table */}
				<div className="overflow-x-auto rounded-b-2xl">
					<table className="min-w-full text-sm">
						{config?.headerVisibility !== false && (
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
						)}
						<tbody className="bg-white divide-y divide-gray-100">
							{table.getRowModel().rows
								.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
								.map(row => (
									<TableRowUI key={row.id} row={row} />
								))}
						</tbody>
					</table>
				</div>
				{/* Pagination */}
				<PaginationUI
					pageIndex={pageIndex}
					pageCount={pageCount}
					setPageIndex={setPageIndex}
					pageSize={pageSize}
					total={filteredData.length}
				/>
			</div>
		</div>
	);
}
