<template>
  <div class="news-container">
    <div class="card news-sub-card">
      <div class="card-header">
        <div class="header-main">
          <span class="title-icon blue"></span>
          <h3>新闻公告</h3>
        </div>
        <router-link :to="noticeMorePath" class="more-link">更多</router-link>
      </div>
      <ul class="fancy-list" v-if="noticeItems.length">
        <li v-for="item in noticeItems" :key="item.id">
          <router-link :to="contentPath(item.id)" class="list-content">
            <span class="title-text">{{ item.title }}</span>
            <span class="date-tag">{{ listDateShort(item.publishTime) }}</span>
          </router-link>
        </li>
      </ul>
      <div v-else class="empty-state">暂无新闻公告</div>
    </div>

    <div class="card news-sub-card second-card">
      <div class="card-header">
        <div class="header-main">
          <span class="title-icon blue"></span>
          <h3>学会新闻</h3>
        </div>
        <router-link :to="societyMorePath" class="more-link">更多</router-link>
      </div>
      <ul class="fancy-list" v-if="societyItems.length">
        <li v-for="item in societyItems" :key="item.id">
          <router-link :to="contentPath(item.id)" class="list-content">
            <span class="title-text">{{ item.title }}</span>
            <span class="date-tag">{{ listDateShort(item.publishTime) }}</span>
          </router-link>
        </li>
      </ul>
      <div v-else class="empty-state">暂无学会新闻</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { NewsItem } from '@/types/news'
import { fetchNewsListByCategoryId } from '@/api/news'
import { useNewsCategoryStore } from '@/stores/newsCategory'
import { contentPath } from '@/utils/contentRoute'

const categoryStore = useNewsCategoryStore()

const noticeItems = ref<NewsItem[]>([])
const societyItems = ref<NewsItem[]>([])

// 与后台 news_category.code 对应（通知公告 / 学会新闻）
const noticeMorePath = computed(() => {
  const id = categoryStore.categoryIdByCode('notice_category')
  return id != null ? `/news/c/${id}` : '/news'
})

const societyMorePath = computed(() => {
  const id = categoryStore.categoryIdByCode('news_category_xhxw')
  return id != null ? `/news/c/${id}` : '/news'
})

function listDateShort(publishTime: string | null | undefined): string {
  if (!publishTime || publishTime.length < 10) return ''
  return publishTime.substring(5)
}

onMounted(async () => {
  await categoryStore.ensureLoaded()
  const noticeId = categoryStore.categoryIdByCode('notice_category')
  const societyId = categoryStore.categoryIdByCode('news_category_xhxw')
  const [noticeList, societyList] = await Promise.all([
    noticeId != null ? fetchNewsListByCategoryId(noticeId) : Promise.resolve([]),
    societyId != null ? fetchNewsListByCategoryId(societyId) : Promise.resolve([])
  ])
  noticeItems.value = noticeList.slice(0, 10)
  societyItems.value = societyList.slice(0, 10)
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
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
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
.title-icon.blue { background: #0c4da2; }

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
