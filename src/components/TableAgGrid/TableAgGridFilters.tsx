import React, { type JSX } from 'react';
import type { FilterConfig } from '../../types';
import FilterDropdown from '../FilterDropdown/FilterDropdown';

export interface FilterBarProps {
  filters: FilterConfig[]
  className?: string
}

export default function TableAgGridFilters({ filters, className = '' }: FilterBarProps): JSX.Element {
	return (
		<div className={`filters-container ${className}`}>
      {filters.map((filter) => (
        <FilterDropdown
          key={filter.id}
          label={filter.label}
          options={filter.options}
          selectedValues={filter.selectedValues}
          onChange={filter.onChange}
        />
      ))}
    </div>
	);
}
