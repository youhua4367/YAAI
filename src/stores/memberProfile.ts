import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getMemberSingleByMemberId, NOT_EXIST_SINGLE_MEMBER } from '@/api/memberArchive'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useTokenStore } from '@/stores/token'
import type { Result } from '@/types/result'
import type { MemberSingleVO } from '@/types/userCenter'

function toMemberId(raw: unknown): string {
  if (raw === null || raw === undefined) return ''
  return String(raw).trim()
}

export const useMemberProfileStore = defineStore('memberProfile', () => {
  const memberSingle = ref<MemberSingleVO | null>(null)
  /** 尚未填写个人会员档案（NOT_EXIST_SINGLE_MEMBER） */
  const notFilled = ref(false)
  const loading = ref(false)
  let loadedForMemberId = ''

  const displayName = computed(() => {
    const name = memberSingle.value?.name?.trim()
    if (name) return name
    return useCurrentUserStore().displayName
  })

  async function fetchMemberSingle(force = false) {
    const tokenStore = useTokenStore()
    const memberIdStr = toMemberId(tokenStore.loginId)
    if (!tokenStore.token.trim() || !memberIdStr) return

    if (!force && loadedForMemberId === memberIdStr && (memberSingle.value || notFilled.value)) {
      return
    }

    const memberId = Number(memberIdStr)
    if (!Number.isFinite(memberId) || memberId <= 0) return

    loading.value = true
    try {
      const res = await getMemberSingleByMemberId(memberId)
      if (res.success && res.data) {
        memberSingle.value = res.data
        notFilled.value = false
        loadedForMemberId = memberIdStr
      }
    } catch (error) {
      const result = error as Result
      if (String(result?.code ?? '') === NOT_EXIST_SINGLE_MEMBER) {
        memberSingle.value = null
        notFilled.value = true
        loadedForMemberId = memberIdStr
        return
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  function clearMemberProfile() {
    memberSingle.value = null
    notFilled.value = false
    loadedForMemberId = ''
  }

  return {
    memberSingle,
    notFilled,
    loading,
    displayName,
    fetchMemberSingle,
    clearMemberProfile
  }
})
