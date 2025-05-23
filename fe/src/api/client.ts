import axios from 'axios'

import {
  requestInterceptor
} from './interceptors'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

instance.interceptors.request.use(requestInterceptor)

export const useApiClient = instance
