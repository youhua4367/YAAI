<!-- 会员信息展示与编辑 -->
<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>{{ isCompanyMember ? '单位会员信息' : '个人会员信息' }}</h2>
    </div>

    <div v-loading="loading" class="profile-card">
      <!-- 单位会员信息展示 -->
      <CompanyMemberInfoDisplay
        v-if="isCompanyMember && companyMemberInfo"
        :info="companyMemberInfo"
      />

      <!-- 个人会员表单（可编辑） -->
      <PersonalMemberApplyForm
        v-else-if="memberId > 0 && !loading"
        :member-id="memberId"
        :initial-data="memberSingle"
        :initial-education="educationList"
        :initial-work="workList"
        :initial-committee-member="committeeMember"
        @success="onSaved"
      />

      <!-- 未完善提示 -->
      <div v-else class="empty-state">
        <i class="fas fa-user-circle"></i>
        <p>您尚未完善{{ isCompanyMember ? '单位会员' : '个人会员' }}信息</p>
        <el-button type="primary" @click="handleApply">
          立即申请
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PersonalMemberApplyForm from '@/components/user/PersonalMemberApplyForm.vue'
import CompanyMemberInfoDisplay from '@/components/user/CompanyMemberInfoDisplay.vue'
import { getCommitteeMemberByMemberId } from '@/api/memberArchive'
import { useMemberProfile } from '@/composables/useMemberProfile'
import { useLoginDataLoader } from '@/composables/useLoginDataLoader'
import { useTokenStore } from '@/stores/token'
import type { MemberEducationVO, MemberWorkExperienceVO } from '@/types/userCenter'

const router = useRouter()
const { memberSingle, companyMemberInfo, loading, fetchMemberSingle, memberType } = useMemberProfile()
const loginDataLoader = useLoginDataLoader()
const tokenStore = useTokenStore()

const isCompanyMember = computed(() => memberType.value === 'company')

// 使用实际的 memberId，而不是 userId
const memberId = computed(() => {
  if (companyMemberInfo.value) {
    return companyMemberInfo.value.memberId
  }
  return memberSingle.value?.memberId || Number(tokenStore.loginId) || 0
})

const educationList = ref<MemberEducationVO[]>([])
const workList = ref<MemberWorkExperienceVO[]>([])
const committeeMember = ref(loginDataLoader.profile.value?.committeeMember || null)

async function loadExtraProfile() {
  const id = memberId.value
  if (!id || isCompanyMember.value) {
    educationList.value = []
    workList.value = []
    committeeMember.value = null
    return
  }
  try {
    // 从 memberSingle 中获取教育经历和工作经历
    if (memberSingle.value) {
      educationList.value = memberSingle.value.educationList || []
      workList.value = memberSingle.value.workExperienceList || []
    }

    // 只获取委员会成员信息
    const committeeRes = await getCommitteeMemberByMemberId(id)
    committeeMember.value = committeeRes.success ? committeeRes.data : null
  } catch {
    educationList.value = []
    workList.value = []
    committeeMember.value = null
  }
}

watch(
  () => memberId.value,
  (newMemberId) => {
    if (newMemberId > 0) {
      void loadExtraProfile()
    }
  },
  { immediate: true }
)

async function onSaved() {
  await fetchMemberSingle(true)
  await loadExtraProfile()
}

function handleApply() {
  const path = isCompanyMember.value ? '/apply/profile/company' : '/apply/profile/personal'
  router.push(path)
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state i {
  font-size: 64px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 24px;
}
</style>
