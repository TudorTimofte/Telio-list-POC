import React from 'react';

export default function TableAgGridPagination({ pageIndex, pageCount, setPageIndex, pageSize, setPageSize, pageSizeOptions = [10, 20, 50, 100], total }) {
	// Pagination logic: show current, next 4, then ellipsis and last page
	const pageButtons = [];
	if (pageCount > 0) {
		// Always show first page if not on it
		if (pageIndex > 0) {
			pageButtons.push(
				<button key={0} className={`px-2 py-1 rounded border bg-white border-gray-300`} onClick={() => setPageIndex(0)}>
					1
				</button>
			);
			if (pageIndex > 1) {
				pageButtons.push(<span key="start-ellipsis" className="px-2">...</span>);
			}
		}
		// Show current and next 4 pages
		for (let i = pageIndex; i < Math.min(pageIndex + 3, pageCount); i++) {
			pageButtons.push(
				<button
					key={i}
					className={`px-2 py-1 rounded border ${i === pageIndex ? 'bg-gray-200 border-gray-400 font-bold' : 'bg-white border-gray-300'}`}
					onClick={() => setPageIndex(i)}
				>
					{i + 1}
				</button>
			);
		}
		// Ellipsis and last page
		if (pageIndex + 3 < pageCount) {
			pageButtons.push(<span key="end-ellipsis" className="px-2">...</span>);
			pageButtons.push(
				<button key={pageCount - 1} className={`px-2 py-1 rounded border bg-white border-gray-300`} onClick={() => setPageIndex(pageCount - 1)}>
					{pageCount}
				</button>
			);
		}
	}

	return (
		<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white rounded-b-2xl mt-2">
			<div className="flex items-center gap-2 text-sm text-gray-600">
				<select
					className="border rounded px-2 py-1 text-sm"
					value={pageSize}
					onChange={e => setPageSize(Number(e.target.value))}
				>
					{pageSizeOptions.map(opt => (
						<option key={opt} value={opt}>{opt}</option>
					))}
				</select>
				out of {total}
			</div>
			<div className="flex items-center gap-1">
				<button
					className="px-2 py-1 rounded border border-gray-300 bg-white disabled:opacity-50"
					onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
					disabled={pageIndex === 0}
				>
					{'<'}
				</button>
				{pageButtons}
				<button
					className="px-2 py-1 rounded border border-gray-300 bg-white disabled:opacity-50"
					onClick={() => setPageIndex(Math.min(pageCount - 1, pageIndex + 1))}
					disabled={pageIndex === pageCount - 1 || pageCount === 0}
				>
					{'>'}
				</button>
			</div>
		</div>
	);
}
