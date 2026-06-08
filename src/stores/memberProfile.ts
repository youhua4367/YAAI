import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { queryMemberIdByUserId } from '@/api/member'
import {getCompanyMemberInfo, getMemberSingleByMemberId} from '@/api/memberArchive'
import type { Result } from '@/types/result'
import type { MemberSingleVO, CompanyMemberInfoVO } from '@/types/userCenter'
import { NOT_EXIST_SINGLE_MEMBER } from '@/api/memberArchive'
import {useTokenStore} from "@/stores/token.ts";

export const useMemberProfileStore = defineStore('memberProfile', () => {
  const memberSingle = ref<MemberSingleVO | null>(null)
  const companyMemberInfo = ref<CompanyMemberInfoVO | null>(null)
  const notFilled = ref(false)
  const loading = ref(false)
  let loadedForMemberId = ''

  const displayName = computed(() => {
    if (companyMemberInfo.value) {
      return companyMemberInfo.value.unitName || '单位会员'
    }
    return memberSingle.value?.name || '会员'
  })

  const memberType = computed(() => {
    if (companyMemberInfo.value) return 'company'
    if (memberSingle.value) return 'personal'
    return null
  })

  async function fetchMemberSingle(force = false) {
    const userIdStr = String(useTokenStore().loginId || '')
    if (!userIdStr.trim()) return

    const userId = Number(userIdStr)
    if (!Number.isFinite(userId) || userId <= 0) return

    if (!force && loadedForMemberId === userIdStr) return

    loading.value = true
    try {
      const memberIdRes = await queryMemberIdByUserId(userId)
      if (!memberIdRes.success || !memberIdRes.data) {
        console.warn('未找到会员信息，可能还未申请会员')
        memberSingle.value = null
        companyMemberInfo.value = null
        notFilled.value = true
        loadedForMemberId = userIdStr
        return
      }

      const memberId = memberIdRes.data

      // 尝试获取个人会员信息
      try {
        const res = await getMemberSingleByMemberId(memberId)
        if (res.success && res.data) {
          memberSingle.value = res.data
          companyMemberInfo.value = null
          notFilled.value = false
          loadedForMemberId = userIdStr
          return
        }
      } catch (error) {
        const result = error as Result
        if (String(result?.code ?? '') !== NOT_EXIST_SINGLE_MEMBER) {
          throw error
        }
      }

      // 如果个人会员不存在，尝试获取单位会员信息
      try {
        const companyRes = await getCompanyMemberInfo(memberId)
        if (companyRes.success && companyRes.data) {
          companyMemberInfo.value = companyRes.data
          memberSingle.value = null
          notFilled.value = false
          loadedForMemberId = userIdStr
          return
        }
      } catch {
        // 单位会员也不存在
      }

      // 两者都不存在
      memberSingle.value = null
      companyMemberInfo.value = null
      notFilled.value = true
      loadedForMemberId = userIdStr
    } catch (error) {
      const result = error as Result
      if (String(result?.code ?? '') === NOT_EXIST_SINGLE_MEMBER) {
        memberSingle.value = null
        companyMemberInfo.value = null
        notFilled.value = true
        loadedForMemberId = userIdStr
        return
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  function clearMemberProfile() {
    memberSingle.value = null
    companyMemberInfo.value = null
    notFilled.value = false
    loadedForMemberId = ''
  }

  function setMemberSingle(data: MemberSingleVO) {
    memberSingle.value = data
    companyMemberInfo.value = null
    notFilled.value = false
  }

  function setCompanyMemberInfo(data: CompanyMemberInfoVO) {
    companyMemberInfo.value = data
    memberSingle.value = null
    notFilled.value = false
  }

  return {
    memberSingle,
    companyMemberInfo,
    notFilled,
    loading,
    displayName,
    memberType,
    fetchMemberSingle,
    clearMemberProfile,
    setMemberSingle,
    setCompanyMemberInfo
  }
})
