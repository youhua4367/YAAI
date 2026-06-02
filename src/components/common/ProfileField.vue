<template>
  <span :class="fieldClass">{{ text }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  displayBlockValue,
  displayValue,
  emptyBlockClass,
  emptyFieldClass,
  formatDateValue
} from '@/utils/memberDisplay'

const props = defineProps<{
  value?: string | null
  /** 无档案字段时的回退（如账号用户名） */
  fallback?: string
  /** 长文本块：空时显示「暂无」 */
  block?: boolean
  /** 按日期格式化 */
  date?: boolean
}>()

const fieldClass = computed(() =>
  props.block ? emptyBlockClass(props.value) : emptyFieldClass(props.value)
)

const text = computed(() => {
  if (props.date) return formatDateValue(props.value)
  if (props.block) return displayBlockValue(props.value)
  return displayValue(props.value, props.fallback)
})
</script>

<style scoped>
.field-empty {
  color: #cbd5e1;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.field-empty-block {
  color: #94a3b8;
  font-weight: 400;
}
</style>
