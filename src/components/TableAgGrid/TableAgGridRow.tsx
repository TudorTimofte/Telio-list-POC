import React from 'react';

export default function TableAgGridRow({ rowData, columnDefs }) {
	// Helper to format date string as MM/DD/YYYY
	const formatDate = (dateStr) => {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		const yyyy = d.getFullYear();
		return `${mm}/${dd}/${yyyy}`;
	};

	return (
		<tr>
			{columnDefs.map(col => (
				<td key={col.field} className="px-3 py-1 whitespace-nowrap align-middle text-[15px] text-gray-900">
					{col.field === 'LastLogin' ? formatDate(rowData[col.field]) : rowData[col.field]}
				</td>
			))}
		</tr>
	);
}
