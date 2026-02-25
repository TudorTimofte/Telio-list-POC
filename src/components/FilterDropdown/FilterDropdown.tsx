import React, { useState, useRef } from 'react'
// import { useClickOutside } from '../hooks/useClickOutside'
import type { FilterDropdownProps } from '../../types'
import './FilterDropdown.css'

function FilterDropdown({ label, options, selectedValues, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  // useClickOutside(dropdownRef, () => setIsOpen(false))

  const handleToggle = (): void => {
    setIsOpen(!isOpen)
  }

  const handleCheckboxChange = (value: string): void => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]

    onChange(newSelectedValues)
  }

  const getDisplayText = (): string => {
    if (selectedValues.length === 0) {
      return ''
    }

    if (selectedValues.length === 1) {
      return selectedValues[0]
    }

    // Show first name + count of additional selections
    const firstSelected = selectedValues[0]
    const additionalCount = selectedValues.length - 1
    return `${firstSelected} +${additionalCount}`
  }

  const displayText: string = getDisplayText()
  const hasSelections = selectedValues.length > 0

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button
        className="filter-dropdown-button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        {!hasSelections ? (
          <span className="filter-label">{label}:</span>
        ) : (
          <span className="filter-value">{displayText}</span>
        )}
        <span className={`filter-arrow ${isOpen ? 'open' : ''}`} aria-hidden="true">▼</span>
      </button>

      {isOpen && (
        <div className="filter-dropdown-menu" role="listbox">
          <div className="filter-dropdown-options">
            {options.map((option) => (
              <label key={option} className="filter-option" role="option">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  aria-label={`Select ${option}`}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(FilterDropdown)
