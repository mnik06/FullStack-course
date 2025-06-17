import { ElNotification } from 'element-plus'
import cloneDeep from 'lodash/cloneDeep'
import capitalize from 'lodash/capitalize'

export const notificationHandler = (
  notification?: string | ICustomNotification | TAppAxiosError,
  customNotificationOptions?: TElementPlus['NotificationOptions']
) => {
  const type = (notification as ICustomNotification)?.type || 'error'
  const customMessage = typeof notification === 'string'
    ? notification
    : (notification as ICustomNotification)?.text

  // TODO: uncomment for custom error codes
  // const apiErrorCode = (notification as TAppAxiosError)?.response?.data?.error?.code
  // const customErrorCode = (notification as ICustomNotification)?.errorCode

  // const apiErrorNotificationConfig = errorService.hashedCodes[apiErrorCode]
  // const customErrorNotificationConfig = errorService.codes[customErrorCode]

  // const {
  //   options: errorCodeNotificationOptions,
  //   message: errorCodeMessage
  // } = apiErrorNotificationConfig || customErrorNotificationConfig || {}

  return ElNotification[type]({
    message: `${customMessage || 'Something went wrong, please try again later.'}`,
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
  return name.split(' ').map(n => n[0]).join('')
}
