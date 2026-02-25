import type { DynamicTableConfig, FilterDefinition, UserData } from '../types'
import { filterBySubmittedCategory, getUniqueFieldValues } from './dataUtils'

const formatHeader = (value: string): string => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim()
}

const toCamelCase = (value: string): string => {
  const normalized = value.replace(/[-_\s]+(.)?/g, (_, char: string) => (char ? char.toUpperCase() : ''))
  return normalized.charAt(0).toLowerCase() + normalized.slice(1)
}

const FIELD_ALIAS: Record<string, keyof UserData> = {
  HandledBy: 'assignedTo',
}

const resolveUserField = (configFieldName: string): keyof UserData | null => {
  if (configFieldName in FIELD_ALIAS) {
    return FIELD_ALIAS[configFieldName]
  }

  const candidate = toCamelCase(configFieldName) as keyof UserData
  const allowedFields: Array<keyof UserData> = [
    'id',
    'firstName',
    'lastName',
    'assignedTo',
    'sidis',
    'cell',
    'status',
    'submitted',
    'lastLogin',
  ]

  return allowedFields.includes(candidate) ? candidate : null
}

export const getFiltersFromConfig = (config: DynamicTableConfig): FilterDefinition<UserData>[] => {
  return config.FilterMetadata.Fields.map((fieldDef) => {
    const field = resolveUserField(fieldDef.Name)
    if (!field) {
      return null
    }

    const isSubmittedFilter = field === 'submitted'
    const hasMetadataOptions = fieldDef.Options.length > 0

    return {
      id: field,
      label: formatHeader(fieldDef.Name),
      field,
      extractOptions: (data: UserData[]) => {
        if (hasMetadataOptions) {
          return fieldDef.Options.map((option) => option.Label)
        }
        return getUniqueFieldValues(data, field)
      },
      ...(isSubmittedFilter
        ? {
            customFilter: (data: UserData[], selectedValues: string[]) =>
              filterBySubmittedCategory(data, selectedValues),
          }
        : {}),
    }
  }).filter((filter): filter is FilterDefinition<UserData> => filter !== null)
}
