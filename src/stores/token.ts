import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const DEFAULT_TOKEN_NAME = 'yaai'

export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref('')
    const loginId = ref('')
    const tokenName = ref(DEFAULT_TOKEN_NAME)

    function setToken(newToken: string) {
      token.value = newToken
    }

    function setLoginId(id: string) {
      loginId.value = id
    }

    /** 登录成功后保存 tokenValue、loginId（及 tokenName） */
    function setSession(payload: {
      tokenValue: string
      loginId: string | number
      tokenName?: string
    }) {
      token.value = String(payload.tokenValue ?? '').trim()
      loginId.value = String(payload.loginId ?? '').trim()
      tokenName.value = payload.tokenName?.trim() || DEFAULT_TOKEN_NAME
    }

    function removeToken() {
      token.value = ''
      loginId.value = ''
      tokenName.value = DEFAULT_TOKEN_NAME
    }

    const isLoggedIn = computed(() => Boolean(token.value.trim()))

    return {
      token,
      loginId,
      tokenName,
      isLoggedIn,
      setToken,
      setLoginId,
      setSession,
      removeToken
    }
  },
  { persist: true }
)
