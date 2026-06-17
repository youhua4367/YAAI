import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { queryMemberIdByUserId, getCommitteeList } from '@/api/member'
import {
  getMemberSingleByMemberId,
  getCommitteeMemberByMemberId,
  getCompanyMemberInfo
} from '@/api/memberArchive'
import { useMemberProfileStore } from '@/stores/memberProfile'
import type { CommitteeVO } from '@/types/member'
import type {
  MemberSingleInfoVO,
  MemberEducationVO,
  MemberWorkExperienceVO,
  CommitteeMemberVO,
  CompanyMemberInfoVO
} from '@/types/userCenter'
import type { Result } from '@/types/result'
import { NOT_EXIST_SINGLE_MEMBER } from '@/api/memberArchive'

export interface MemberFullProfile {
  memberSingle: MemberSingleInfoVO | null
  companyMemberInfo: CompanyMemberInfoVO | null
  educationList: MemberEducationVO[]
  workList: MemberWorkExperienceVO[]
  committeeMember: CommitteeMemberVO | null
  committeeName: string | null
  memberType: 'personal' | 'company' | null
}

/**
 * 登录后获取完整的会员信息
 * @param userId - 用户ID（从登录响应中获取的 loginId）
 * @param memberType - 会员类型（'个人会员' 或 '单位会员'）
 * @returns 完整的会员资料
 */
export function useLoginDataLoader() {
  const loading = ref(false)
  const profile = ref<MemberFullProfile>({
    memberSingle: null,
    companyMemberInfo: null,
    educationList: [],
    workList: [],
    committeeMember: null,
    committeeName: null,
    memberType: null
  })

  async function loadFullProfile(userId: number, memberType?: string): Promise<MemberFullProfile | null> {
    if (loading.value) return null

    loading.value = true
    try {
      // 1. 获取 memberId
      const memberIdRes = await queryMemberIdByUserId(userId)
      if (!memberIdRes.success || !memberIdRes.data) {
        console.warn('未找到会员信息，可能还未申请会员')
        return null
      }

      const memberId = memberIdRes.data

      // 2. 根据会员类型加载不同的数据
      if (memberType === '单位会员') {
        // 单位会员：只加载单位会员信息
        const [companyRes, committeesRes] = await Promise.all([
          getCompanyMemberInfo(memberId),
          getCommitteeList()
        ])

        const companyMemberInfo = companyRes.success ? companyRes.data : null

        // 匹配委员会名称
        let committeeName: string | null = null
        if (companyMemberInfo && committeesRes.success && committeesRes.data) {
          const committee = committeesRes.data.find(c => c.id === companyMemberInfo.committeeId)
          if (committee) {
            committeeName = committee.name
          }
        }

        // 存储到 store
        if (companyMemberInfo) {
          const memberProfileStore = useMemberProfileStore()
          memberProfileStore.setCompanyMemberInfo(companyMemberInfo)
        }

        // 更新本地状态
        profile.value = {
          memberSingle: null,
          companyMemberInfo,
          educationList: [],
          workList: [],
          committeeMember: null,
          committeeName,
          memberType: 'company'
        }

        return profile.value
      } else {
        // 个人会员：加载个人会员详细信息
        const [
          memberSingleInfoRes,
          committeeMemberRes,
          committeesRes
        ] = await Promise.all([
          getMemberSingleByMemberId(memberId),
          getCommitteeMemberByMemberId(memberId),
          getCommitteeList()
        ])

        // 处理个人详细信息（包含基本信息、教育经历、工作经历等）
        const memberSingleInfo = memberSingleInfoRes.success ? memberSingleInfoRes.data : null

        // 从详细信息中提取教育经历和工作经历
        const educationList = memberSingleInfo?.educationList || []
        const workList = memberSingleInfo?.workExperienceList || []

        // 处理委员会关系
        const committeeMember = committeeMemberRes.success ? committeeMemberRes.data : null

        // 匹配委员会名称
        let committeeName: string | null = null
        if (committeeMember && committeesRes.success && committeesRes.data) {
          const committee = committeesRes.data.find(c => c.id === committeeMember.committeeId)
          if (committee) {
            committeeName = committee.name
          }
        }

        // 存储到 store
        if (memberSingleInfo) {
          const memberProfileStore = useMemberProfileStore()
          memberProfileStore.setMemberSingle(memberSingleInfo)
        }

        // 更新本地状态
        profile.value = {
          memberSingle: memberSingleInfo,
          companyMemberInfo: null,
          educationList,
          workList,
          committeeMember,
          committeeName,
          memberType: 'personal'
        }

        return profile.value
      }
    } catch (error) {
      console.error('加载会员信息失败:', error)
      // 不显示错误消息，因为可能是用户还未申请会员
      return null
    } finally {
      loading.value = false
    }
  }

  function clearProfile() {
    profile.value = {
      memberSingle: null,
      companyMemberInfo: null,
      educationList: [],
      workList: [],
      committeeMember: null,
      committeeName: null,
      memberType: null
    }
  }

  return {
    loading,
    profile,
    loadFullProfile,
    clearProfile
  }
}
