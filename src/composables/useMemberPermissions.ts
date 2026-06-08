import { computed } from 'vue'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useMemberProfileStore } from '@/stores/memberProfile'
import type { AuditStatus, MembershipStatus } from '@/types/member'

/**
 * 会员权限控制
 * 根据用户状态判断可访问的功能
 */
export function useMemberPermissions() {
  const currentUserStore = useCurrentUserStore()
  const memberProfileStore = useMemberProfileStore()

  // 用户状态：0-待申请，1-待缴费，2-已缴费
  const userStatus = computed(() => currentUserStore.profile?.status ?? 0)

  // 审核状态（从 member 表获取，如果后端返回的话）
  // 注意：当前 UserDetailVO 可能不包含 audit_status，需要后端补充
  const auditStatus = computed<AuditStatus>(() => {
    // TODO: 等后端在 getUserById 接口中返回 audit_status 字段
    // 暂时根据 user.status 推断
    if (userStatus.value === 0) return 'pending'
    if (userStatus.value >= 1) return 'approved'
    return 'pending'
  })

  // 是否已登录
  const isLoggedIn = computed(() => currentUserStore.profile !== null)

  // 是否正在审核中（待申请状态）
  const isPendingReview = computed(() => userStatus.value === 0)

  // 是否审核通过但待缴费
  const isApprovedPendingPayment = computed(() => userStatus.value === 1)

  // 是否已缴费（正式会员）
  const isPaidMember = computed(() => userStatus.value === 2)

  // 权限判断

  /** 是否可以查看个人信息（所有登录用户都可以） */
  const canViewProfile = computed(() => isLoggedIn.value)

  /** 是否可以编辑个人信息（审核期间可以修改） */
  const canEditProfile = computed(() => {
    // 审核期间和待缴费状态都可以编辑
    return isPendingReview.value || isApprovedPendingPayment.value
  })

  /** 是否可以查看审核进度 */
  const canViewAuditProgress = computed(() => {
    // 审核期间可以查看
    return isPendingReview.value
  })

  /** 是否可以发起缴费 */
  const canMakePayment = computed(() => {
    // 只有审核通过且未缴费的可以缴费
    return isApprovedPendingPayment.value
  })

  /** 是否可以访问完整功能（已缴费会员） */
  const hasFullAccess = computed(() => {
    return isPaidMember.value
  })

  /** 是否可以访问委员会相关功能 */
  const canAccessCommittee = computed(() => {
    // 只有正式会员可以访问
    return hasFullAccess.value
  })

  /** 是否可以访问订单列表 */
  const canViewOrders = computed(() => {
    // 待缴费和已缴费都可以查看订单
    return isApprovedPendingPayment.value || isPaidMember.value
  })

  // 获取状态显示文本
  const statusText = computed(() => {
    if (userStatus.value === 0) return '审核中'
    if (userStatus.value === 1) return '待缴费'
    if (userStatus.value === 2) return '正式会员'
    return '未知状态'
  })

  // 获取状态对应的 CSS 类名
  const statusClass = computed(() => {
    if (userStatus.value === 0) return 'status-pending'
    if (userStatus.value === 1) return 'status-payment'
    if (userStatus.value === 2) return 'status-active'
    return 'status-unknown'
  })

  return {
    // 状态
    userStatus,
    auditStatus,
    isLoggedIn,
    isPendingReview,
    isApprovedPendingPayment,
    isPaidMember,

    // 权限
    canViewProfile,
    canEditProfile,
    canViewAuditProgress,
    canMakePayment,
    hasFullAccess,
    canAccessCommittee,
    canViewOrders,

    // 显示
    statusText,
    statusClass
  }
}
