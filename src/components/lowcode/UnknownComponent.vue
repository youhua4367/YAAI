<template>
  <el-alert
    class="unknown-component"
    type="warning"
    :closable="false"
    show-icon
    role="note"
    :title="alertTitle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  componentKey?: string
  nodeName?: string
}>()

const displayKey = computed(() => props.componentKey?.trim() || '—')

const alertTitle = computed(() => {
  const name = props.nodeName?.trim()
  return name
    ? `未知组件错误：${displayKey.value}（${name}）`
    : `未知组件错误：${displayKey.value}`
})
</script>

<style scoped>
.unknown-component {
  margin: 12px 0;
}
</style>
