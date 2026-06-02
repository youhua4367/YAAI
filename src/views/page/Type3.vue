<template>
  <div class="services-page">
    <div class="services-page__bg" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="services-page__container">
      <header v-if="!isEmptyState" class="services-page__header">
        <h1 class="services-page__title">
          <span class="title-gradient">{{ pageTitle }}</span>
        </h1>
        <p v-if="subtitle" class="services-page__subtitle">{{ subtitle }}</p>
      </header>

      <nav v-if="categories.length > 1" class="services-page__tabs" aria-label="分类">
        <div class="tabs-track">
          <router-link
            v-for="cat in categories"
            :key="cat.key"
            :to="cat.path"
            class="tab-btn"
            :class="{ 'tab-btn--active': cat.key === activeKey }"
          >
            <span class="tab-btn__indicator"></span>
            <span class="tab-btn__text">{{ cat.label }}</span>
          </router-link>
        </div>
      </nav>

      <div v-if="loading" class="services-page__loading">
        <div class="loading-spinner"></div>
        <span>正在加载前沿资源...</span>
      </div>

      <Transition v-else name="fade-slide" mode="out-in">
        <div v-if="currentItems.length" :key="activeKey" class="block-grid">
          <article v-for="item in currentItems" :key="item.id" class="content-block">
            <router-link :to="contentPath(item.id)" class="content-block__link">
              
              <div v-if="coverSrc(item)" class="content-block__cover">
                <img :src="coverSrc(item)" :alt="item.title" loading="lazy" />
                <div class="content-block__overlay"></div>
                <span v-if="item.isTop" class="content-block__badge">置顶推荐</span>
              </div>

              <div class="content-block__body">
                <h2 class="content-block__title">{{ item.title }}</h2>
                <p v-if="item.summary" class="content-block__summary">{{ item.summary }}</p>

                <div class="content-block__meta">
                  <span v-if="item.author" class="meta-tag meta-tag--author">
                    {{ item.author }}
                  </span>
                  <span v-if="item.source" class="meta-tag meta-tag--source">
                    {{ item.source }}
                  </span>
                  <span v-if="item.publishTime" class="meta-tag meta-tag--time">
                    {{ formatDate(item.publishTime) }}
                  </span>
                  <span v-if="item.viewCount != null" class="meta-tag meta-tag--view">
                    {{ item.viewCount }} 次阅读
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
  --primary: #0a56c6;
  --primary-light: rgba(10, 86, 198, 0.05);
  --text-main: #0f172a;
  --text-body: #334155;
  --text-muted: #64748b;
  --radius-card: 16px;
  
  position: relative;
  min-height: 75vh;
  background-color: #f8fafc;
  /* 注入微晶格粒子网格底纹 */
  background-image: radial-gradient(#e2e8f0 1.2px, transparent 1.2px);
  background-size: 32px 32px;
  padding: 60px 0 100px;
  overflow: hidden;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 极光流体炫光背景线 */
.services-page__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  will-change: transform;
}

.blob-1 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(10, 86, 198, 0.12) 0%, transparent 75%);
  top: -100px;
  right: -40px;
}

.blob-2 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 75%);
  bottom: 40px;
  left: -80px;
}

.blob-3 {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 75%);
  top: 30%;
  right: 25%;
}

.services-page__container {
  position: relative;
  z-index: 2;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 头部样式排版优化 */
.services-page__header {
  text-align: center;
  margin-bottom: 40px;
}

.services-page__title {
  margin: 0 0 12px;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.title-gradient {
  background: linear-gradient(135deg, #0f172a 40%, var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.services-page__subtitle {
  margin: 0;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* 顶部分类 Tab 重构：玻璃拟态一体舱轨道 */
.services-page__tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 36px;
}

.tabs-track {
  display: flex;
  padding: 6px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(16px);
  border-radius: 100px;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.04);
}

.tab-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border: none;
  background: transparent;
  color: #475569;
  font-size: 14.5px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.tab-btn__indicator {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--primary);
}

/* 激活状态：平滑高亮包裹 */
.tab-btn--active {
  background: #fff;
  color: var(--primary);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03);
}

.tab-btn--active .tab-btn__indicator {
  background: var(--primary);
  transform: scale(1.4);
  box-shadow: 0 0 6px var(--primary);
}

/* 优化后的骨架/加载器 */
.services-page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--text-muted);
  font-size: 14.5px;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid rgba(10, 86, 198, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 网格布局 */
.block-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* 核心卡片重构：Bento 网格高级质感 */
.content-block {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-card);
  border: 1px solid rgba(238, 242, 247, 0.8);
  box-shadow: 
    0 4px 6px -1px rgba(15, 23, 42, 0.01),
    0 12px 24px -4px rgba(15, 23, 42, 0.03);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.content-block:hover {
  background: #fff;
  border-color: rgba(10, 86, 198, 0.2);
  box-shadow: 
    0 10px 15px -3px rgba(10, 86, 198, 0.03),
    0 24px 48px -12px rgba(10, 86, 198, 0.09);
  transform: translateY(-4px);
}

.content-block__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

/* 封面容器与精致渐变暗膜 */
.content-block__cover {
  position: relative;
  aspect-ratio: 16 / 8.5;
  overflow: hidden;
  background: #f1f5f9;
}

.content-block__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.content-block__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.15), transparent 60%);
  pointer-events: none;
}

.content-block:hover .content-block__cover img {
  transform: scale(1.03);
}

/* 置顶标签：改为更加内敛的高科技小胶囊 */
.content-block__badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 6px;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
}

/* 卡片文本内容排版 */
.content-block__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 24px;
}

.content-block__title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.content-block:hover .content-block__title {
  color: var(--primary);
}

.content-block__summary {
  margin: 0 0 20px;
  flex: 1;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-body);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 元信息：完全移除自带字符实体，采用高精准 CSS 图形装饰 */
.content-block__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  color: var(--text-muted);
  position: relative;
}

/* 纯 CSS 模拟小图标，规避由于文字图标导致的对齐和兼容硬伤 */
.meta-tag::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #cbd5e1;
  margin-right: 8px;
}

.meta-tag--author::before { background: #3b82f6; }
.meta-tag--source::before { background: #10b981; }
.meta-tag--time::before { background: #f59e0b; }
.meta-tag--view::before { background: #94a3b8; }

/* 路由平滑切场动效 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}

/* 响应式完美适配 */
@media (max-width: 768px) {
  .services-page {
    padding: 40px 0 60px;
  }

  .services-page__title {
    font-size: 28px;
  }

  .block-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .services-page__tabs {
    justify-content: flex-start;
    padding: 0 16px;
    margin-bottom: 24px;
  }

  .tabs-track {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
  }

  .tabs-track::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    padding: 8px 18px;
    font-size: 13.5px;
    flex-shrink: 0;
  }

  .content-block__body {
    padding: 20px;
  }
}
</style>