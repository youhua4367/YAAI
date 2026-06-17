import { computed } from 'vue'
import { useMemberProfile } from '@/composables/useMemberProfile'
import {
  canViewOrderByStatus,
  isActiveMember,
  isApprovedPendingPayment,
  isPendingApplication,
  isPendingAudit
} from '@/utils/membershipPayment'

export function useMemberPermissions() {
  const { memberSingle, companyMemberInfo, auditStatus } = useMemberProfile()

  const isLoggedIn = computed(() =>
    !!(memberSingle.value || companyMemberInfo.value)
  )

  const isPendingReview = computed(() =>
    isPendingApplication(auditStatus.value) || isPendingAudit(auditStatus.value)
  )

  const isApprovedPendingPaymentState = computed(() =>
    isApprovedPendingPayment(auditStatus.value)
  )

  const isPaidMember = computed(() => isActiveMember(auditStatus.value))

  const canViewProfile = computed(() => isLoggedIn.value)
  const canEditProfile = computed(() =>
    isPendingReview.value || isApprovedPendingPaymentState.value
  )
  const canViewAuditProgress = computed(() => isPendingReview.value)
  const canMakePayment = computed(() => isApprovedPendingPaymentState.value)
  const hasFullAccess = computed(() => isPaidMember.value)
  const canAccessCommittee = computed(() => hasFullAccess.value)
  const canViewOrders = computed(() => canViewOrderByStatus(auditStatus.value))

  const statusText = computed(() => auditStatus.value || '未知状态')

  const statusClass = computed(() => {
    if (isPendingReview.value) return 'status-pending'
    if (isApprovedPendingPaymentState.value) return 'status-payment'
    if (isPaidMember.value) return 'status-active'
    return 'status-unknown'
  })

  return {
    auditStatus,
    isLoggedIn,
    isPendingReview,
    isApprovedPendingPayment: isApprovedPendingPaymentState,
    isPaidMember,
    canViewProfile,
    canEditProfile,
    canViewAuditProgress,
    canMakePayment,
    hasFullAccess,
    canAccessCommittee,
    canViewOrders,
    statusText,
    statusClass
  }
}
