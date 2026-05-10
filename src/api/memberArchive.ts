import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { MemberEducationVO, MemberSingleVO, MemberWorkExperienceVO } from '@/types/userCenter'

/** `GET /member-single/queryByMemberId?memberId=` */
export function getMemberSingleByMemberId(memberId: number): Promise<Result<MemberSingleVO>> {
  return request.get('/member-single/queryByMemberId', { params: { memberId } })
}

/** `GET /member-single/queryById?id=` */
export function getMemberSingleById(id: number): Promise<Result<MemberSingleVO>> {
  return request.get('/member-single/queryById', { params: { id } })
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
