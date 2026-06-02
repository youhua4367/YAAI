<template>
  <div class="card services-card">
    <div class="card-header">
      <div class="title-group">
        <span class="title-decorator"></span>
        <h3 v-if="sectionTitle">{{ sectionTitle }}</h3>
      </div>
      <router-link v-if="moreLink" :to="moreLink" class="more-link">
        查看全部 <span class="arrow">→</span>
      </router-link>
    </div>

    <div v-if="loading" class="services-loading">加载中…</div>
    <div v-else-if="services.length" class="services-grid">
      <router-link
        v-for="service in services"
        :key="service.id"
        :to="service.link"
        class="service-item"
      >
        <div class="hover-indicator"></div>

        <div class="service-icon-wrapper">
          <div class="icon-bg"></div>
          <img :src="service.icon" :alt="service.title" class="main-icon" loading="lazy" />
        </div>

        <div class="service-info">
          <h4>{{ service.title }}</h4>
          <p>{{ service.description }}</p>
        </div>
      </router-link>
    </div>
    <el-empty v-else description="暂无服务" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { fetchNewsByIds } from '@/api/news'
import type { HomeServiceDisplayItem } from '@/types/homeSection'
import type { NewsItem } from '@/types/news'
import { contentPath } from '@/utils/contentRoute'
import { normalizeContentIds } from '@/utils/contentIds'
import { resolveSectionTitle } from '@/utils/sectionTitle'

const props = defineProps<{
  nodeName?: string
  title?: string
  moreLink?: string
  contentIds?: number[]
}>()

const DEFAULT_ICON =
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop'

const loading = ref(false)
const services = ref<HomeServiceDisplayItem[]>([])

const sectionTitle = computed(() => resolveSectionTitle(props.nodeName, props.title))
const moreLink = computed(() => props.moreLink?.trim() || '/services')
const ids = computed(() => normalizeContentIds(props.contentIds))

function coverSrc(raw: string | null | undefined): string {
  const text = raw?.trim()
  if (!text) return DEFAULT_ICON
  if (/^https?:\/\//i.test(text)) return text
  return text.startsWith('/') ? text : `/${text}`
}

function mapNewsToService(item: NewsItem): HomeServiceDisplayItem {
  return {
    id: item.id,
    title: item.title?.trim() || '服务',
    description: item.summary?.trim() || '',
    icon: coverSrc(item.coverImage),
    link: contentPath(item.id)
  }
}

async function loadServices() {
  if (!ids.value.length) {
    services.value = []
    return
  }

  loading.value = true
  try {
    const list = await fetchNewsByIds(ids.value)
    services.value = list.map(mapNewsToService)
  } catch {
    services.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadServices()
})

watch(ids, () => {
  void loadServices()
})
</script>

<style scoped>
.services-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 28px;
  border-bottom: 1px solid #f1f5f9;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-decorator {
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
  letter-spacing: 0.5px;
}

.more-link {
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-link:hover {
  color: #0c4da2;
  transform: translateX(3px);
}

.services-loading {
  padding: 48px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #f1f5f9;
  padding: 0;
}

.service-item {
  position: relative;
  text-decoration: none;
  background: #fff;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-item:hover {
  background: #f8fafc;
  z-index: 1;
  box-shadow: 0 10px 30px rgba(12, 77, 162, 0.08);
}

.hover-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #0c4da2;
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.service-item:hover .hover-indicator {
  transform: scaleX(1);
}

.service-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bg {
  position: absolute;
  inset: 0;
  background: #f0f7ff;
  border-radius: 50%;
  transition: all 0.4s ease;
}

.service-item:hover .icon-bg {
  background: #0c4da2;
  transform: scale(1.1) rotate(15deg);
  border-radius: 18px;
}

.main-icon {
  position: relative;
  z-index: 2;
  width: 44px;
  height: 44px;
  object-fit: contain;
  transition: all 0.4s ease;
}

.service-item:hover .main-icon {
  transform: scale(1.1);
  filter: brightness(1.1);
}

.service-item h4 {
  margin: 0 0 12px 0;
  font-size: 17px;
  font-weight: 600;
  color: #334155;
  transition: color 0.3s;
}

.service-item:hover h4 {
  color: #0c4da2;
}

.service-item p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  padding: 0 10px;
}

@media (max-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-item {
    padding: 30px 20px;
    border-bottom: 1px solid #f1f5f9;
  }
}
</style>
