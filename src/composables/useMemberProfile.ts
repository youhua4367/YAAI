import { storeToRefs } from 'pinia'
import { useMemberProfileStore } from '@/stores/memberProfile'

/** 个人会员档案（`GET /member-single/queryByMemberId`，loginId 即 memberId） */
export function useMemberProfile() {
  const store = useMemberProfileStore()
  const { memberSingle, notFilled, loading, displayName } = storeToRefs(store)

  return {
    memberSingle,
    notFilled,
    loading,
    displayName,
    fetchMemberSingle: store.fetchMemberSingle
  }
}
