import type { InternalAxiosRequestConfig } from 'axios'

const requestInterceptor = async (requestConfig: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  // if (requestConfig.headers) {
  //   requestConfig.headers.Authorization = `Bearer ${await authStore.getToken()}`
  // }

  return requestConfig
}

export {
  requestInterceptor
}
