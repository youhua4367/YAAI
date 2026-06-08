import request from '@/utils/request'
import type { Result } from '@/types/result'
import type {
  MemberEducationVO,
  MemberSingleInsertRequest,
  MemberSingleUpdateRequest,
  MemberSingleVO,
  MemberWorkExperienceVO,
  CommitteeMemberVO,
  CompanyMemberInfoVO
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

/** `GET /committee-member/queryByMemberId?memberId=` → `CommitteeMemberVO` */
export function getCommitteeMemberByMemberId(memberId: number): Promise<Result<CommitteeMemberVO>> {
  return request.get('/committee-member/queryByMemberId', { params: { memberId } })
}

/** 查询单位会员详细信息 `GET /member/company/info?memberId=` */
export function getCompanyMemberInfo(memberId: number): Promise<Result<CompanyMemberInfoVO>> {
  return request.get('/member/company/info', { params: { memberId } })
}


