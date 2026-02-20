import { AgGridReact } from 'ag-grid-react';

import React, { useState, useEffect, useMemo } from 'react';
import TableAgGridPagination from './TableAgGridPagination';
import TableAgGridFilters from './TableAgGridFilters';
import TableAgGridRow from './TableAgGridRow';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface TableAgGridProps {
	config: any;
	data: any[];
}

export default function TableAgGrid({ config, data }: TableAgGridProps) {
	const [rowData, setRowData] = useState<any[]>([]);
	const [quickFilter, setQuickFilter] = useState('');
	const [assignedTo, setAssignedTo] = useState('');
	const [status, setStatus] = useState('');
	const [submited, setSubmited] = useState('');
	const [pageIndex, setPageIndex] = useState(config?.paging?.pageIndex || 0);
	const pageSize = config?.paging?.pageSize || 20;

	// Map config column names to data keys (adjust as needed)
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
		'Last interaction': 'last interaction',
		'From': 'From',
		'To': 'To',
		'Category': 'Category',
		'Resolved': 'Resolved',
		'Type': 'Type',
	};

	const columnDefs = useMemo(() => {
		if (!config?.columns) return [];
		return config.columns.map((col: string) => ({
			headerName: col,
			field: columnKeyMap[col as keyof typeof columnKeyMap] || col,
			filter: 'agTextColumnFilter',
			flex: 1,
		}));
	}, [config]);

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

	// Pagination logic
	const pageCount = Math.ceil(filteredRows.length / pageSize);
	const pagedRows = filteredRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

	// Extract unique filter values from data
	const assignedToOptions = useMemo(() => Array.from(new Set(rowData.map(r => r['assigned to']))), [rowData]);
	const statusOptions = useMemo(() => Array.from(new Set(rowData.map(r => r['Status']))), [rowData]);
	const submitedOptions = useMemo(() => Array.from(new Set(rowData.map(r => r['Submited']))), [rowData]);

	useEffect(() => {
		setRowData(Array.isArray(data) ? data : []);
	}, [data]);

	return (
			<div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8" style={{ width: '50%' }}>
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex items-center gap-8">
						<h2 className="text-2xl font-bold text-gray-900">{config.headerText || 'Approvals Board (AG Grid)'}</h2>
					</div>
					<div className="flex flex-wrap gap-2 items-center justify-between">
						<TableAgGridFilters
							assignedTo={assignedTo}
							setAssignedTo={setAssignedTo}
							assignedToOptions={assignedToOptions}
							status={status}
							setStatus={setStatus}
							statusOptions={statusOptions}
							submited={submited}
							setSubmited={setSubmited}
							submitedOptions={submitedOptions}
							quickFilter={quickFilter}
							setQuickFilter={setQuickFilter}
							config={config}
						/>
					</div>
				</div>
				<div className="ag-theme-quartz" style={{ height: 572, width: '100%' }}>
					<table className="min-w-full text-sm border border-gray-200 rounded-b-2xl">
						<tbody className="bg-white divide-y divide-gray-100">
							{pagedRows.map((rowData, idx) => (
								<TableAgGridRow
									key={idx}
									rowData={rowData}
									columnDefs={columnDefs.filter(col => config.columns.includes(col.headerName))}
									rowClassName="py-1"
								/>
							))}
						</tbody>
					</table>
				</div>
				{/* Pagination Bar */}
				<TableAgGridPagination
					pageIndex={pageIndex}
					pageCount={pageCount}
					setPageIndex={setPageIndex}
					pageSize={pageSize}
					total={filteredRows.length}
				/>
			</div>
	);
}
