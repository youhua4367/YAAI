<template>
  <div class="notice-content">
    <h2 class="notice-title">{{ notice.title }}</h2>
    <p class="notice-date">{{ notice.date }}</p>

    <div class="notice-body">
      <template v-for="section in notice.sections" :key="section.heading || section.paragraphs[0]">
        <h3 v-if="section.heading">{{ section.heading }}</h3>
        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </template>
    </div>
  </div>
  <div class="step-actions">
    <button class="btn btn-primary" @click="$emit('next')">{{ notice.nextText }}</button>
  </div>
</template>

<script setup lang="ts">
import { APPLY_NOTICE } from '@/config/apply'

defineEmits<{ next: [] }>()
const notice = APPLY_NOTICE
</script>

<style scoped>
.notice-content {
  max-width: 800px;
  margin: 0 auto;
}

.notice-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}

.notice-date {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 32px;
}

.notice-body {
  line-height: 1.8;
  color: #333;
}

.notice-body h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #17345f;
}

.notice-body p {
  margin-bottom: 12px;
  text-indent: 2em;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.btn {
  padding: 12px 32px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: #0c4da2;
  color: #fff;
}
</style>
