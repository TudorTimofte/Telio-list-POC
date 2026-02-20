import React from 'react';
import { flexRender } from '@tanstack/react-table';

export default function TableRowUI({ row }) {
	return (
		<tr className={row.index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
			{row.getVisibleCells().map(cell => (
				<td
					key={cell.id}
					className="px-3 py-2 whitespace-nowrap align-middle text-[15px] text-gray-900"
				>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
			))}
		</tr>
	);
}
// ...existing code from src/TableRowUI.tsx...
