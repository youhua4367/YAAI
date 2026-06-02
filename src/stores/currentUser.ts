import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getUserById } from '@/api/user'
import { useTokenStore } from '@/stores/token'
import type { UserDetailVO } from '@/types/userCenter'

function toLoginId(raw: unknown): string {
  if (raw === null || raw === undefined) return ''
  return String(raw).trim()
}

export const useCurrentUserStore = defineStore('currentUser', () => {
  const profile = ref<UserDetailVO | null>(null)
  const loading = ref(false)
  let loadedForLoginId = ''

  const displayName = computed(() => profile.value?.username?.trim() || '会员')

  async function fetchCurrentUser(force = false) {
    const tokenStore = useTokenStore()
    const loginId = toLoginId(tokenStore.loginId)
    if (!tokenStore.token.trim() || !loginId) return

    if (!force && loadedForLoginId === loginId && profile.value) return

    const id = Number(loginId)
    if (!Number.isFinite(id) || id <= 0) return

    loading.value = true
    try {
      const res = await getUserById(id)
      if (res.success && res.data) {
        profile.value = res.data
        loadedForLoginId = loginId
      }
    } finally {
      loading.value = false
    }
  }

  function clearProfile() {
    profile.value = null
    loadedForLoginId = ''
  }

  return {
    profile,
    loading,
    displayName,
    fetchCurrentUser,
    clearProfile
  }
})
