import request from '@/utils/request'
import type { Result } from '@/types/result'

// 发送验证码
export const sendCode = (email: string): Promise<Result<void>> => {
  return request.post(`/member/sendCode?email=${email}`)
}
