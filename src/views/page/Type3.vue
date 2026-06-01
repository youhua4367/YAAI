<template>
  <div class="services-page">
    <div class="services-page__bg" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="services-page__container">
      <header class="services-page__header">
        <h1 class="services-page__title">服务矩阵</h1>
        <p class="services-page__subtitle">按分类浏览服务项目与动态</p>
      </header>

      <nav class="services-page__tabs" aria-label="服务分类">
        <button
          v-for="cat in categories"
          :key="cat.key"
          type="button"
          class="tab-btn"
          :class="{ 'tab-btn--active': cat.key === activeCategory }"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
        </button>
      </nav>

      <Transition name="fade" mode="out-in">
        <div :key="activeCategory" class="block-grid">
          <article
            v-for="item in currentItems"
            :key="item.id"
            class="content-block"
          >
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
      </Transition>

      <p v-if="!currentItems.length" class="services-page__empty">该分类暂无内容</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { NewsItem } from '@/types/news'
import { contentPath } from '@/utils/contentRoute'

interface ServiceCategory {
  key: string
  label: string
  categoryId: number
}

const categories: ServiceCategory[] = [
  { key: 'consulting', label: '科技咨询', categoryId: 1 },
  { key: 'training', label: '技术培训', categoryId: 2 },
  { key: 'project', label: '项目申报', categoryId: 3 },
  { key: 'transformation', label: '成果转化', categoryId: 4 }
]

/** 占位数据：结构与 GET /news 单条 JSON 一致 */
const mockItems: NewsItem[] = [
  {
    id: 1,
    categoryId: 1,
    title: '2026年学术年会成功举办',
    summary: '近日，2026年学术年会在北京成功举办……',
    content: '<p>详细内容...</p>',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&h=360&fit=crop',
    publishTime: '2026-04-10T09:00:00',
    source: '学会秘书处',
    author: '张三',
    status: true,
    isTop: true,
    viewCount: 1216,
    remark: null,
    createdAt: '2026-04-28T20:55:12',
    updatedAt: '2026-05-30T22:52:05'
  },
  {
    id: 2,
    categoryId: 1,
    title: '云南省 AI 产业「十五五」规划专家咨询报告发布',
    summary: '报告系统梳理了云南省人工智能产业发展现状与趋势，提出重点布局建议。',
    content: '<p>详细内容...</p>',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=360&fit=crop',
    publishTime: '2026-03-08T14:30:00',
    source: '科技咨询部',
    author: '李四',
    status: true,
    isTop: false,
    viewCount: 856,
    remark: null,
    createdAt: '2026-03-08T10:00:00',
    updatedAt: '2026-03-08T10:00:00'
  },
  {
    id: 3,
    categoryId: 2,
    title: '2026 春季「大模型应用开发」专题培训班招生通知',
    summary: '面向高校师生与企业工程师，涵盖 RAG、Agent 与微调实战。',
    content: '<p>详细内容...</p>',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=360&fit=crop',
    publishTime: '2026-03-01T09:00:00',
    source: '培训部',
    author: '王五',
    status: true,
    isTop: true,
    viewCount: 2340,
    remark: null,
    createdAt: '2026-03-01T08:00:00',
    updatedAt: '2026-03-01T08:00:00'
  },
  {
    id: 4,
    categoryId: 2,
    title: '昇腾 AI 全栈实战训练营（昆明站）圆满结业',
    summary: '50 名学员完成昇腾算力平台部署与大模型推理优化实训。',
    content: '<p>详细内容...</p>',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=640&h=360&fit=crop',
    publishTime: '2026-02-14T16:00:00',
    source: '培训部',
    author: '赵六',
    status: true,
    isTop: false,
    viewCount: 672,
    remark: null,
    createdAt: '2026-02-14T16:00:00',
    updatedAt: '2026-02-14T16:00:00'
  },
  {
    id: 5,
    categoryId: 3,
    title: '2026 年度国家自然科学基金 AI 专项申报辅导启动',
    summary: '提供选题论证、材料撰写与答辩模拟全流程辅导服务。',
    content: '<p>详细内容...</p>',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&h=360&fit=crop',
    publishTime: '2026-02-25T10:00:00',
    source: '项目服务部',
    author: '钱七',
    status: true,
    isTop: false,
    viewCount: 1089,
    remark: null,
    createdAt: '2026-02-25T10:00:00',
    updatedAt: '2026-02-25T10:00:00'
  },
  {
    id: 6,
    categoryId: 4,
    title: '「云智医联」AI 辅助诊断成果路演暨对接会',
    summary: '促成 3 项医疗 AI 成果与产业资本现场签约意向。',
    content: '<p>详细内容...</p>',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=640&h=360&fit=crop',
    publishTime: '2026-03-05T09:30:00',
    source: '成果转化部',
    author: '孙八',
    status: true,
    isTop: true,
    viewCount: 1567,
    remark: null,
    createdAt: '2026-03-05T09:30:00',
    updatedAt: '2026-03-05T09:30:00'
  }
]

const route = useRoute()

function resolveCategoryFromQuery(): string {
  const raw = route.query.section ?? route.query.category
  const key = Array.isArray(raw) ? raw[0] : raw
  if (typeof key === 'string' && categories.some((c) => c.key === key)) return key
  return categories[0]!.key
}

const activeCategory = ref(resolveCategoryFromQuery())

watch(
  () => route.query,
  () => {
    activeCategory.value = resolveCategoryFromQuery()
  }
)

const activeCategoryId = computed(
  () => categories.find((c) => c.key === activeCategory.value)?.categoryId ?? 1
)

const currentItems = computed(() =>
  mockItems.filter((item) => item.categoryId === activeCategoryId.value)
)

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

/* 块状网格 */
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

.services-page__empty {
  text-align: center;
  padding: 48px;
  color: #94a3b8;
  font-size: 14px;
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
