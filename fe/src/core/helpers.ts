import { ElNotification } from 'element-plus'
import cloneDeep from 'lodash/cloneDeep'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'

export const createHashedObject = <
  T extends TIndexedObject,
  Prop extends keyof T,
  ValueArray extends boolean = false
>(
  array: T[] = [],
  prop: Prop = 'id' as Prop,
  isValueArray?: ValueArray,
  shouldRemoveKeyField?: boolean
): Record<T[Prop], ValueArray extends true ? T[] : T> => {
  return array.reduce((acc, current) => {
    const key = get(current, prop as string) as unknown as T[Prop]

    if (shouldRemoveKeyField) {
      delete current[prop]
    }

    if (isValueArray) {
      const existingValue = acc[key] as T[] | undefined
      acc[key] = [...(Array.isArray(existingValue) ? existingValue : []), current] as ValueArray extends true ? T[] : T
    } else {
      acc[key] = current as ValueArray extends true ? T[] : T
    }

    return acc
  }, {} as Record<T[Prop], ValueArray extends true ? T[] : T>)
}

export const notificationHandler = (
  notification?: string | ICustomNotification | TAppAxiosError,
  customNotificationOptions?: Partial<TElementPlus['NotificationOptions']>
) => {
  const type = (notification as ICustomNotification)?.type || 'error'
  const customMessage = typeof notification === 'string'
    ? notification
    : (notification as ICustomNotification)?.text

  const apiErrorMessage = errorService.hashedCodes[(notification as TAppAxiosError)?.code]?.message

  return ElNotification[type]({
    message: `${customMessage || apiErrorMessage || 'Something went wrong, please try again later.'}`,
    title: capitalize(type),
    duration: 4500,
    offset: 50,
    position: 'bottom-right',
    ...(customNotificationOptions || {})
  })
}

export const stringifyParams = (obj: TIndexedObject = {}, removeEmpty = true): TIndexedObject => {
  const val = cloneDeep(obj)

  for (const key of Object.keys(val)) {
    if (removeEmpty && ((!val[key] && !Number.isInteger(val[key])) || val[key].length === 0)) delete val[key]
    else if (Array.isArray(val[key])) val[key] = val[key].join()
    else val[key] = String(val[key])
  }

  return val
}

export const getInitials = (name: string) => {
  if (!name) return ''

  return name.split(' ').map(n => n[0]).join('')
}
