import React from 'react';

export default function TableAgGridFilters({
	assignedTo, setAssignedTo, assignedToOptions,
	status, setStatus, statusOptions,
	submited, setSubmited, submitedOptions,
	quickFilter, setQuickFilter,
	config
}) {
	return (
		<div className="flex gap-2">
			{config?.filters?.includes('Assigned to') && (
				<select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[120px]">
					<option value="">Assigned to</option>
					{assignedToOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			)}
			{config?.filters?.includes('Status') && (
				<select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[100px]">
					<option value="">Status</option>
					{statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			)}
			{config?.filters?.includes('Sent') || config?.filters?.includes('Submited') ? (
				<select value={submited} onChange={e => setSubmited(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[110px]">
					<option value="">Submited</option>
					{submitedOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
				</select>
			) : null}
			<div className="relative">
				<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
				<input type="text" placeholder="Search" value={quickFilter} onChange={e => setQuickFilter(e.target.value)} className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-40" />
			</div>
		</div>
	);
}
