import React from 'react';

export default function TableAgGridRow({ rowData, columnDefs }) {
	return (
		<tr>
			{columnDefs.map(col => (
				<td key={col.field} className="px-3 py-1 whitespace-nowrap align-middle text-[15px] text-gray-900">
					{rowData[col.field]}
				</td>
			))}
		</tr>
	);
}
