<!-- 低代码 componentKey: rich_text -->
<template>
  <Empty v-if="!loadingNews && !hasContent" />
  <article v-else-if="hasContent" class="article-page">
    <figure v-if="!useStaticContent && article.coverImage" class="article-page__cover">
      <img :src="article.coverImage" :alt="article.title" loading="lazy" />
    </figure>

    <div class="article-page__inner">
      <header class="article-page__head">
        <h1 class="article-page__title">{{ article.title }}</h1>

        <p v-if="!useStaticContent && article.summary" class="article-page__summary">
          <span class="summary-tag">摘要</span>
          {{ article.summary }}
        </p>

        <div v-if="!useStaticContent && (article.author || article.publishTime)" class="article-page__meta">
          <div v-if="article.author" class="meta-item">
            <span class="meta-label">作者</span>
            <span class="meta-val author-badge">{{ article.author }}</span>
          </div>
          <div v-if="article.publishTime" class="meta-item">
            <span class="meta-label">发布于</span>
            <span class="meta-val">{{ article.publishTime }}</span>
          </div>
        </div>
      </header>

      <div class="article-page__divider"></div>

      <div v-if="useStaticContent" class="article-page__body rich-text">
        <p>{{ staticContent }}</p>
      </div>
      <div v-else class="article-page__body rich-text" v-html="article.content"></div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Empty from '@/views/page/Empty.vue'
import { fetchNewsListByCategoryId } from '@/api/news'
import { usePageContext } from '@/composables/usePageContext'
import { parseCategoryIdFromRoute } from '@/utils/newsCategoryRoute'
import { resolveSectionTitle } from '@/utils/sectionTitle'
import type { NewsItem } from '@/types/news'

const props = defineProps<{
  nodeName?: string
  title?: string
  /** propsJson 静态正文（如学会介绍页） */
  content?: string
  /** 低代码 data_binding：可为 news_category.id（无 content 时兜底） */
  dataBindingId?: number | null
}>()

const { route, activeCategory } = usePageContext()

const fetchedNews = ref<NewsItem | null>(null)
const loadingNews = ref(false)

const staticContent = computed(() => props.content?.trim() ?? '')
/** 有 propsJson.content 时直接展示，不按分类拉新闻 */
const useStaticContent = computed(() => staticContent.value.length > 0)

/** 当前栏目 category.id（仅无静态 content 时使用） */
const categoryId = computed(() => {
  if (useStaticContent.value) return -1
  const fromRoute = parseCategoryIdFromRoute(route)
  if (fromRoute > 0) return fromRoute
  if (activeCategory.value?.id) return activeCategory.value.id
  if (props.dataBindingId != null && props.dataBindingId > 0) return props.dataBindingId
  return -1
})

function formatPublishTime(value: string | null | undefined): string {
  if (!value) return ''
  return value.length >= 16 ? value.substring(0, 16).replace('T', ' ') : value
}

function coverSrc(raw: string | null | undefined): string {
  const text = raw?.trim()
  if (!text) return ''
  if (/^https?:\/\//i.test(text)) return text
  return text.startsWith('/') ? text : `/${text}`
}

const displayTitle = computed(() =>
  resolveSectionTitle(
    props.nodeName,
    props.title?.trim() || activeCategory.value?.name?.trim() || fetchedNews.value?.title?.trim()
  ) || '文章'
)

const article = computed(() => {
  if (useStaticContent.value) {
    return {
      title: displayTitle.value,
      summary: '',
      author: '',
      publishTime: '',
      coverImage: '',
      content: staticContent.value
    }
  }

  const news = fetchedNews.value
  if (!news) {
    return {
      title: displayTitle.value,
      summary: '',
      author: '',
      publishTime: '',
      coverImage: '',
      content: ''
    }
  }

  return {
    title: news.title?.trim() || displayTitle.value,
    summary: news.summary?.trim() || '',
    author: news.author?.trim() || '',
    publishTime: formatPublishTime(news.publishTime),
    coverImage: coverSrc(news.coverImage),
    content: news.content?.trim() || ''
  }
})

const hasContent = computed(() =>
  useStaticContent.value ? true : Boolean(article.value.content.trim())
)

async function loadFirstNewsInCategory() {
  const id = categoryId.value
  if (id <= 0) {
    fetchedNews.value = null
    return
  }

  loadingNews.value = true
  try {
    const list = await fetchNewsListByCategoryId(id, 1)
    fetchedNews.value = list[0] ?? null
  } catch {
    fetchedNews.value = null
  } finally {
    loadingNews.value = false
  }
}

watch(
  () => [categoryId.value, useStaticContent.value] as const,
  ([id, isStatic]) => {
    if (isStatic) {
      fetchedNews.value = null
      loadingNews.value = false
      return
    }
    if (id <= 0) {
      fetchedNews.value = null
      return
    }
    void loadFirstNewsInCategory()
  },
  { immediate: true }
)
</script>

<style scoped>
.article-page {
  --primary: #0a56c6;
  --primary-light: rgba(10, 86, 198, 0.05);
  --primary-gradient: linear-gradient(135deg, #0a56c6 0%, #2575fc 100%);
  --text-main: #0f172a;
  --text-body: #334155;
  --text-muted: #64748b;
  --radius-lg: 16px;
  --radius-md: 8px;

  max-width: 820px;
  margin: 0 auto;
  padding: 24px 20px 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.article-page__cover {
  margin: 0 0 36px;
  width: 100%;
  aspect-ratio: 21 / 9;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: #f1f5f9;
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08);
}

.article-page__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.article-page__cover:hover img {
  transform: scale(1.02);
}

.article-page__title {
  margin: 0 0 24px;
  font-size: clamp(26px, 4.5vw, 36px);
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.article-page__summary {
  position: relative;
  margin: 0 0 28px;
  padding: 20px 24px;
  font-size: 15.5px;
  line-height: 1.7;
  color: #475569;
  background: linear-gradient(to right, var(--primary-light), rgba(248, 250, 252, 0.5));
  border-radius: var(--radius-md);
  border-left: 4px solid var(--primary);
}

.summary-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary);
  background: rgba(10, 86, 198, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.article-page__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.meta-label {
  color: var(--text-muted);
  margin-right: 8px;
}

.meta-val {
  color: var(--text-main);
  font-weight: 500;
}

.author-badge {
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--primary);
}

.article-page__divider {
  height: 1px;
  background: linear-gradient(to right, var(--primary), rgba(241, 245, 249, 0.8) 40%, rgba(241, 245, 249, 0));
  margin: 36px 0;
  opacity: 0.6;
}

.article-page__body {
  font-size: 16.5px;
  line-height: 1.9;
  color: var(--text-body);
}

.article-page__body :deep(p) {
  margin: 0 0 1.5em;
  text-align: justify;
}

.article-page__body :deep(h2) {
  margin: 2em 0 1em;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.article-page__body :deep(h2::before) {
  content: '';
  width: 4px;
  height: 18px;
  background: var(--primary-gradient);
  margin-right: 12px;
  border-radius: 4px;
  flex-shrink: 0;
}

.article-page__body :deep(ul) {
  margin: 0 0 1.5em;
  padding-left: 1.25em;
  list-style: none;
}

.article-page__body :deep(li) {
  position: relative;
  margin-bottom: 0.75em;
  padding-left: 1.25em;
}

.article-page__body :deep(li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.7;
}

.article-page__body :deep(.highlight-text) {
  margin-top: 2.5em;
  padding: 20px;
  background: #f8fafc;
  border-radius: var(--radius-md);
  border: 1px dashed #cbd5e1;
  text-align: center;
  font-weight: 500;
  color: var(--text-main);
}

@media (max-width: 768px) {
  .article-page {
    padding: 16px 16px 40px;
  }

  .article-page__cover {
    margin-bottom: 24px;
    border-radius: var(--radius-md);
  }

  .article-page__meta {
    gap: 16px;
  }

  .article-page__divider {
    margin: 24px 0;
  }
}
</style>
