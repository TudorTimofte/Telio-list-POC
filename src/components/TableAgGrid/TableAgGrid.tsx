import React, { useState, useEffect, useMemo } from "react";
// import TableAgGridRow from "./TableAgGridRow";
import TableAgGridPagination from "./TableAgGridPagination";
import FiltersMenu from "../FiltersMenu/FiltersMenu";
import type { FilterSelectionItem } from "../FiltersMenu/FiltersMenu.types";

interface TableAgGridProps {
  config: any;
  data: any[];
  onFiltersChange?: (filters: FilterSelectionItem[]) => void;
}

export default function TableAgGrid({
  config,
  data,
  onFiltersChange,
}: TableAgGridProps) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(
    (config?.Paging?.CurrentPage || 1) - 1,
  );
  const [pageSize, setPageSize] = useState(config?.Paging?.PageSize || 20);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const columnDefs = useMemo(() => {
    if (!config?.Columns) return [];
    return config.Columns.filter((col: any) => !col.Hidden).map((col: any) => ({
      headerName: col.ColumnName,
      field: col.ColumnName,
      flex: 1,
      sortable: col.Sortable,
    }));
  }, [config]);

  // const filteredRows = useMemo(() => rowData, [rowData]);
  const [filteredRows, setFilteredRows] = useState<RowData[]>(rowData);

  // const filteredRows = useMemo(() => {
  //   if (!sortCol) return rowData;
  //   const sorted = [...rowData].sort((a, b) => {
  //     const aVal = a[sortCol] ?? '';
  //     const bVal = b[sortCol] ?? '';
  //     if (aVal === bVal) return 0;
  //     if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
  //     return aVal < bVal ? 1 : -1;
  //   });
  //   return sorted;
  // }, [rowData, sortCol, sortDir]);


  // Pagination logic
  const pageCount = Math.ceil(filteredRows.length / pageSize);
  const pagedRows = filteredRows.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize,
  );

  // Extract unique filter values from data
  useEffect(() => {
    if (!Array.isArray(data) || !config?.Columns) {
      setRowData([]);
      return;
    }
    // Helper to normalize keys: remove non-alphanumeric and lowercase
    const normalize = (str: string) =>
      str.replace(/[^a-z0-9]/gi, "").toLowerCase();
    const columnFields = config.Columns.map((col: any) => col.ColumnName);
    const mapped = data.map((row: any) => {
      const mappedRow: any = {};
      columnFields.forEach((field: string) => {
        const normField = normalize(field);
        // Find a key in row that matches normalized field
        const dataKey = Object.keys(row).find(
          (k) => normalize(k) === normField,
        );
        mappedRow[field] = dataKey ? row[dataKey] : "";
      });
      return mappedRow;
    });
    setRowData(mapped);
  }, [data, config]);

  // Calculate responsive width based on column count
  const minWidth = 400;
  const colWidth = 160;
  const containerWidth =
    columnDefs.length > 0
      ? Math.max(columnDefs.length * colWidth, minWidth)
      : minWidth;

  	// Sort arrow rendering helper
	const renderSortArrows = (col: any) => {
		if (!col.sortable) return null;
		return (
			<span className="ml-1 select-none text-xs align-middle">
				<span
					style={{
						color: sortCol === col.field && sortDir === 'asc' ? '#2563eb' : '#cbd5e1',
						cursor: 'pointer',
						display: 'inline-block',
						lineHeight: 1,
					}}
					onClick={e => {
						e.stopPropagation();
						if (sortCol === col.field && sortDir === 'asc') setSortDir('desc');
						else {
							setSortCol(col.field);
							setSortDir('asc');
						}
					}}
				>▲</span>
				<span
					style={{
						color: sortCol === col.field && sortDir === 'desc' ? '#2563eb' : '#cbd5e1',
						cursor: 'pointer',
						display: 'inline-block',
						lineHeight: 1,
					}}
					onClick={e => {
						e.stopPropagation();
						setSortCol(col.field);
						setSortDir('desc');
					}}
				>▼</span>
			</span>
		);
	};

  return (
    <div
      className="mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
      style={{ width: containerWidth }}
    >
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {config?.headerText || "Approvals Board (AG Grid)"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          {/* Filters UI is commented out as per instructions */}
          <FiltersMenu
            key={JSON.stringify(
              config?.FilterMetadata ?? config?.FilterModel ?? {},
            )}
            config={config as unknown as Record<string, unknown>}
            rows={rowData}
            onFilteredRowsChange={setFilteredRows}
            onFilterInteraction={() => setPageIndex(0)}
            onFiltersChange={onFiltersChange}
          />
        </div>
      </div>
      <div
        className="ag-theme-quartz"
        style={{ maxHeight: 800, width: "100%", overflowY: "auto" }}
      >
        <table
          className="w-full text-sm border border-gray-200 rounded-b-2xl overflow-hidden"
          style={{ tableLayout: "auto" }}
        >
          <thead>
            <tr className="bg-gray-100">
              {columnDefs.map((col, idx) => (
								<th
									key={col.field}
									className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap cursor-pointer select-none"
									style={{ minWidth: 80 }}
									onClick={() => {
										if (!col.sortable) return;
										if (sortCol === col.field) {
											setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
										} else {
											setSortCol(col.field);
											setSortDir('asc');
										}
									}}
								>
									{col.headerName}
									{renderSortArrows(col)}
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
                    ? "bg-white hover:bg-gray-50 transition-colors"
                    : "bg-gray-50 hover:bg-gray-100 transition-colors"
                }
              >
                {columnDefs.map((col) => (
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
