<template>
  <div class="content-detail-page">
    <transition name="fade-slide" mode="out-in">
      <!-- 详情内容 -->
      <div class="news-api-wrap" v-if="newsItem" :key="newsItem.id">
        <div class="news-card">
          <figure v-if="coverSrc" class="news-cover">
            <img :src="coverSrc" :alt="newsItem.title" loading="lazy" />
          </figure>

          <div class="news-api-inner">
            <header class="news-api-head">
              <h1 class="news-api-title">{{ newsItem.title }}</h1>
              <p v-if="summaryText" class="news-api-summary">{{ summaryText }}</p>

              <div v-if="newsItem.author || newsItem.publishTime" class="news-api-meta">
                <div v-if="newsItem.author" class="meta-item">
                  <span class="meta-dot author"></span>
                  <span class="meta-label">作者</span>
                  <span class="meta-val">{{ newsItem.author }}</span>
                </div>
                <div v-if="newsItem.publishTime" class="meta-item">
                  <span class="meta-dot time"></span>
                  <span class="meta-label">发布</span>
                  <span class="meta-val">{{ formatDate(newsItem.publishTime) }}</span>
                </div>
              </div>
            </header>

            <div class="news-api-divider">
              <span class="divider-icon"></span>
            </div>

            <article class="news-api-body rich-text" v-html="newsItem.content ?? ''" />

            <aside v-if="remarkText" class="news-api-remark">
              <div class="remark-icon">💡</div>
              <div class="remark-content">
                <span class="remark-label">备注</span>
                <p class="remark-body">{{ remarkText }}</p>
              </div>
            </aside>

            <footer v-if="newsItem.createdAt || newsItem.updatedAt" class="news-api-footer-meta">
              <p v-if="newsItem.createdAt">创建于 {{ formatDate(newsItem.createdAt) }}</p>
              <p v-if="newsItem.updatedAt">最后更新于 {{ formatDate(newsItem.updatedAt) }}</p>
            </footer>
          </div>
        </div>
      </div>

      <!-- 加载中 -->
      <div class="state-container" v-else-if="loading" key="loading">
        <div class="loader">
          <div class="spinner"></div>
          <p>正在为您加载内容...</p>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="state-container" v-else key="empty">
        <div class="empty-box">
          <div class="empty-icon">📂</div>
          <p>抱歉，未找到相关内容</p>
          <button @click="$router.back()" class="back-btn">返回上一页</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsById } from '@/api/news'
import type { NewsItem } from '@/types/news'

const route = useRoute()

const newsItem = ref<NewsItem | null>(null)
const loading = ref(false)

function resolvePublicUrl(path: string | null | undefined): string {
  if (!path?.trim()) return ''
  const p = path.trim()
  if (/^https?:\/\//i.test(p)) return p
  return p.startsWith('/') ? p : `/${p}`
}

const coverSrc = computed(() => resolvePublicUrl(newsItem.value?.coverImage))
const summaryText = computed(() => {
  const s = newsItem.value?.summary
  if (s == null || String(s).trim() === '') return ''
  return String(s).trim()
})

const remarkText = computed(() => {
  const r = newsItem.value?.remark
  if (r == null || String(r).trim() === '') return ''
  return String(r).trim()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadContent() {
  const raw = route.params.id as string
  newsItem.value = null
  if (!raw || !/^\d+$/.test(raw) || Number(raw) <= 0) {
    return
  }
  loading.value = true
  try {
    const res = await getNewsById(Number(raw))
    newsItem.value = res.success && res.data ? res.data : null
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, loadContent, { immediate: true })
</script>

<style scoped>
/* 核心变量 */
:host {
  --primary-color: #2563eb;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --bg-subtle: #f8fafc;
  --border-color: #f1f5f9;
  --shadow-sm: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05);
}

.content-detail-page {
  min-height: 100vh;
  background-color: #f6f9fc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.05) 0px, transparent 50%);
  padding: 40px 20px 100px;
}

.news-api-wrap {
  max-width: 900px;
  margin: 0 auto;
}

.news-card {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* 封面图美化 */
.news-cover {
  margin: 0;
  width: 100%;
  aspect-ratio: 21 / 9;
  overflow: hidden;
  background: #e2e8f0;
}

.news-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-card:hover .news-cover img {
  transform: scale(1.02);
}

/* 头部内容排版 */
.news-api-inner {
  padding: 48px 60px;
}

.news-api-title {
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 850;
  color: #0f172a;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  text-align: left;
}

.news-api-summary {
  font-size: 18px;
  color: #475569;
  line-height: 1.6;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  border-left: 4px solid #2563eb;
  margin-bottom: 32px;
}

/* 元数据标签 */
.news-api-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.meta-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}
.meta-dot.author { background: #6366f1; box-shadow: 0 0 10px rgba(99, 102, 241, 0.4); }
.meta-dot.time { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }

.meta-label { color: #94a3b8; margin-right: 6px; }
.meta-val { color: #1e293b; font-weight: 600; }

/* 分割线 */
.news-api-divider {
  position: relative;
  height: 1px;
  background: #f1f5f9;
  margin: 40px 0;
}
.divider-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 4px;
  background: #2563eb;
  border-radius: 2px;
}

/* 正文样式 */
.news-api-body {
  font-size: 18px;
  line-height: 1.85;
  color: #334155;
  letter-spacing: 0.01em;
}

.rich-text :deep(p) {
  margin-bottom: 1.5em;
}

.rich-text :deep(h2) {
  font-size: 26px;
  margin: 2em 0 1em;
  color: #0f172a;
  display: flex;
  align-items: center;
}

.rich-text :deep(h2::before) {
  content: "";
  width: 4px;
  height: 24px;
  background: #2563eb;
  margin-right: 12px;
  border-radius: 2px;
}

/* 备注板块 */
.news-api-remark {
  margin-top: 60px;
  padding: 24px;
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 20px;
  display: flex;
  gap: 16px;
}
.remark-icon { font-size: 24px; }
.remark-label { font-weight: 700; color: #92400e; font-size: 13px; text-transform: uppercase; }
.remark-body { color: #b45309; margin-top: 4px; font-size: 15px; }

/* 底部 */
.news-api-footer-meta {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px dotted #e2e8f0;
  color: #94a3b8;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
}

/* 状态页美化 */
.state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  margin: 0 auto 20px;
}

.back-btn {
  margin-top: 24px;
  padding: 10px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}
.back-btn:hover { background: #1d4ed8; transform: translateY(-2px); }

/* 动画 */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes spin { to { transform: rotate(360deg); } }

/* 移动端适配 */
@media (max-width: 768px) {
  .content-detail-page { padding: 0 0 60px; }
  .news-card { border-radius: 0; box-shadow: none; }
  .news-api-inner { padding: 30px 20px; }
  .news-api-meta { flex-direction: column; gap: 12px; }
  .news-api-footer-meta { flex-direction: column; gap: 8px; }
}
</style>