<!-- 低代码 componentKey: services_page -->
<template>
  <div class="services-page">
    <div class="services-page__bg" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="services-page__container">
      <header v-if="!isEmptyState" class="services-page__header">
        <h1 class="services-page__title">{{ pageTitle }}</h1>
        <p v-if="subtitle" class="services-page__subtitle">{{ subtitle }}</p>
      </header>

      <nav v-if="categories.length > 1" class="services-page__tabs" aria-label="分类">
        <router-link
          v-for="cat in categories"
          :key="cat.key"
          :to="cat.path"
          class="tab-btn"
          :class="{ 'tab-btn--active': cat.key === activeKey }"
        >
          {{ cat.label }}
        </router-link>
      </nav>

      <div v-if="loading" class="services-page__loading">加载中…</div>

      <Transition v-else name="fade" mode="out-in">
        <div v-if="currentItems.length" :key="activeKey" class="block-grid">
          <article v-for="item in currentItems" :key="item.id" class="content-block">
            <router-link :to="contentPath(item.id)" class="content-block__link">
              <div v-if="coverSrc(item)" class="content-block__cover">
                <img :src="coverSrc(item)" :alt="item.title" loading="lazy" />
                <span v-if="item.isTop" class="content-block__badge">置顶</span>
              </div>

              <div class="content-block__body">
                <h2 class="content-block__title">{{ item.title }}</h2>
                <p v-if="item.summary" class="content-block__summary">{{ item.summary }}</p>

                <div class="content-block__meta">
                  <span v-if="item.author" class="meta-tag">
                    <i class="meta-icon">✎</i>{{ item.author }}
                  </span>
                  <span v-if="item.source" class="meta-tag">
                    <i class="meta-icon">◎</i>{{ item.source }}
                  </span>
                  <span v-if="item.publishTime" class="meta-tag">
                    <i class="meta-icon">◷</i>{{ formatDate(item.publishTime) }}
                  </span>
                  <span v-if="item.viewCount != null" class="meta-tag meta-tag--muted">
                    阅读 {{ item.viewCount }}
                  </span>
                </div>
              </div>
            </router-link>
          </article>
        </div>
        <Empty v-else :key="`empty-${activeKey}`" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Empty from '@/views/page/Empty.vue'
import { fetchNewsListByCategoryId } from '@/api/news'
import { usePageContext } from '@/composables/usePageContext'
import { buildNewsCategoryPath, parseCategoryIdFromRoute } from '@/utils/newsCategoryRoute'
import type { NewsItem } from '@/types/news'
import { contentPath } from '@/utils/contentRoute'
import { normalizePagePath } from '@/utils/paths'

const props = defineProps<{
  title?: string
  subtitle?: string
}>()

interface ServiceCategory {
  key: string
  label: string
  path: string
  categoryId: number
}

const { route, page, pageId, activeCategory: routeCategory, newsCategoryStore } = usePageContext()

const categories = ref<ServiceCategory[]>([])
const currentItems = ref<NewsItem[]>([])
const loading = ref(false)

const pageTitle = computed(
  () =>
    props.title?.trim() ||
    page.value?.title ||
    page.value?.name ||
    (route.meta.pageTitle as string) ||
    '服务'
)

const activeKey = computed(() => {
  const fromRoute = parseCategoryIdFromRoute(route)
  if (fromRoute > 0) return String(fromRoute)
  if (routeCategory.value) return String(routeCategory.value.id)
  return categories.value[0]?.key ?? ''
})

const activeTab = computed(() =>
  categories.value.find((cat) => cat.key === activeKey.value)
)

const activeCategoryId = computed(() => activeTab.value?.categoryId ?? -1)

const isEmptyState = computed(() => !loading.value && currentItems.value.length === 0)

function buildCategoriesFromStore(): ServiceCategory[] {
  const id = pageId.value
  if (id == null) return []

  const base = normalizePagePath(page.value?.path ?? route.path)
  return newsCategoryStore.listForPage(id).map((category) => ({
    key: String(category.id),
    label: category.name,
    path: buildNewsCategoryPath(base, category.id),
    categoryId: category.id
  }))
}

async function refreshCategories() {
  await newsCategoryStore.ensureLoaded()
  categories.value = buildCategoriesFromStore()
}

async function loadItems() {
  const categoryId = activeCategoryId.value
  if (categoryId <= 0) {
    currentItems.value = []
    return
  }

  loading.value = true
  try {
    currentItems.value = await fetchNewsListByCategoryId(categoryId)
  } finally {
    loading.value = false
  }
}

function coverSrc(item: NewsItem): string {
  const raw = item.coverImage?.trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return raw.startsWith('/') ? raw : `/${raw}`
}

function formatDate(value: string): string {
  if (value.length >= 10) return value.substring(0, 10)
  return value
}

onMounted(() => {
  void refreshCategories()
})

watch(activeCategoryId, () => {
  void loadItems()
}, { immediate: true })

watch(
  () => pageId.value,
  () => {
    void refreshCategories()
  }
)
</script>

<style scoped>
.services-page {
  --primary: #0c4da2;
  --text-main: #1e293b;
  --text-muted: #64748b;
  position: relative;
  min-height: 60vh;
  background: #f6f8fb;
  padding: 48px 0 80px;
  overflow: hidden;
  margin: -30px -40px;
}

.services-page__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.blob-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(12, 77, 162, 0.1) 0%, transparent 70%);
  top: -80px;
  right: -40px;
}

.blob-2 {
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(12, 77, 162, 0.06) 0%, transparent 70%);
  bottom: 60px;
  left: -60px;
}

.services-page__container {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

.services-page__header {
  text-align: center;
  margin-bottom: 32px;
}

.services-page__title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
}

.services-page__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.services-page__tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.tab-btn {
  padding: 9px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  background: #fff;
  color: var(--text-main);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.tab-btn:hover {
  border-color: #93c5fd;
  color: var(--primary);
}

.tab-btn--active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  font-weight: 600;
}

.services-page__loading {
  text-align: center;
  padding: 48px;
  color: #94a3b8;
  font-size: 14px;
}

.block-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.content-block {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #eef2f7;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.content-block:hover {
  box-shadow: 0 10px 28px rgba(12, 77, 162, 0.1);
  transform: translateY(-3px);
}

.content-block__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.content-block__cover {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #e2e8f0;
}

.content-block__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.content-block:hover .content-block__cover img {
  transform: scale(1.04);
}

.content-block__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: #ef4444;
  border-radius: 4px;
}

.content-block__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px 20px 20px;
}

.content-block__title {
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-block:hover .content-block__title {
  color: var(--primary);
}

.content-block__summary {
  margin: 0 0 16px;
  flex: 1;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-block__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #475569;
}

.meta-tag--muted {
  color: #94a3b8;
}

.meta-icon {
  font-style: normal;
  font-size: 11px;
  opacity: 0.7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .services-page {
    margin: -24px -16px;
  }

  .block-grid {
    grid-template-columns: 1fr;
  }

  .services-page__tabs {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }

  .tab-btn {
    flex-shrink: 0;
  }
}
</style>
