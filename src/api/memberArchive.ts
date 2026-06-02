import request from '@/utils/request'
import type { Result } from '@/types/result'
import type {
  MemberEducationVO,
  MemberSingleInsertRequest,
  MemberSingleUpdateRequest,
  MemberSingleVO,
  MemberWorkExperienceVO
} from '@/types/userCenter'

/** 个人会员档案不存在时的业务码（不弹全局错误提示） */
export const NOT_EXIST_SINGLE_MEMBER = 'NOT_EXIST_SINGLE_MEMBER'

/** `GET /member-single/queryByMemberId?memberId=` */
export function getMemberSingleByMemberId(memberId: number): Promise<Result<MemberSingleVO>> {
  return request.get('/member-single/queryByMemberId', {
    params: { memberId },
    silentErrorCodes: [NOT_EXIST_SINGLE_MEMBER]
  })
}

/** `GET /member-single/queryById?id=` */
export function getMemberSingleById(id: number): Promise<Result<MemberSingleVO>> {
  return request.get('/member-single/queryById', { params: { id } })
}

/** `POST /member-single/insert` */
export function insertMemberSingle(data: MemberSingleInsertRequest): Promise<Result<void>> {
  return request.post('/member-single/insert', data)
}

/** `POST /member-single/updateById` */
export function updateMemberSingleById(data: MemberSingleUpdateRequest): Promise<Result<void>> {
  return request.post('/member-single/updateById', data)
}

/** `GET /member-education/queryByMemberId?memberId=` → `MemberEducationVO[]` */
export function getMemberEducationByMemberId(
  memberId: number
): Promise<Result<MemberEducationVO[]>> {
  return request.get('/member-education/queryByMemberId', { params: { memberId } })
}

/** `GET /member-work-experience/queryByMemberId?memberId=` → `MemberWorkExperienceVO[]` */
export function getMemberWorkExperienceByMemberId(
  memberId: number
): Promise<Result<MemberWorkExperienceVO[]>> {
  return request.get('/member-work-experience/queryByMemberId', { params: { memberId } })
}
