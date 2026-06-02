<template>
  <AuthPageLayout>
    <h2 class="auth-card__title">用户登录</h2>
    <form class="auth-form" @submit.prevent="onSubmit">
      <div class="auth-box">
        <input
          id="login-account"
          v-model.trim="account"
          type="text"
          required
          autocomplete="username"
        />
        <label for="login-account">手机或邮箱</label>
      </div>
      <div class="auth-box">
        <input
          id="login-password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
        />
        <label for="login-password">密码</label>
      </div>
      <button type="submit" class="auth-btn" :disabled="loading" :aria-busy="loading">
        <span class="auth-btn-text">{{ loading ? '登录中…' : '登录' }}</span>
        <span class="auth-btn-edge auth-btn-edge--1" aria-hidden="true" />
        <span class="auth-btn-edge auth-btn-edge--2" aria-hidden="true" />
        <span class="auth-btn-edge auth-btn-edge--3" aria-hidden="true" />
        <span class="auth-btn-edge auth-btn-edge--4" aria-hidden="true" />
      </button>
    </form>

    <template #footer>
      <router-link to="/apply">会员注册</router-link>
      <span class="dot">·</span>
      <router-link to="/">返回首页</router-link>
    </template>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue'
import { login } from '@/api/member'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useMemberProfileStore } from '@/stores/memberProfile'
import { useTokenStore } from '@/stores/token'
import type { LoginParams, LoginSessionData } from '@/types/member'

const router = useRouter()
const route = useRoute()
const tokenStore = useTokenStore()

const account = ref('')
const password = ref('')
const loading = ref(false)

function buildParams(): LoginParams {
  const t = account.value.trim()
  const pwd = password.value
  if (t.includes('@')) return { email: t, password: pwd }
  return { phone: t, password: pwd }
}

async function onSubmit() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await login(buildParams())
    const session = res.data as LoginSessionData | Record<string, unknown> | null | undefined
    const tokenValue =
      session && typeof session === 'object'
        ? String((session as LoginSessionData).tokenValue ?? (session as Record<string, unknown>).token_value ?? '').trim()
        : ''
    const loginId =
      session && typeof session === 'object'
        ? (session as LoginSessionData).loginId ?? (session as Record<string, unknown>).login_id
        : undefined
    const tokenName =
      session && typeof session === 'object'
        ? (session as LoginSessionData).tokenName ?? (session as Record<string, unknown>).token_name
        : undefined

    if (res.success && tokenValue) {
      tokenStore.setSession({
        tokenValue,
        loginId: loginId ?? '',
        tokenName: typeof tokenName === 'string' ? tokenName : undefined
      })
      await Promise.all([
        useCurrentUserStore().fetchCurrentUser(true),
        useMemberProfileStore().fetchMemberSingle(true)
      ])
      ElMessage.success(res.message || '登录成功')
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
      await router.replace(redirect.startsWith('/') ? redirect : '/user')
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '网络异常'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
