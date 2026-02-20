import React from 'react';

export default function PaginationUI({ pageIndex, pageCount, setPageIndex, pageSize, total }) {
	return (
		<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white rounded-b-2xl">
			<div className="flex items-center gap-2 text-sm text-gray-600">
				Showing
				<select
					className="border rounded px-2 py-1 text-sm"
					value={pageSize}
					disabled
				>
					<option value={pageSize}>{pageSize}</option>
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
				{Array.from({ length: pageCount }, (_, i) => (
					<button
						key={i}
						className={`px-2 py-1 rounded border ${i === pageIndex ? 'bg-gray-200 border-gray-400 font-bold' : 'bg-white border-gray-300'}`}
						onClick={() => setPageIndex(i)}
					>
						{i + 1}
					</button>
				))}
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
