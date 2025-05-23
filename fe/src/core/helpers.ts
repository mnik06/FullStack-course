import { ElNotification } from 'element-plus'
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
