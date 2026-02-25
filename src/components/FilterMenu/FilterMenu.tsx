import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import type {
  FiltersState,
  SubmittedBucket,
  TableAgGridFiltersProps,
} from "./FilterMenu.types";
import SearchInput from "./SearchInput";

const SUBMITTED_OPTIONS: SubmittedBucket[] = ["Today", "Yesterday", "Older"];

const MONTH_INDEX_BY_SHORT_NAME: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const DEFAULT_FIELD_ALIASES: Record<string, string> = {
  handledby: "AssignedTo",
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

function parseCandidateDate(raw: string, now: Date): Date | null {
  const directDate = new Date(raw);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const match = raw.match(/^(\d{1,2})\s+([a-zA-Z]{3,})/);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const monthText = match[2].toLowerCase();
  const monthIndex = MONTH_INDEX_BY_SHORT_NAME[monthText.slice(0, 3)];

  if (monthIndex === undefined || Number.isNaN(day)) {
    return null;
  }

  return new Date(now.getFullYear(), monthIndex, day);
}

function getSubmittedBucket(value: unknown): SubmittedBucket {
  const raw = String(value ?? "").trim();
  const lower = raw.toLowerCase();

  if (lower.includes("today")) return "Today";
  if (lower.includes("yesterday")) return "Yesterday";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const candidateDate = parseCandidateDate(raw, now);

  if (!candidateDate) return "Older";

  const normalizedCandidate = new Date(
    candidateDate.getFullYear(),
    candidateDate.getMonth(),
    candidateDate.getDate(),
  );

  const diffDays = Math.floor(
    (today.getTime() - normalizedCandidate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Older";
}

export default function TableAgGridFilters({
  config,
  rows,
  onFilteredRowsChange,
  onFilterInteraction,
}: TableAgGridFiltersProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filterFields = useMemo(() => {
    const fromMetadata = config.FilterMetadata?.Fields;
    if (Array.isArray(fromMetadata) && fromMetadata.length > 0) {
      return fromMetadata.map((field) => field.Name);
    }

    if (config.FilterModel && typeof config.FilterModel === "object") {
      return Object.keys(config.FilterModel);
    }

    return [] as string[];
  }, [config]);

  const [filters, setFilters] = useState<FiltersState>(() =>
    createEmptyFilters(filterFields),
  );
  const [quickFilter, setQuickFilter] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const fieldDefinitions = useMemo(() => {
    const rowKeys = rows.length > 0 ? Object.keys(rows[0]) : [];

    return filterFields.map((fieldName) => {
      const metadataField = config.FilterMetadata?.Fields?.find(
        (field) => field.Name === fieldName,
      );

      const matchingColumn =
        (config.Columns || []).find(
          (column) => normalize(column.ColumnName) === normalize(fieldName),
        ) ||
        (config.Columns || []).find(
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
    config.FilterMetadata,
    config.Columns,
    config.FilterAliases,
  ]);

  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};

    fieldDefinitions.forEach((definition) => {
      const presetOptions =
        config.FilterPresetOptions?.[definition.fieldName] ||
        config.FilterPresetOptions?.[normalize(definition.fieldName)];

      if (Array.isArray(presetOptions) && presetOptions.length > 0) {
        options[definition.fieldName] = presetOptions;
        return;
      }

      if (
        isSubmittedField(definition.fieldName) ||
        isDateTimeField(definition.dataType)
      ) {
        options[definition.fieldName] = SUBMITTED_OPTIONS;
        return;
      }

      const uniqueValues = Array.from(
        new Set(
          rows
            .map((row) => row[definition.sourceKey])
            .filter(
              (value) =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== "",
            )
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

        if (
          isSubmittedField(definition.fieldName) ||
          isDateTimeField(definition.dataType)
        ) {
          const bucket = getSubmittedBucket(row[definition.sourceKey]);
          return selectedValues.includes(bucket);
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
  }, [rows, fieldDefinitions, filters, quickFilter]);

  useEffect(() => {
    onFilteredRowsChange(filteredRows);
  }, [filteredRows, onFilteredRowsChange]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleFilterToggle = useCallback(
    (field: string, value: string) => {
      onFilterInteraction();
      setFilters((previous) => ({
        ...previous,
        [field]: previous[field]?.includes(value)
          ? previous[field].filter((item) => item !== value)
          : [...(previous[field] || []), value],
      }));
    },
    [onFilterInteraction],
  );

  const handleQuickFilterChange = useCallback(
    (value: string) => {
      onFilterInteraction();
      setQuickFilter(value);
    },
    [onFilterInteraction],
  );

  return (
    <div ref={containerRef} className="flex gap-2">
      {fieldDefinitions.map((definition) => {
        const selectedValues = filters[definition.fieldName] || [];

        return (
          <div key={definition.fieldName} className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((previous) =>
                  previous === definition.fieldName
                    ? null
                    : definition.fieldName,
                )
              }
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium min-w-[150px] text-left flex items-center justify-between gap-2"
            >
              <span className="truncate">
                {selectedValues.length > 0
                  ? `${definition.label} (${selectedValues.length})`
                  : definition.label}
              </span>
              <svg
                className="w-3 h-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openDropdown === definition.fieldName && (
              <div className="absolute z-20 mt-1 w-64 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg p-2">
                {(filterOptions[definition.fieldName] || []).length === 0 ? (
                  <div className="px-2 py-1 text-xs text-gray-500">
                    No options
                  </div>
                ) : (
                  (filterOptions[definition.fieldName] || []).map((option) => (
                    <label
                      key={`${definition.fieldName}-${option}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        className="accent-blue-600 w-4 h-4"
                        checked={selectedValues.includes(option)}
                        onChange={() =>
                          handleFilterToggle(definition.fieldName, option)
                        }
                      />
                      <span className="truncate">{option}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
      <SearchInput
        value={quickFilter}
        onChange={handleQuickFilterChange}
        placeholder="Search"
      />
    </div>
  );
}
