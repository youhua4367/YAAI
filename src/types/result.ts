export interface Result<T = any> {
  code?: string | number
  success: boolean
  message: string
  data: T
}
