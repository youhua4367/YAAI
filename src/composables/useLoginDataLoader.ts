import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { queryMemberIdByUserId, getCommitteeList } from '@/api/member'
import {
  getMemberSingleByMemberId,
  getMemberEducationByMemberId,
  getMemberWorkExperienceByMemberId,
  getCommitteeMemberByMemberId
} from '@/api/memberArchive'
import { useMemberProfileStore } from '@/stores/memberProfile'
import type { CommitteeVO } from '@/types/member'
import type {
  MemberSingleVO,
  MemberEducationVO,
  MemberWorkExperienceVO,
  CommitteeMemberVO
} from '@/types/userCenter'

export interface MemberFullProfile {
  memberSingle: MemberSingleVO | null
  educationList: MemberEducationVO[]
  workList: MemberWorkExperienceVO[]
  committeeMember: CommitteeMemberVO | null
  committeeName: string | null
}

/**
 * 登录后获取完整的会员信息
 * @param userId - 用户ID（从登录响应中获取的 loginId）
 * @returns 完整的会员资料
 */
export function useLoginDataLoader() {
  const loading = ref(false)
  const profile = ref<MemberFullProfile>({
    memberSingle: null,
    educationList: [],
    workList: [],
    committeeMember: null,
    committeeName: null
  })

  async function loadFullProfile(userId: number): Promise<MemberFullProfile | null> {
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
      
      // 2. 并行获取所有会员相关信息
      const [
        memberSingleRes,
        educationRes,
        workRes,
        committeeMemberRes,
        committeesRes
      ] = await Promise.all([
        getMemberSingleByMemberId(memberId),
        getMemberEducationByMemberId(memberId),
        getMemberWorkExperienceByMemberId(memberId),
        getCommitteeMemberByMemberId(memberId),
        getCommitteeList()
      ])
      
      // 3. 处理个人基本信息
      const memberSingle = memberSingleRes.success ? memberSingleRes.data : null
      
      // 4. 处理教育经历
      const educationList = educationRes.success && educationRes.data ? educationRes.data : []
      
      // 5. 处理工作经历
      const workList = workRes.success && workRes.data ? workRes.data : []
      
      // 6. 处理委员会关系
      const committeeMember = committeeMemberRes.success ? committeeMemberRes.data : null
      
      // 7. 匹配委员会名称
      let committeeName: string | null = null
      if (committeeMember && committeesRes.success && committeesRes.data) {
        const committee = committeesRes.data.find(c => c.id === committeeMember.committeeId)
        if (committee) {
          committeeName = committee.name
        }
      }
      
      // 8. 存储到 store
      if (memberSingle) {
        const memberProfileStore = useMemberProfileStore()
        memberProfileStore.setMemberSingle(memberSingle)
      }
      
      // 9. 更新本地状态
      profile.value = {
        memberSingle,
        educationList,
        workList,
        committeeMember,
        committeeName
      }
      
      return profile.value
    } catch (error) {
      console.error('加载会员信息失败:', error)
      ElMessage.error('加载会员信息失败')
      return null
    } finally {
      loading.value = false
    }
  }

  function clearProfile() {
    profile.value = {
      memberSingle: null,
      educationList: [],
      workList: [],
      committeeMember: null,
      committeeName: null
    }
  }

  return {
    loading,
    profile,
    loadFullProfile,
    clearProfile
  }
}
