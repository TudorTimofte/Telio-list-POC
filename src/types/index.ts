import type { ReactNode } from 'react'

// Table data types
export interface TableRow {
  id: number | string
  [key: string]: unknown
}

// Table column configuration
export interface TableColumn<T extends TableRow> {
  key: Extract<keyof T, string | number>
  header?: string
  render?: (value: unknown, row: T) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

// Filter dropdown component props
export interface FilterDropdownProps {
  label: string
  options: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}

// Filter configuration for FilterBar
export interface FilterConfig {
  id: string
  label: string
  options: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}

// Filter definition for dynamic filtering
export interface FilterDefinition<T extends TableRow> {
  id: string
  label: string
  field: keyof T
  extractOptions: (data: T[]) => string[]
  transformValue?: (value: unknown) => string
  customFilter?: (data: T[], selectedValues: string[]) => T[]
}

// User data type (specific implementation of TableRow)
export interface UserData extends TableRow {
  Title: string
  LastName: string
  FirstName: string
  AssignedTo: string
  Sidis: string
  Cell: string
  Status: string
  Submitted: string
  LastLogin: string
}
export interface ConfigOption {
  Value: string
  Label: string
}

export interface ConfigField {
  Type: string
  Name: string
  IsDisplayed: boolean
  LabelResourceKey: string | null
  Options: ConfigOption[]
}

export interface TableColumnConfig {
  ColumnName: string
  DataType: string
  Hidden: boolean
  Sortable: boolean
  HeaderFilterName: string | null
  TitleTranslationKey: string
  DescriptionTranslationKey: string
}

export interface DynamicTableConfig {
  FilterModel: Record<string, string | null>
  FilterMetadata: {
    TitleResourceKey: string | null
    Name: string
    Fields: ConfigField[]
  }
  Columns: TableColumnConfig[]
  Paging: {
    CurrentPage: number
    PageSize: number
    PageSizeOptions: number[]
  }
}
