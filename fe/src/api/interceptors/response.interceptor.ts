import { notificationHandler } from '@/core/helpers'
import type { AxiosError, AxiosResponse } from 'axios'

const responseInterceptor = (response: AxiosResponse): Promise<AxiosResponse> => {
  return response.data
}

const errorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  if (!error.config?.skipNotification) {
    notificationHandler(error.response?.data)
  }

  return Promise.reject(error)
}

export {
  responseInterceptor,
  errorInterceptor
}
