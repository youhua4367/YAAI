<!-- 低代码 componentKey: news_list -->
<template>
  <ContentList
    v-if="showNewsList"
    :items="items"
    :loading="loading"
    :current-page="currentPage"
    :total-pages="totalPages"
    :base-path="listBasePath"
    @update:page="goToPage"
  />
  <Empty v-else />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import ContentList from '@/components/common/ContentList.vue'
import Empty from '@/views/page/Empty.vue'
import { useNewsListByCategoryId } from '@/composables/useNewsListByCategoryId'
import { usePageContext } from '@/composables/usePageContext'
import { useNewsCategoryStore } from '@/stores/newsCategory'
import {
  buildNewsCategoryPath,
  parseCategoryIdFromRoute,
  parsePageFromRoute
} from '@/utils/newsCategoryRoute'

const props = defineProps<{
  title?: string
  pageSize?: number
  /** 低代码 node-tree 绑定的 news_category.id */
  dataBindingId?: number | null
}>()

const router = useRouter()
const { route, page, activeCategory } = usePageContext()
const newsCategoryStore = useNewsCategoryStore()

const pageSizeRef = toRef(props, 'pageSize')

const newsCategoryId = computed(() => {
  const fromRoute = parseCategoryIdFromRoute(route)
  if (fromRoute > 0) return fromRoute
  if (props.dataBindingId != null && props.dataBindingId > 0) return props.dataBindingId
  return -1
})

const currentPage = computed(() => parsePageFromRoute(route))

const showNewsList = computed(() => newsCategoryId.value > 0)

const { items, totalPages, loading } = useNewsListByCategoryId(
  newsCategoryId,
  currentPage,
  pageSizeRef
)

const listBasePath = computed(() => {
  const base = page.value?.path ?? route.path
  const id = newsCategoryId.value
  return id > 0 ? buildNewsCategoryPath(base, id, currentPage.value) : route.fullPath
})

function goToPage(pageNum: number) {
  const id = newsCategoryId.value
  if (id <= 0) return

  const base = page.value?.path ?? route.path
  const maxPage = totalPages.value
  const target =
    maxPage > 0 ? Math.min(Math.max(1, pageNum), maxPage) : Math.max(1, pageNum)

  router.push(buildNewsCategoryPath(base, id, target))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const prevCategoryId = ref(newsCategoryId.value)

watch(newsCategoryId, (id) => {
  if (id !== prevCategoryId.value && currentPage.value > 1) {
    goToPage(1)
  }
  prevCategoryId.value = id
})

watch(totalPages, (maxPage) => {
  if (maxPage > 0 && currentPage.value > maxPage) {
    goToPage(maxPage)
  }
})

onMounted(() => {
  void newsCategoryStore.ensureLoaded()
})
</script>
