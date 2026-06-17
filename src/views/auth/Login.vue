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
import {
  isActiveMember,
  isApprovedPendingPayment,
  isPendingApplication,
  isPendingAudit
} from '@/utils/membershipPayment'

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

function showStatusMessage(auditStatus: string | null | undefined, memberType?: string) {
  const typeText = memberType === '单位会员' ? '单位会员' : '个人会员'

  if (isPendingApplication(auditStatus) || isPendingAudit(auditStatus)) {
    ElMessage.info(`您的${typeText}申请正在审核中，您可以查看和修改会员资料。`)
    return
  }

  if (isApprovedPendingPayment(auditStatus)) {
    ElMessage.warning(`您的${typeText}审核已通过，请尽快完成缴费。`)
    return
  }

  if (isActiveMember(auditStatus)) {
    ElMessage.success(`欢迎回来，${typeText}状态正常。`)
  }
}

async function onSubmit() {
  if (loading.value) return
  loading.value = true
  try {
    // 1. 登录获取 token 和用户信息
    const res = await login(buildParams())
    const session = res.data as LoginSessionData | null | undefined

    if (!res.success || !session) {
      ElMessage.error(res.message || '登录失败')
      return
    }

    // 2. 提取 token 信息
    const { tokenInfo, userId, memberId, roles, isAdmin, isMember, memberType } = session
    const tokenValue = tokenInfo.tokenValue?.trim() || ''
    const loginId = tokenInfo.loginId ?? userId
    const tokenName = tokenInfo.tokenName

    if (!tokenValue) {
      ElMessage.error('登录失败：未获取到 token')
      return
    }

    // 3. 存储 token
    tokenStore.setSession({
      tokenValue,
      loginId: String(loginId),
      tokenName: typeof tokenName === 'string' ? tokenName : undefined
    })

    // 4. 根据角色进行跳转
    if (isAdmin && roles.includes('admin')) {
      // 管理员 → 跳转到管理端
      ElMessage.success('欢迎，管理员！')
      window.location.href = 'http://localhost:5174/'
      return
    }

    if (isMember && roles.includes('member')) {
      // 会员 → 执行原有的会员逻辑
      const currentUserStore = useCurrentUserStore()
      const memberProfileStore = useMemberProfileStore()

      // 5. 获取完整的会员信息（根据会员类型调用不同接口）
      if (Number.isFinite(memberId) && memberId > 0) {
        // 根据会员类型加载对应的详细信息
        if (memberType === '单位会员') {
          // 单位会员：调用单位会员详情接口
          try {
            const { getCompanyMemberInfo } = await import('@/api/memberArchive')
            const companyRes = await getCompanyMemberInfo(memberId)
            if (companyRes.success && companyRes.data) {
              memberProfileStore.setCompanyMemberInfo(companyRes.data)
            }
          } catch (error) {
            console.warn('加载单位会员信息失败:', error)
          }
        } else {
          // 个人会员：调用个人会员详情接口
          try {
            const { getMemberSingleByMemberId } = await import('@/api/memberArchive')
            const personalRes = await getMemberSingleByMemberId(memberId)
            if (personalRes.success && personalRes.data) {
              memberProfileStore.setMemberSingle(personalRes.data)
            }
          } catch (error) {
            console.warn('加载个人会员信息失败:', error)
          }
        }
      }

      // 6. 获取用户基本信息（用于显示用户名等）
      await currentUserStore.fetchCurrentUser(true)

      // 7. 根据会员 auditStatus 显示提示
      showStatusMessage(memberProfileStore.auditStatus, memberType)

      ElMessage.success(res.message || '登录成功')
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
      await router.replace(redirect.startsWith('/') ? redirect : '/user')
      return
    }

    // 8. 其他情况（既不是管理员也不是会员）
    ElMessage.warning('您的账号暂无权限访问系统')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '网络异常'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
