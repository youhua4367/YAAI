import request from '@/utils/request'
import type { Result } from '@/types/result'

/** 更新用户信息已迁至 `@/api/user` 的 `updateUser`，此处再导出便于旧路径引用 */
export { updateUser } from './user'
import type {
  RegisterParams,
  LoginParams,
  LoginSessionData,
  CancelApplyParams,
  SingleMemberApplyRequest,
  CompanyMemberApplyRequest,
  CommitteeVO
} from '@/types/member'
import type { OrderCreateVO, OrderVO } from '@/types/userCenter'

export type { RegisterParams }

// 用户注册
export const register = (params: RegisterParams): Promise<Result<void>> => {
  return request.post('/member/register', params)
}

// 用户登录（phone和email至少填一个）
export const login = (params: LoginParams): Promise<Result<LoginSessionData>> => {
  return request.post('/member/login', params)
}

// 用户登出
export const logout = (): Promise<Result<void>> => {
  return request.post('/member/logout')
}

// 获取委员会列表
export const getCommitteeList = (): Promise<Result<CommitteeVO[]>> => {
  return request.get('/committee/queryAllNames')
}

// 根据用户ID查询会员ID
export const queryMemberIdByUserId = (userId: number): Promise<Result<number>> => {
  return request.get('/member/queryMemberIdByUserId', { params: { userId } })
}

// 个人会员申请
export const submitSingleMemberApplication = (data: SingleMemberApplyRequest): Promise<Result<void>> => {
  return request.post('/member/apply/single', data)
}

// 单位会员申请
export const submitCompanyMemberApplication = (data: CompanyMemberApplyRequest): Promise<Result<void>> => {
  return request.post('/member/apply/company', data)
}

// 取消申请
export const cancelApplication = (params: CancelApplyParams): Promise<Result<void>> => {
  return request.post('/member/cancel/apply', params)
}

/** 创建会费订单并获取支付信息 `POST /member/payment/create` */
export function createPaymentOrder(body: {
  memberId: number
  paymentMethod: string
}): Promise<Result<OrderCreateVO>> {
  return request.post('/member/payment/create', null, {
    params: body
  })
}

/** 订单列表 `GET /member/order/list?memberId=` */
export function getMemberOrderList(memberId: number): Promise<Result<OrderVO[]>> {
  return request.get('/member/order/list', { params: { memberId } })
}

/** 订单详情 `GET /member/order/detail?outTradeNo=` */
export function getMemberOrderDetail(outTradeNo: string): Promise<Result<OrderVO>> {
  return request.get('/member/order/detail', { params: { outTradeNo } })
}
