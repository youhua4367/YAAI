<template>
  <div class="unknown-component" role="note">
    [未知组件: {{ displayKey }}<template v-if="nodeName"> ({{ nodeName }})</template>]
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  componentKey?: string
  nodeName?: string
}>()

const displayKey = computed(() => props.componentKey?.trim() || '—')
</script>

<style scoped>
.unknown-component {
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}
</style>
