<!-- 个人会员申请：POST /member/apply/single -->
<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>个人会员申请</h2>
    </div>

    <div v-loading="loading" class="profile-card">
      <PersonalMemberApplyForm
        v-if="memberId > 0 && !loading"
        :member-id="memberId"
        :initial-data="memberSingle"
        :initial-education="educationList"
        :initial-work="workList"
        @success="onSaved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PersonalMemberApplyForm from '@/components/user/PersonalMemberApplyForm.vue'
import {
  getMemberEducationByMemberId,
  getMemberWorkExperienceByMemberId
} from '@/api/memberArchive'
import { useMemberProfile } from '@/composables/useMemberProfile'
import { useTokenStore } from '@/stores/token'
import type { MemberEducationVO, MemberWorkExperienceVO } from '@/types/userCenter'

const { memberSingle, loading, fetchMemberSingle } = useMemberProfile()
const tokenStore = useTokenStore()

const memberId = computed(() => Number(tokenStore.loginId) || 0)
const educationList = ref<MemberEducationVO[]>([])
const workList = ref<MemberWorkExperienceVO[]>([])

async function loadExtraProfile() {
  const id = memberId.value
  if (!id) {
    educationList.value = []
    workList.value = []
    return
  }
  try {
    const [eduRes, workRes] = await Promise.all([
      getMemberEducationByMemberId(id),
      getMemberWorkExperienceByMemberId(id)
    ])
    educationList.value = eduRes.success && eduRes.data ? eduRes.data : []
    workList.value = workRes.success && workRes.data ? workRes.data : []
  } catch {
    educationList.value = []
    workList.value = []
  }
}

watch(
  () => memberSingle.value?.memberId ?? memberId.value,
  () => {
    void loadExtraProfile()
  },
  { immediate: true }
)

async function onSaved() {
  await fetchMemberSingle(true)
  await loadExtraProfile()
}
</script>

<style scoped>
.profile-page {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.profile-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 30px;
  min-height: 240px;
}
</style>
