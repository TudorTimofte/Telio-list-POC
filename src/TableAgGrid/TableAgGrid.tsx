
import React, { useState, useEffect, useMemo } from 'react';
import TableAgGridRow from './TableAgGridRow';
import TableAgGridPagination from './TableAgGridPagination';

interface TableAgGridProps {
	config: any;
	data: any[];
}

export default function TableAgGrid({ config, data }: TableAgGridProps) {
	const [rowData, setRowData] = useState<any[]>([]);
	const [pageIndex, setPageIndex] = useState((config?.Paging?.CurrentPage || 1) - 1);
	const [pageSize, setPageSize] = useState(config?.Paging?.PageSize || 20);
	const columnDefs = useMemo(() => {
		if (!config?.Columns) return [];
		return config.Columns.filter((col: any) => !col.Hidden).map((col: any) => ({
			headerName: col.ColumnName,
			field: col.ColumnName,
			flex: 1,
			sortable: col.Sortable,
		}));
	}, [config]);

	// No filtering logic, just return all rows
	const filteredRows = useMemo(() => rowData, [rowData]);

	// Pagination logic
	const pageCount = Math.ceil(filteredRows.length / pageSize);
	const pagedRows = filteredRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

	// Extract unique filter values from data
	useEffect(() => {
		if (!Array.isArray(data) || !config?.Columns) {
			setRowData([]);
			return;
		}
		// Helper to normalize keys: remove non-alphanumeric and lowercase
		const normalize = (str: string) => str.replace(/[^a-z0-9]/gi, '').toLowerCase();
		const columnFields = config.Columns.map((col: any) => col.ColumnName);
		const mapped = data.map((row: any) => {
			const mappedRow: any = {};
			columnFields.forEach((field: string) => {
				const normField = normalize(field);
				// Find a key in row that matches normalized field
				const dataKey = Object.keys(row).find(
					k => normalize(k) === normField
				);
				mappedRow[field] = dataKey ? row[dataKey] : '';
			});
			return mappedRow;
		});
		setRowData(mapped);
	}, [data, config]);

	return (
			<div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8" style={{ width: '50%' }}>
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex items-center gap-8">
						  <h2 className="text-2xl font-bold text-gray-900">{config?.headerText || 'Approvals Board (AG Grid)'}</h2>
					</div>
					<div className="flex flex-wrap gap-2 items-center justify-between">
							{/* Filters UI is commented out as per instructions */}
							{/* <TableAgGridFilters
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
							/> */}
					</div>
				</div>
				<div className="ag-theme-quartz" style={{ height: 572, width: '100%' }}>
					<table className="min-w-full text-sm border border-gray-200 rounded-b-2xl">
						<tbody className="bg-white divide-y divide-gray-100">
							{pagedRows.map((rowData, idx) => (
								<TableAgGridRow
									key={idx}
									rowData={rowData}
									columnDefs={columnDefs}
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
