import { useMemo, useState, useEffect, useCallback } from "react";
import type {
  FilterSelectionItem,
  FiltersState,
  TableAgGridFiltersProps,
} from "./FiltersMenu.types";
import SearchInput from "./SearchInput";
import FilterDropdown from "./FilterDropdown";
import { useDateBuckets } from "../../hooks/useDateBuckets";
import './FiltersMenu.css';


const DEFAULT_FIELD_ALIASES: Record<string, string> = {
  handledby: "AssignedTo",
  status: "Status",
  name: "FirstName",
};

function normalize(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function toLabel(value: string): string {
  const spaced = value.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function createEmptyFilters(fields: string[]): FiltersState {
  return fields.reduce<FiltersState>((accumulator, field) => {
    accumulator[field] = [];
    return accumulator;
  }, {});
}

function resolveAliasField(
  fieldName: string,
  aliases?: Record<string, string>,
): string | null {
  const normalized = normalize(fieldName);
  const customAliases = aliases || {};

  const byNormalizedKey = customAliases[normalized];
  if (byNormalizedKey) return byNormalizedKey;

  const byRawKey = customAliases[fieldName];
  if (byRawKey) return byRawKey;

  return DEFAULT_FIELD_ALIASES[normalized] || null;
}

function isDateTimeField(dataType?: string): boolean {
  return normalize(dataType || "") === "datetime";
}

function isSubmittedField(fieldName: string): boolean {
  return normalize(fieldName) === "submitted";
}

// Remove usesSubmittedBuckets, now Submitted filter uses actual dates

function isPresentValue(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function toFilterSelectionItems(filters: FiltersState): FilterSelectionItem[] {
  return Object.entries(filters).map(([fieldName, values]) => ({
    fieldName,
    values,
  }));
}

export default function FiltersMenu({
  config,
  rows,
  onFilteredRowsChange,
  onFilterInteraction,
  onFiltersChange,
}: TableAgGridFiltersProps) {
  const { getBucket } = useDateBuckets();
  const metadataFields = useMemo(
    () => config.FilterMetadata?.Fields ?? [],
    [config.FilterMetadata?.Fields],
  );
  const columns = useMemo(() => config.Columns ?? [], [config.Columns]);

  const filterFields = useMemo(
    () => metadataFields.map((field) => field.Name),
    [metadataFields],
  );

  const [filters, setFilters] = useState<FiltersState>(() =>
    createEmptyFilters(filterFields),
  );
  const [quickFilter, setQuickFilter] = useState("");

  const fieldDefinitions = useMemo(() => {
    const rowKeys = rows.length > 0 ? Object.keys(rows[0]) : [];

    return filterFields.map((fieldName) => {
      const metadataField = metadataFields.find(
        (field) => field.Name === fieldName,
      );

      const matchingColumn =
        columns.find(
          (column) => normalize(column.ColumnName) === normalize(fieldName),
        ) ||
        columns.find(
          (column) =>
            normalize(column.HeaderFilterName || "") === normalize(fieldName),
        );

      const aliasField = resolveAliasField(fieldName, config.FilterAliases);
      const candidateKeys = [
        aliasField,
        matchingColumn?.HeaderFilterName || undefined,
        matchingColumn?.ColumnName,
        fieldName,
      ].filter((value): value is string => Boolean(value));

      let sourceKey = fieldName;
      for (const candidate of candidateKeys) {
        const normalizedCandidate = normalize(candidate);
        const matchedKey = rowKeys.find(
          (rowKey) => normalize(rowKey) === normalizedCandidate,
        );
        if (matchedKey) {
          sourceKey = matchedKey;
          break;
        }
      }

      return {
        fieldName,
        label: toLabel(fieldName),
        sourceKey,
        dataType: metadataField?.Type || matchingColumn?.DataType,
      };
    });
  }, [
    filterFields,
    rows,
    metadataFields,
    columns,
    config.FilterAliases,
  ]);

  const filterOptionsByField = useMemo(() => {
    const options: Record<string, string[]> = {};

    fieldDefinitions.forEach((definition) => {
      const presetOptions =
        config.FilterPresetOptions?.[definition.fieldName] ||
        config.FilterPresetOptions?.[normalize(definition.fieldName)];

      if (Array.isArray(presetOptions) && presetOptions.length > 0) {
        options[definition.fieldName] = presetOptions;
        return;
      }

      // For Submitted filter, use all LastLogin values from initialRows
      if (normalize(definition.fieldName) === "submitted") {
        const uniqueDates = Array.from(
          new Set(
            rows
              .map((row) => row['LastLogin'])
              .filter(isPresentValue)
          )
        );
        options[definition.fieldName] = uniqueDates;
        return;
      }

      // For other date fields, use formatted values
      if (isDateTimeField(definition.dataType)) {
        const uniqueDates = Array.from(
          new Set(
            rows
              .map((row) => getBucket(row[definition.sourceKey]))
              .filter((date) => date)
          )
        );
        options[definition.fieldName] = uniqueDates;
        return;
      }

      const uniqueValues = Array.from(
        new Set(
          rows
            .map((row) => row[definition.sourceKey])
            .filter(isPresentValue)
            .map((value) => String(value)),
        ),
      );
      options[definition.fieldName] = uniqueValues;
    });

    return options;
  }, [config.FilterPresetOptions, fieldDefinitions, rows]);

  const filteredRows = useMemo(() => {
    const search = quickFilter.trim().toLowerCase();

    return rows.filter((row) => {
      const hasFieldMatches = fieldDefinitions.every((definition) => {
        const selectedValues = filters[definition.fieldName] || [];
        if (selectedValues.length === 0) return true;

        // For Submitted/date fields, match on formatted date
        if (normalize(definition.fieldName) === "submitted" || isDateTimeField(definition.dataType)) {
          const date = getBucket(row[definition.sourceKey]);
          return selectedValues.includes(date);
        }

        return selectedValues.includes(String(row[definition.sourceKey] ?? ""));
      });

      if (!hasFieldMatches) return false;
      if (!search) return true;

      return Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search),
      );
    });
  }, [quickFilter, rows, fieldDefinitions, filters, getBucket]);

  useEffect(() => {
    onFilteredRowsChange(filteredRows);
  }, [filteredRows, onFilteredRowsChange]);

  const onFilterDropdownChange = useCallback(
    (values: string[], fieldName: string) => {
      onFilterInteraction();

      setFilters((previous) => {
        const updatedFilters = {
          ...previous,
          [fieldName]: values,
        };

        onFiltersChange?.(toFilterSelectionItems(updatedFilters));

        return updatedFilters;
      });
    },
    [onFilterInteraction, onFiltersChange],
  );

  const handleQuickFilterChange = useCallback(
    (value: string) => {
      onFilterInteraction();
      setQuickFilter(value);
    },
    [onFilterInteraction],
  );

  return (
    <div className=" toolbar">
      <div className="toolbarLeft flex items-center gap-2">

        {fieldDefinitions.map((definition) => {
          const options = filterOptionsByField[definition.fieldName] ?? [];
          const selectedValues = filters[definition.fieldName] ?? [];

          return (
            <FilterDropdown
              key={definition.fieldName}
              id={definition.fieldName}
              label={definition.label}
              options={options}
              selectedValues={selectedValues}
              onChange={(values) => onFilterDropdownChange(values, definition.fieldName)}
            />
          );
        })}
      </div>

      <div className="toolbarRight">
        <SearchInput
          value={quickFilter}
          onChange={handleQuickFilterChange}
          placeholder="Search"
        />

      </div>
    </div>
  );
}
