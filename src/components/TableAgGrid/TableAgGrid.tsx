
import React, { useState, useEffect, useMemo } from 'react';
// import TableAgGridRow from './TableAgGridRow';
import TableAgGridPagination from './TableAgGridPagination';
import TableAgGridFilters from './TableAgGridFilters';
import type { FilterConfig } from '../../types';
import { getFiltersFromConfig } from '../../utils/configAdapter';
import { useTableFilters } from '../../hooks/useTableFilters';

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
  const activeConfig = config
	 const filterDefinitions = useMemo(() => getFiltersFromConfig(activeConfig), [activeConfig])

  const { filteredData, filterStates, setFilterState } = useTableFilters(
    data,
    filterDefinitions
  )

	  // Generate filter configurations dynamically
  const filterConfigs: FilterConfig[] = useMemo<FilterConfig[]>(() => {
    return filterDefinitions.map((filterDef) => ({
      id: filterDef.id,
      label: filterDef.label,
      options: filterDef.extractOptions(data),
      selectedValues: filterStates[filterDef.id] || [],
      onChange: (values: string[]) => setFilterState(filterDef.id, values),
    }))
  }, [data, filterDefinitions, filterStates, setFilterState])

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

		// Calculate responsive width based on column count
		const minWidth = 400;
		const colWidth = 160;
		const containerWidth = columnDefs.length > 0 ? Math.max(columnDefs.length * colWidth, minWidth) : minWidth;


		return (
			<div
				className="mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
				style={{ width: containerWidth }}
			>
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex items-center gap-8">
						  <h2 className="text-2xl font-bold text-gray-900">{config?.headerText || 'Approvals Board (AG Grid)'}</h2>
					</div>
					<div className="flex flex-wrap gap-2 table-filters-white">
            {/* Filters UI is commented out as per instructions */}
              <TableAgGridFilters filters={filterConfigs} />
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
				<div className="ag-theme-quartz" style={{ maxHeight: 800, width: '100%', overflowY: 'auto' }}>
					<table
						className="w-full text-sm border border-gray-200 rounded-b-2xl overflow-hidden"
						style={{ tableLayout: 'auto' }}
					>
						<thead>
							<tr className="bg-gray-100">
								{columnDefs.map((col, idx) => (
									<th
										key={col.field}
										className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap"
										style={{ minWidth: 80 }}
									>
										{col.headerName}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{pagedRows.map((rowData, idx) => (
								<tr
									key={idx}
									className={
										idx % 2 === 0
											? 'bg-white hover:bg-gray-50 transition-colors'
											: 'bg-gray-50 hover:bg-gray-100 transition-colors'
									}
								>
									{columnDefs.map(col => (
										<td
											key={col.field}
											className="px-3 py-2 align-middle text-[15px] text-gray-900 border-b border-gray-100 text-left"
										>
											{rowData[col.field]}
										</td>
									))}
								</tr>
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
					setPageSize={setPageSize}
					pageSizeOptions={config?.Paging?.PageSizeOptions || [10, 20, 50, 100]}
					total={filteredRows.length}
				/>
			</div>
	);
}
