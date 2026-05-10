<template>
  <div class="card notice-card">
    <div class="card-header">
      <div class="title-wrapper">
        <div class="icon-pulse">
          <svg class="notice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span class="pulse-ring"></span>
        </div>
        <h3>通知公告</h3>
      </div>
      <router-link :to="noticeMorePath" class="more-link">
        <span class="more-text">更多</span>
        <span class="more-arrow">+</span>
      </router-link>
    </div>
    
    <div class="notice-list-wrapper">
      <ul v-if="notices.length" class="notice-list">
        <li
          v-for="(item, index) in notices"
          :key="item.link"
          class="notice-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <router-link :to="item.link" class="notice-link">
            <div class="date-badge">
              <span class="day">{{ dateParts(item.date).day }}</span>
              <span class="month">{{ dateParts(item.date).month }}</span>
              <div class="date-glow"></div>
            </div>
            <div class="notice-content">
              <span class="notice-title">{{ item.title }}</span>
              <span class="notice-arrow">→</span>
            </div>
          </router-link>
        </li>
      </ul>
      <p v-else class="notice-empty">暂无通知公告</p>
    </div>
    
    <!-- 装饰线条 -->
    <div class="decor-accent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchNewsListByCategoryId } from '@/api/news'
import { contentPath } from '@/utils/contentRoute'
import { useNewsCategoryStore } from '@/stores/newsCategory'
import type { NewsItem } from '@/types/news'

const categoryStore = useNewsCategoryStore()

const notices = ref<{ title: string; date: string; link: string }[]>([])

const noticeMorePath = computed(() => {
  const id = categoryStore.categoryIdByCode('notice_category')
  return id != null ? `/news/c/${id}` : '/news'
})

function listDateYmd(publishTime: string | null | undefined): string {
  if (!publishTime || publishTime.length < 10) return ''
  return publishTime.substring(0, 10)
}

function dateParts(ymd: string): { day: string; month: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd)
  if (!m) return { day: '—', month: '--' }
  return { day: m[3].replace(/^0/, '') || m[3], month: `${Number(m[2])}月` }
}

onMounted(async () => {
  await categoryStore.ensureLoaded()
  const noticeId = categoryStore.categoryIdByCode('notice_category')
  if (noticeId == null) return
  const list: NewsItem[] = await fetchNewsListByCategoryId(noticeId)
  notices.value = list.slice(0, 5).map((item) => ({
    title: item.title,
    date: listDateYmd(item.publishTime ?? undefined) || '—',
    link: contentPath(item.id)
  }))
})
</script>

<style scoped>
.notice-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.notice-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 0 30px rgba(12, 77, 162, 0.08);
}

/* 头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  position: relative;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 图标脉冲动画 */
.icon-pulse {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-icon {
  width: 24px;
  height: 24px;
  color: #0c4da2;
  position: relative;
  z-index: 2;
}

.pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(12, 77, 162, 0.1);
  animation: pulse 2s ease-out infinite;
}

.pulse-ring::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(12, 77, 162, 0.2);
  animation: pulse 2s ease-out infinite 0.5s;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.title-wrapper h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  position: relative;
}

/* 更多链接 */
.more-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.more-link:hover {
  color: #0c4da2;
  background: rgba(12, 77, 162, 0.08);
}

.more-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #e2e8f0;
  border-radius: 50%;
  font-size: 12px;
  transition: all 0.3s ease;
}

.more-link:hover .more-arrow {
  background: #0c4da2;
  color: white;
  transform: rotate(90deg);
}

/* 列表区域 */
.notice-list-wrapper {
  padding: 8px 0;
}

.notice-empty {
  margin: 0;
  padding: 40px 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-item {
  opacity: 0;
  transform: translateX(-20px);
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notice-link {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  text-decoration: none;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
}

.notice-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #0c4da2, #3b82f6);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.notice-link:hover {
  background: linear-gradient(90deg, rgba(12, 77, 162, 0.03), transparent);
}

.notice-link:hover::before {
  transform: scaleY(1);
}

/* 日期徽章 */
.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 12px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.notice-link:hover .date-badge {
  background: linear-gradient(135deg, #0c4da2 0%, #3b82f6 100%);
  transform: scale(1.05);
}

.date-badge .day {
  font-size: 20px;
  font-weight: 700;
  color: #0c4da2;
  line-height: 1;
  transition: color 0.3s ease;
}

.date-badge .month {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
  transition: color 0.3s ease;
}

.notice-link:hover .day,
.notice-link:hover .month {
  color: white;
}

.date-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.notice-link:hover .date-glow {
  opacity: 1;
}

/* 内容区域 */
.notice-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.notice-title {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.notice-link:hover .notice-title {
  color: #0c4da2;
}

.notice-arrow {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 12px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.notice-link:hover .notice-arrow {
  opacity: 1;
  transform: translateX(0);
  color: #0c4da2;
}

/* 装饰线条 */
.decor-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #0c4da2, #3b82f6, #0c4da2);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 响应式 */
@media (max-width: 768px) {
  .card-header {
    padding: 20px;
  }

  .notice-link {
    padding: 14px 20px;
  }

  .date-badge {
    width: 48px;
    height: 48px;
  }

  .date-badge .day {
    font-size: 18px;
  }
}
</style>
