import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useTokenStore } from '@/stores/token'
import type { Result } from '@/types/result'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenStore = useTokenStore()
    if (tokenStore.token) {
      config.headers.Authorization = `Bearer ${tokenStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    const result = response.data

    if (result.success) {
      return result as any
    } else {
      ElMessage.error(result.message)
      return Promise.reject(result)
    }
  },
  (error) => {
    const tokenStore = useTokenStore()

    if (error.response?.status === 401) {
      ElMessage.error('未登录，请重新登录')
      tokenStore.removeToken()
      router.push('/login')
      return Promise.reject(error)
    }

    ElMessage.error('服务异常')
    return Promise.reject(error)
  }
)

export default request
