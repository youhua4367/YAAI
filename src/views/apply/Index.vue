<template>
  <div class="apply-page">
    <div class="apply-banner">
      <div class="container">
        <div class="step-bar">
          <div v-for="(step, index) in steps" :key="step" class="step-item" :class="{ active: currentStep >= index + 1, completed: currentStep > index + 1 }">
            <div class="step-circle">{{ index + 1 }}</div>
            <div class="step-label">{{ step }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="apply-content">
      <div class="container">
        <div class="step-panel" :class="{ 'success-panel': currentStep === maxStep }">
          <Step1 v-if="currentStep === 1" @next="goNextStepFrom(1)" />
          <Step2 v-else-if="currentStep === 2" @prev="goPrevStepFrom(2)" @next="goNextStepFrom(2)" />
          <Step3
            v-else-if="currentStep === 3"
            v-model="profileForm"
            :member-type="memberType"
            @prev="goPrevStepFrom(3)"
            @member-type-change="handleMemberTypeChange"
            @success="handleSuccess"
          />
          <Step4 v-else />
        </div>
      </div>
    </div>

    <div class="apply-footer">
      <div class="container">
        <p>{{ layout.footerTips }}</p>
        <p>{{ layout.footerCopyright }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { APPLY_LAYOUT } from '@/config/apply'
import type { ApplyProfileFormModel } from '@/types/apply'
import Step1 from './components/Step1.vue'
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'
import Step4 from './components/Step4.vue'

const layout = APPLY_LAYOUT

const steps = ['入会须知', '注册账号', '填写资料', '提交成功'] as const
const maxStep = steps.length
const maxReachableStep = ref(1)

const route = useRoute()
const router = useRouter()

const parseStepFromRoute = (value: unknown) => {
  const match = String(value ?? 'step1').match(/^step(\d+)$/)
  const step = Number(match?.[1] ?? 1)
  if (Number.isNaN(step) || step < 1) return 1
  if (step > maxStep) return maxStep
  return step
}

const currentStep = computed(() => parseStepFromRoute(route.params.step))

const goStep = async (step: number) => {
  await router.replace(`/apply/step${step}`)
}

// watch(
//   currentStep,
//   async (step) => {
//     if (step > maxReachableStep.value) {
//       await goStep(maxReachableStep.value)
//     }
//   },
//   { immediate: true }
// )

const memberType = ref<'personal' | 'organization'>('personal')

const profileForm = ref<ApplyProfileFormModel>({
  type: 'personal',
  committeeId: 0,
  categoryId: 0,
  joinMethod: '',
  auditStatus: '',
  membershipStatus: '',
  interestCommittees: [],
  recommender: '',
  img: '',
  name: '',
  gender: '',
  idCardType: '',
  idCardNumber: '',
  birthDate: '',
  country: '',
  nativePlace: '',
  nationality: '',
  politicalOutlook: '',
  address: '',
  postalCode: '',
  contactPhone: '',
  landlinePhone: '',
  jobTitle: '',
  industry: '',
  workUnit: '',
  workDepartment: '',
  position: '',
  workContent: '',
  highestEducation: '',
  major: '',
  educationExperiences: [],
  workExperiences: [],
  researchDirection: '',
  publication: '',
  honors: '',
  projectExperience: '',
  areaCode: '',
  reviewActivities: []
})

const goNextStepFrom = async (fromStep: number) => {
  const next = Math.min(fromStep + 1, maxStep)
  if (next > maxReachableStep.value) {
    maxReachableStep.value = next
  }
  await goStep(next)
}

const goPrevStepFrom = async (fromStep: number) => {
  const prev = Math.max(fromStep - 1, 1)
  await goStep(prev)
}

const handleSuccess = async () => {
  await goNextStepFrom(3)
}

const handleMemberTypeChange = (type: 'personal' | 'organization') => {
  memberType.value = type
}
</script>

<style scoped>
/* 1. 基础布局 - 引入更现代的字体栈 */
.apply-page {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 3. Banner - 增加深度感 */
.apply-banner {
  background: #0c4da2 linear-gradient(160deg, #0c4da2 0%, #1a6bc4 100%);
  padding: 60px 0 100px;
  position: relative;
  overflow: hidden;
}

/* 装饰性光晕 */
.apply-banner::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.step-bar {
  display: flex;
  justify-content: space-between;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.step-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* 优化后的连线逻辑 */
.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  z-index: -1;
  transition: background 0.4s ease;
}

.step-item.completed:not(:last-child)::after {
  background: #fff;
}

.step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-item.active .step-circle {
  background: #fff;
  color: #0c4da2;
  border-color: #fff;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.step-item.completed .step-circle {
  background: #fff;
  color: #10b981;
  border-color: #fff;
}

.step-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.step-item.active .step-label,
.step-item.completed .step-label {
  color: #fff;
}

/* 4. 内容容器 - 负边距浮动 */
.apply-content {
  flex: 1;
  padding-bottom: 60px;
  z-index: 10;
}

.apply-content .container {
  max-width: 1060px;
  margin: -50px auto 0; /* 向上偏移 */
  padding: 0 24px;
}

.step-panel {
  background: #fff;
  border-radius: 16px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.05),
    0 10px 10px -5px rgba(0, 0, 0, 0.02);
  padding: 48px;
  min-height: 500px;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

/* 5. 底部美化 - 沉稳色调 */
.apply-footer {
  background: #1e293b;
  color: #94a3b8;
  padding: 32px 0;
  text-align: center;
  font-size: 13px;
  line-height: 1.8;
}

/* 6. 响应式适配 */
@media (max-width: 768px) {
  .step-bar {
    gap: 0;
  }
  .step-label {
    font-size: 12px;
    transform: scale(0.9);
  }
  .step-item:not(:last-child)::after {
    height: 1px;
  }
  .step-panel {
    padding: 24px;
    margin-top: -40px;
  }
}
</style>
