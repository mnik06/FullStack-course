import dayjs from 'dayjs'
import { getInitials } from '@/core/helpers'
export const dateFilterOptions = {
  default: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  monthAndDay: {
    month: 'long',
    day: 'numeric'
  },
  twoDigit: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  },
  shortMonth: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  shortMonthWithTime: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  },
  month: {
    month: 'long'
  },
  dayAndWeekDay: {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  }
} as const

export const dateFilter = (
  value: string | Date | undefined,
  formatOption: keyof typeof dateFilterOptions = 'default',
  stub = 'Unknown'
) => {
  if (!value || !dayjs(value).isValid()) return stub

  return new Date(value).toLocaleString('en-US', dateFilterOptions[formatOption])
}

export const relativeDate = (value: string, stub = 'Unknown'): string => {
  if (!value) return stub

  return dayjs(value).fromNow()
}

const yesOrNo = (val: boolean) => val ? 'Yes' : 'No'

export const allFilters = {
  dateFilter,
  relativeDate,
  getInitials,
  yesOrNo
}

export const filters = {
  install: (app) => {
    app.config.globalProperties.$filters = allFilters
  }
}
