<template>
  <ContentList v-if="showNewsList" :items="items" :basePath="listBasePath" />
  <div v-else class="channel-placeholder">
    <h2 class="channel-placeholder__title">{{ title }}</h2>
    <p class="channel-placeholder__hint">暂无内容</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ContentList from '@/components/common/ContentList.vue'
import { useNewsListByCategoryId } from '@/composables/useNewsListByCategoryId'
import { useNewsCategoryStore } from '@/stores/newsCategory'
import { useSitePagesStore } from '@/stores/sitePages'
import {
  buildNewsCategoryPath,
  parseCategoryIdFromRoute
} from '@/utils/newsCategoryRoute'

const props = defineProps<{
  title?: string
  /** 低代码 node-tree 绑定的 news_category.id */
  dataBindingId?: number | null
}>()

const route = useRoute()
const newsCategoryStore = useNewsCategoryStore()
const sitePagesStore = useSitePagesStore()

const pageId = computed(() => route.meta.pageId as number | undefined)

const page = computed(() =>
  pageId.value != null
    ? sitePagesStore.enabledPages.find((p) => p.id === pageId.value)
    : undefined
)

const title = computed(() => {
  const categoryId = newsCategoryId.value
  if (categoryId > 0) {
    const category = newsCategoryStore.categoryById(categoryId)
    if (category?.name) return category.name
  }
  return (
    props.title?.trim() ||
    (route.meta.pageTitle as string) ||
    page.value?.title ||
    page.value?.name ||
    '栏目'
  )
})

/** 当前选中的 news_category.id（来自 query 或低代码 dataBindingId） */
const newsCategoryId = computed(() => {
  const fromRoute = parseCategoryIdFromRoute(route)
  if (fromRoute > 0) return fromRoute
  if (props.dataBindingId != null && props.dataBindingId > 0) return props.dataBindingId
  return -1
})

const showNewsList = computed(() => newsCategoryId.value > 0)

const { items } = useNewsListByCategoryId(newsCategoryId)

const listBasePath = computed(() => {
  const base = page.value?.path ?? route.path
  const id = newsCategoryId.value
  return id > 0 ? buildNewsCategoryPath(base, id) : route.fullPath
})

onMounted(() => {
  void newsCategoryStore.ensureLoaded()
})
</script>

<style scoped>
.channel-placeholder {
  padding: 24px 0;
}

.channel-placeholder__title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.channel-placeholder__hint {
  color: #94a3b8;
  font-size: 14px;
}
</style>
