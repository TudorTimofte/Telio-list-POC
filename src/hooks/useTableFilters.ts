import { useState, useMemo, useCallback } from 'react'
import type { TableRow } from '../types'
import type { FilterDefinition } from '../types'
import { filterByField } from '../utils/dataUtils'

export interface UseTableFiltersReturn<T extends TableRow> {
  filteredData: T[]
  filterStates: Record<string, string[]>
  setFilterState: (filterId: string, values: string[]) => void
  clearFilters: () => void
}

/**
 * Generic custom hook for managing table filters dynamically
 */
export const useTableFilters = <T extends TableRow>(
  data: T[],
  filterDefinitions: FilterDefinition<T>[]
): UseTableFiltersReturn<T> => {
  // Initialize filter states dynamically
  const initialFilterStates = useMemo<Record<string, string[]>>(() => {
    return filterDefinitions.reduce((acc, filter) => {
      acc[filter.id] = []
      return acc
    }, {} as Record<string, string[]>)
  }, [filterDefinitions])

  const [filterStates, setFilterStates] = useState<Record<string, string[]>>(initialFilterStates)

  const setFilterState = useCallback((filterId: string, values: string[]): void => {
    setFilterStates((prev) => ({
      ...prev,
      [filterId]: values,
    }))
  }, [])

  const filteredData = useMemo<T[]>(() => {
    let filtered = data

    filterDefinitions.forEach((filterDef) => {
      const selectedValues = filterStates[filterDef.id] || []

      if (selectedValues.length === 0) {
        return // Skip if no values selected for this filter
      }

      // Use custom filter if provided
      if (filterDef.customFilter) {
        filtered = filterDef.customFilter(filtered, selectedValues)
        return
      }

      // Use generic field filter
      filtered = filterByField(
        filtered,
        filterDef.field,
        selectedValues,
        filterDef.transformValue
      )
    })

    return filtered
  }, [data, filterStates, filterDefinitions])

  const clearFilters = useCallback((): void => {
    setFilterStates(initialFilterStates)
  }, [initialFilterStates])

  return {
    filteredData,
    filterStates,
    setFilterState,
    clearFilters,
  }
}
