import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { UpdateUserParams } from '@/types/member'
import type { UserDetailVO } from '@/types/userCenter'

/** `GET /user/queryById?id=` */
export function getUserById(id: number): Promise<Result<UserDetailVO>> {
  return request.get('/user/queryById', { params: { id } })
}

/** `PUT /user/update`（会员资料等，请求体以 `UpdateUserParams` 为准） */
export function updateUser(params: UpdateUserParams): Promise<Result<void>> {
  return request.put('/user/update', params)
}

/** `POST /user/changePassword` - 修改密码 */
export interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export function changePassword(params: ChangePasswordParams): Promise<Result<void>> {
  return request.post('/user/changePassword', params)
}
