import type { NavigationGuard } from 'vue-router'
import { LOGIN_PATH, USER_CENTER_PATH } from '@/constants/authPaths'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useMemberProfileStore } from '@/stores/memberProfile'
import { useTokenStore } from '@/stores/token'

export { LOGIN_PATH, USER_CENTER_PATH }

/** 已登录用户访问登录页 → 个人中心 */
export const guestOnly: NavigationGuard = (_to, _from, next) => {
  const tokenStore = useTokenStore()
  if (tokenStore.isLoggedIn) {
    next({ path: USER_CENTER_PATH, replace: true })
    return
  }
  next()
}

/** 未登录用户访问个人中心 → 登录页；仅有 token 无 loginId 的旧会话也要求重新登录 */
export const requireAuth: NavigationGuard = (to, _from, next) => {
  const tokenStore = useTokenStore()
  if (!tokenStore.isLoggedIn) {
    next({
      path: LOGIN_PATH,
      replace: true,
      query: to.fullPath !== USER_CENTER_PATH ? { redirect: to.fullPath } : undefined
    })
    return
  }
  if (!String(tokenStore.loginId ?? '').trim()) {
    tokenStore.removeToken()
    useCurrentUserStore().clearProfile()
    useMemberProfileStore().clearMemberProfile()
    next({
      path: LOGIN_PATH,
      replace: true,
      query: { redirect: to.fullPath }
    })
    return
  }
  next()
}

/** 进入个人中心时拉取账号信息（会员信息已在登录时加载） */
export const loadUserProfile: NavigationGuard = (_to, _from, next) => {
  const currentUserStore = useCurrentUserStore()
  // 只获取用户基本信息，会员信息已在登录时根据 memberType 加载完成
  void currentUserStore.fetchCurrentUser(true).finally(() => next())
}
