<template>
  <div class="lowcode-container" :style="containerStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  layout?: Record<string, unknown>
}>()

const containerStyle = computed(() => {
  const layout = props.layout ?? {}
  const style: Record<string, string> = {}

  if (layout.maxWidth != null && layout.maxWidth !== '') {
    const maxWidth = layout.maxWidth
    style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : String(maxWidth)
  }

  if (layout.center === true) {
    style.marginLeft = 'auto'
    style.marginRight = 'auto'
  }

  return style
})
</script>

<style scoped>
.lowcode-container {
  width: 100%;
}
</style>
