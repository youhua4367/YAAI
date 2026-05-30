<template>
  <HomeNews v-if="isHomeRoute" v-bind="homePassthroughProps" />
  <div v-else class="news-list-block card">
    <div class="news-list-block__header">
      <span class="news-list-block__decor"></span>
      <h2 class="news-list-block__title">{{ displayTitle }}</h2>
    </div>
    <ul v-if="items.length" class="news-list-block__list">
      <li v-for="item in items" :key="item.id">
        <router-link :to="contentPath(item.id)" class="news-list-block__item">
          <span class="news-list-block__item-title">{{ item.title }}</span>
          <span v-if="showDate && item.publishTime" class="news-list-block__item-date">
            {{ formatDate(item.publishTime) }}
          </span>
        </router-link>
      </li>
    </ul>
    <p v-else-if="!loading" class="news-list-block__empty">暂无新闻</p>
    <p v-else class="news-list-block__empty">加载中…</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import HomeNews from '@/views/home/sections/HomeNews.vue'
import { fetchNewsShowList } from '@/api/news'
import type { NewsItem } from '@/types/news'
import { contentPath } from '@/utils/contentRoute'
import { normalizePagePath } from '@/utils/paths'

const props = withDefaults(
  defineProps<{
    title?: string
    limit?: number
    showDate?: boolean
    dataBindingId?: number | null
  }>(),
  {
    title: '新闻动态',
    limit: 10,
    showDate: true
  }
)

const route = useRoute()
const loading = ref(false)
const items = ref<NewsItem[]>([])

const isHomeRoute = computed(() => normalizePagePath(route.path) === '/')

const displayTitle = computed(() => props.title?.trim() || '新闻动态')

const homePassthroughProps = computed(() => ({
  title: props.title,
  limit: props.limit,
  showDate: props.showDate
}))

function formatDate(value: string): string {
  return value.length >= 10 ? value.substring(0, 10) : value
}

async function loadList(): Promise<void> {
  if (isHomeRoute.value) return

  loading.value = true
  try {
    const res = await fetchNewsShowList({
      page: 1,
      page_size: props.limit ?? 10
    })
    items.value = res.success && res.data?.items ? res.data.items : []
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadList()
})

watch(
  () => [props.limit, props.dataBindingId, route.path] as const,
  () => {
    void loadList()
  }
)
</script>

<style scoped>
.news-list-block {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #eef2f7;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.news-list-block__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid #f8fafc;
}

.news-list-block__decor {
  width: 3px;
  height: 16px;
  border-radius: 2px;
  background: #0c4da2;
}

.news-list-block__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.news-list-block__list {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.news-list-block__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.news-list-block__item:hover {
  background: #f0f7ff;
}

.news-list-block__item-title {
  flex: 1;
  font-size: 14px;
  color: #475569;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-list-block__item:hover .news-list-block__item-title {
  color: #0c4da2;
}

.news-list-block__item-date {
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
  font-family: monospace;
}

.news-list-block__empty {
  margin: 0;
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}
</style>
