import { defineStore } from 'pinia'
import { register } from '@/api/member'
import type { RegisterParams } from '@/types/member'
import type { Result } from '@/types/result'

export const useAuthStore = defineStore('auth', () => {
  const doRegister = async (params: RegisterParams): Promise<Result<void>> => {
    return await register(params)
  }

  return {
    doRegister
  }
})
