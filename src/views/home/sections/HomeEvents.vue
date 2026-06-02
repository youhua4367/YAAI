<template>
  <div class="card events-section">
    <div class="card-header">
      <div class="title-area">
        <span class="decorator"></span>
        <h3 v-if="sectionTitle">{{ sectionTitle }}</h3>
      </div>
      <router-link v-if="moreLink" :to="moreLink" class="more-btn">
        更多精彩 <span class="arrow">→</span>
      </router-link>
    </div>

    <div v-if="loading" class="events-loading">加载中…</div>
    <div v-else-if="events.length" class="events-grid">
      <router-link
        v-for="event in events"
        :key="event.id"
        :to="event.link"
        class="event-card"
      >
        <div class="event-image-box">
          <img :src="event.image" :alt="event.title" loading="lazy" />
          <div class="event-tag">{{ eventTag }}</div>
          <div class="image-overlay">
            <span class="view-btn">查看详情</span>
          </div>
        </div>

        <div class="event-content">
          <h4 class="event-title">{{ event.title }}</h4>
          <div class="event-meta">
            <p v-if="event.date" class="meta-item">{{ event.date }}</p>
            <p v-if="event.location" class="meta-item">{{ event.location }}</p>
          </div>
        </div>
      </router-link>
    </div>
    <el-empty v-else description="暂无活动" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { fetchNewsByIds } from '@/api/news'
import type { HomeEventDisplayItem } from '@/types/homeSection'
import type { NewsItem } from '@/types/news'
import { contentPath } from '@/utils/contentRoute'
import { normalizeContentIds } from '@/utils/contentIds'
import { resolveSectionTitle } from '@/utils/sectionTitle'

const props = defineProps<{
  nodeName?: string
  title?: string
  moreLink?: string
  tag?: string
  contentIds?: number[]
}>()

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop'

const loading = ref(false)
const events = ref<HomeEventDisplayItem[]>([])

const sectionTitle = computed(() => resolveSectionTitle(props.nodeName, props.title))
const moreLink = computed(() => props.moreLink?.trim() || '/conference')
const eventTag = computed(() => props.tag?.trim() || '学术会议')
const ids = computed(() => normalizeContentIds(props.contentIds))

function coverSrc(raw: string | null | undefined): string {
  const text = raw?.trim()
  if (!text) return DEFAULT_IMAGE
  if (/^https?:\/\//i.test(text)) return text
  return text.startsWith('/') ? text : `/${text}`
}

function formatEventDate(value: string | null | undefined): string {
  if (!value) return ''
  return value.length >= 10 ? value.substring(0, 10) : value
}

function mapNewsToEvent(item: NewsItem): HomeEventDisplayItem {
  return {
    id: item.id,
    title: item.title?.trim() || '活动',
    date: formatEventDate(item.publishTime),
    location: item.source?.trim() || '',
    image: coverSrc(item.coverImage),
    link: contentPath(item.id)
  }
}

async function loadEvents() {
  if (!ids.value.length) {
    events.value = []
    return
  }

  loading.value = true
  try {
    const list = await fetchNewsByIds(ids.value)
    events.value = list.map(mapNewsToEvent)
  } catch {
    events.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadEvents()
})

watch(ids, () => {
  void loadEvents()
})
</script>

<style scoped>
.events-section {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 28px;
  border-bottom: 1px solid #f1f5f9;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.decorator {
  width: 4px;
  height: 20px;
  background: #0c4da2;
  border-radius: 2px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.more-btn {
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s;
}

.more-btn:hover {
  color: #0c4da2;
}

.events-loading {
  padding: 48px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px;
}

.event-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(12, 77, 162, 0.2);
}

.event-image-box {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.event-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.event-card:hover .event-image-box img {
  transform: scale(1.1);
}

.event-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(12, 77, 162, 0.85);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  z-index: 2;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(12, 77, 162, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover .image-overlay {
  opacity: 1;
}

.view-btn {
  color: #fff;
  border: 1px solid #fff;
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 50px;
}

.event-content {
  padding: 20px;
  flex: 1;
}

.event-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  line-height: 1.5;
  height: 48px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}

.event-card:hover .event-title {
  color: #0c4da2;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
}

.meta-item::before {
  content: '•';
  color: #0c4da2;
  margin-right: 8px;
  font-weight: bold;
}

@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .events-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .event-image-box {
    height: 200px;
  }
}
</style>
