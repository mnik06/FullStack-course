import dayjs from 'dayjs'

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

// TODO: use object for params
export const dateFilter = (
  value: string | Date | undefined,
  formatOption: keyof typeof dateFilterOptions = 'default',
  stub = 'Unknown'
) => {
  if (!value || !dayjs(value).isValid()) return stub

  return new Date(value).toLocaleString('en-US', dateFilterOptions[formatOption])
}

export const allFilters = {
  dateFilter
}

export const filters = {
  install: (app) => {
    app.config.globalProperties.$filters = allFilters
  }
}
