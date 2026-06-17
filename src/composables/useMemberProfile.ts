import { storeToRefs } from 'pinia'
import { useMemberProfileStore } from '@/stores/memberProfile'

/** 会员档案（支持个人会员和单位会员） */
export function useMemberProfile() {
  const store = useMemberProfileStore()
  const {
    memberSingle,
    companyMemberInfo,
    notFilled,
    loading,
    displayName,
    memberType,
    auditStatus,
    membershipStatus
  } = storeToRefs(store)

  return {
    memberSingle,
    companyMemberInfo,
    notFilled,
    loading,
    displayName,
    memberType,
    auditStatus,
    membershipStatus,
    fetchMemberSingle: store.fetchMemberSingle
  }
}
