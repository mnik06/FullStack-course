type TIndexedObject<T = any> = Record<string, T>

type TCallbackFn<T extends unknown[] = [], R = void> = (...args: T) => R

type TFormatterFunction<T> = (row: T) => (number | string)
type TTableHeadings<T = Record<string, any>> = Array<{
  label: string
  value: string
  sort?: boolean
  width?: number
  minWidth?: number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  sortMethod?: (a: number, b: number) => number
  formatter?: (row: T) => (number | string)
}>

type TLayoutName = 'Blank' | 'Default'

type TAppAxiosError = import('axios').AxiosError<{ error: { code: number } }>

type TSortOrder = 'asc' | 'desc'
interface IAppSorting<T extends string> {
  sortBy: T
  sortOrder: TSortOrder
}

interface IPagination {
  offset: number
  limit: number
}

type TResponseWithPagination<T> = {
  data: T
  meta: IPaginationMeta
}

interface ICustomNotification {
  errorCode?: TCustomErrorCode
  text?: string
  type?: IElementPlus['NotificationType']
}
