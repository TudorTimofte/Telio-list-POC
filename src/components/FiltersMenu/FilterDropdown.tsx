import { useEffect, useRef, useState } from "react";

interface FilterDropdownProps {
  id: string;
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export default function FilterDropdown({
  id,
  label,
  options,
  selectedValues,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const toggleValue = (value: string) => {
    onChange(
      selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value],
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white text-black inline-flex items-center gap-2"
      >
        <span>{label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.1 1.02l-4.25 4.5a.75.75 0 01-1.1 0l-4.25-4.5a.75.75 0 01.02-1.04z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 min-w-56 max-h-64 overflow-auto bg-white border border-gray-200 rounded-lg shadow-md p-2">
          {options.map((option, index) => {
            const checked = selectedValues.includes(option);
            return (
              <label
                key={`${id}-${option}-${index}`}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 text-black cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleValue(option)}
                  className="accent-blue-600"
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
