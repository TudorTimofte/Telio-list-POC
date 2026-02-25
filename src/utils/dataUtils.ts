import type { TableRow } from '../types'
import type { UserData } from '../types'

/**
 * Extracts unique values from a specific field in table data
 */
export const getUniqueFieldValues = <T extends TableRow>(
  data: T[],
  field: keyof T,
  transform?: (value: unknown) => string
): string[] => {
  const values = data.map((row) => {
    const value = row[field]
    return transform ? transform(value) : String(value ?? '')
  })
  const uniqueValues = [...new Set(values)]
  return uniqueValues.sort()
}

/**
 * Extracts unique assigned to values from table data
 */
export const getUniqueAssignedTo = (data: UserData[]): string[] => {
  return getUniqueFieldValues(data, 'assignedTo')
}

/**
 * Extracts unique status values from table data
 */
export const getUniqueStatuses = (data: UserData[]): string[] => {
  return getUniqueFieldValues(data, 'status')
}

/**
 * Categorizes submitted dates into Today, Yesterday, or Older
 */
export const categorizeSubmittedDate = (submittedDate: string): string => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Parse the date string (format: "8 Jun 12:23")
  const dateParts = submittedDate.trim().split(' ')
  if (dateParts.length < 2) {
    return 'Older'
  }
  
  const day = parseInt(dateParts[0], 10)
  const monthName = dateParts[1]
  const currentYear = today.getFullYear()
  
  // Map month names to numbers
  const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  }
  
  const month = monthMap[monthName]
  if (month === undefined || isNaN(day)) {
    return 'Older'
  }
  
  try {
    const submitted = new Date(currentYear, month, day)
    submitted.setHours(0, 0, 0, 0)
    
    const todayDay = today.getDate()
    const todayMonth = today.getMonth()
    
    // Check if it's today
    if (day === todayDay && month === todayMonth) {
      return 'Today'
    }
    
    // Check if it's yesterday
    const yesterdayDay = yesterday.getDate()
    const yesterdayMonth = yesterday.getMonth()
    if (day === yesterdayDay && month === yesterdayMonth) {
      return 'Yesterday'
    }
    
    return 'Older'
  } catch {
    return 'Older'
  }
}

/**
 * Gets unique submitted date categories
 */
export const getUniqueSubmittedCategories = (data: UserData[]): string[] => {
  const categories = data.map((row) => categorizeSubmittedDate(row.submitted))
  const uniqueCategories = [...new Set(categories)]
  return ['Today', 'Yesterday', 'Older'].filter(cat => uniqueCategories.includes(cat))
}

/**
 * Generic filter function for table data
 */
export const filterByField = <T extends TableRow>(
  data: T[],
  field: keyof T,
  selectedValues: string[],
  transform?: (value: unknown) => string
): T[] => {
  if (selectedValues.length === 0) {
    return data
  }

  return data.filter((row) => {
    const value = row[field]
    const stringValue = transform ? transform(value) : String(value ?? '')
    return selectedValues.includes(stringValue)
  })
}

/**
 * Custom filter for submitted date categories
 */
export const filterBySubmittedCategory = (
  data: UserData[],
  selectedCategories: string[]
): UserData[] => {
  if (selectedCategories.length === 0) {
    return data
  }

  return data.filter((row) => {
    const category = categorizeSubmittedDate(row.submitted)
    return selectedCategories.includes(category)
  })
}
