<template>
  <div class="news-container">
    <div class="card news-sub-card">
      <div class="card-header">
        <div class="header-main">
          <span class="title-icon blue"></span>
          <h3 v-if="panelTitle">{{ panelTitle }}</h3>
        </div>
        <router-link :to="morePath" class="more-link">更多</router-link>
      </div>
      <ul v-if="items.length" class="fancy-list">
        <li v-for="item in items" :key="item.id">
          <router-link :to="contentPath(item.id)" class="list-content">
            <span class="title-text">{{ item.title }}</span>
            <span class="date-tag">{{ listDateShort(item.publishTime) }}</span>
          </router-link>
        </li>
      </ul>
      <div v-else class="empty-state">暂无新闻</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { NewsItem } from '@/types/news'
import { fetchLatestNews } from '@/api/news'
import { useSitePaths } from '@/composables/useSitePaths'
import { contentPath } from '@/utils/contentRoute'
import { resolveSectionTitle } from '@/utils/sectionTitle'

const LIST_LIMIT = 10

const props = defineProps<{
  nodeName?: string
  title?: string
}>()

const panelTitle = computed(() => resolveSectionTitle(props.nodeName, props.title))

const { newsListPath } = useSitePaths()
const items = ref<NewsItem[]>([])

const morePath = computed(() => newsListPath() || '/news')

function listDateShort(publishTime: string | null | undefined): string {
  if (!publishTime || publishTime.length < 10) return ''
  return publishTime.substring(5)
}

async function loadLatest() {
  items.value = await fetchLatestNews(LIST_LIMIT)
}

onMounted(() => {
  void loadLatest()
})
</script>

<style scoped>
.news-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-sub-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #eef2f7;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f8fafc;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-main h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.title-icon {
  width: 3px;
  height: 16px;
  border-radius: 2px;
}
.title-icon.blue {
  background: #0c4da2;
}

.more-link {
  font-size: 13px;
  color: #94a3b8;
  text-decoration: none;
}

.fancy-list {
  list-style: none;
  padding: 10px 0;
  margin: 0;
}

.list-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.list-content:hover {
  background-color: #f0f7ff;
}

.title-text {
  font-size: 14px;
  color: #475569;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 15px;
}

.list-content:hover .title-text {
  color: #0c4da2;
  transform: translateX(4px);
}

.date-tag {
  font-size: 12px;
  color: #cbd5e1;
  font-family: monospace;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}
</style>
