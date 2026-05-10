<template>
  <ContentList :items="items" :basePath="listBasePath" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ContentList from '@/components/common/ContentList.vue'
import { useNewsListByCategoryId } from '@/composables/useNewsListByCategoryId'

const route = useRoute()

// 路由 `/news/c/:categoryId` 与 GET /news 的 categoryId 一致
const categoryId = computed(() => {
  const n = Number.parseInt(String(route.params.categoryId), 10)
  return Number.isFinite(n) ? n : -1
})

const { items } = useNewsListByCategoryId(categoryId)

const listBasePath = computed(() => `/news/c/${categoryId.value}`)
</script>

<style scoped>
/* 继承 ContentList */
</style>
