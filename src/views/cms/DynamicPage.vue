<template>
  <div class="dynamic-page">
    <div class="container">
      <h1 class="dynamic-page__title">{{ displayTitle }}</h1>
      <p v-if="page" class="dynamic-page__meta">路径：{{ page.path }}</p>
      <p class="dynamic-page__hint">该页面由后台页面配置生成，内容渲染（render-tree）后续接入。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSitePagesStore } from '@/stores/sitePages'

const route = useRoute()
const sitePagesStore = useSitePagesStore()

const page = computed(() => {
  const id = route.meta.pageId as number | undefined
  if (id) {
    return sitePagesStore.enabledPages.find((p) => p.id === id)
  }
  return sitePagesStore.pageByPath(route.path)
})

const displayTitle = computed(
  () => (route.meta.pageTitle as string) || page.value?.title || page.value?.name || '页面'
)
</script>

<style scoped>
.dynamic-page {
  padding: 48px 0 80px;
  min-height: 50vh;
  background: #f8fafc;
}

.dynamic-page__title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.dynamic-page__meta {
  color: #64748b;
  margin-bottom: 16px;
}

.dynamic-page__hint {
  color: #94a3b8;
  font-size: 14px;
}
</style>
