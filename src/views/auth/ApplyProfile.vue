<template>
  <AuthPageLayout>
    <h2 class="auth-card__title">{{ formTitle }}</h2>

    <!-- 个人会员表单 -->
    <PersonalMemberApplyForm
      v-if="memberType === 'personal'"
      :initial-data="null"
      :initial-education="[]"
      :initial-work="[]"
      :initial-committee-member="null"
      @success="onSuccess"
    />

    <!-- 单位会员表单 -->
    <CompanyMemberApplyForm
      v-else-if="memberType === 'company'"
      @success="onSuccess"
    />

    <template #footer>
      <router-link to="/">返回首页</router-link>
    </template>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue'
import PersonalMemberApplyForm from '@/components/user/PersonalMemberApplyForm.vue'
import CompanyMemberApplyForm from '@/components/user/CompanyMemberApplyForm.vue'
import type { MemberType } from '@/types/member'

const router = useRouter()
const route = useRoute()
const userInfo = ref<any>(null)
const memberType = ref<MemberType>('personal')

// 根据会员类型设置标题
const formTitle = computed(() => {
  return memberType.value === 'personal' ? '完善个人会员信息' : '完善单位会员信息'
})

onMounted(() => {
  // 优先从路由 meta 获取会员类型
  const metaMemberType = route.meta.memberType as MemberType
  if (metaMemberType) {
    memberType.value = metaMemberType
  }

})

function onSuccess() {

  // 提示用户等待审核
  alert('信息提交成功，请等待管理员审核。审核期间您可以登录系统查看审核进度。')

  // 跳转到登录页
  router.push('/login')
}
</script>

<style scoped>
.auth-tip {
  text-align: center;
  padding: 40px 20px;
}

.auth-link {
  color: #0c4da2;
  text-decoration: none;
  margin-top: 10px;
  display: inline-block;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
