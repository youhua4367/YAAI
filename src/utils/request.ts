import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { LOGIN_PATH } from '@/constants/authPaths'
import { useTokenStore } from '@/stores/token'
import type { Result } from '@/types/result'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 业务错误码命中时不弹出 ElMessage（仍会 reject） */
    silentErrorCodes?: string[]
  }
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenStore = useTokenStore()
    if (tokenStore.token) {
      const headerName = tokenStore.tokenName || 'yaai'
      config.headers[headerName] = tokenStore.token
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    const result = response.data
    const silentCodes = response.config.silentErrorCodes ?? []

    if (result.success) {
      return result as any
    }

    if (!silentCodes.includes(String(result.code ?? ''))) {
      ElMessage.error(result.message)
    }
    return Promise.reject(result)
  },
  (error) => {
    const tokenStore = useTokenStore()

    if (error.response?.status === 401) {
      ElMessage.error('未登录，请重新登录')
      tokenStore.removeToken()
      void import('@/router').then(({ default: router }) => {
        void router.push(LOGIN_PATH)
      })
      return Promise.reject(error)
    }

    ElMessage.error('服务异常')
    return Promise.reject(error)
  }
)

export default request
