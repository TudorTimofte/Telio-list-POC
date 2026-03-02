export type RowValue = string | number | boolean | null | undefined | Date;
export type RowData = Record<string, RowValue>;

export type SubmittedBucket = "Today" | "Yesterday" | "Older";
export type FiltersState = Record<string, string[]>;
export interface FilterSelectionItem {
  fieldName: string;
  values: string[];
}

export interface FilterField {
  Name: string;
  Type?: string;
  Options?: string[];
}

export interface FilterMetadata {
  Fields?: FilterField[];
}

export interface ColumnConfig {
  ColumnName: string;
  DataType?: string;
  HeaderFilterName?: string | null;
}

export interface FiltersConfig {
  FilterMetadata?: FilterMetadata;
  FilterModel?: Record<string, unknown>;
  Columns?: ColumnConfig[];
  FilterAliases?: Record<string, string>;
}

export interface TableAgGridFiltersProps {
  config: FiltersConfig;
  rows: RowData[];
  onFilteredRowsChange: (rows: RowData[]) => void;
  onFilterInteraction: () => void;
  onFiltersChange?: (filters: FilterSelectionItem[]) => void;
}

export interface FilterMetadata {
  Fields?: FilterField[];
}

export interface ColumnConfig {
  ColumnName: string;
  DataType?: string;
  HeaderFilterName?: string | null;
}

export interface FiltersConfig {
  FilterMetadata?: FilterMetadata;
  FilterModel?: Record<string, unknown>;
  Columns?: ColumnConfig[];
  FilterAliases?: Record<string, string>;
  FilterPresetOptions?: Record<string, string[]>;
}
