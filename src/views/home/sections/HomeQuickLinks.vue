<template>
  <div class="card quick-links-card">
    <div class="card-header">
      <div class="title-wrapper">
        <div class="title-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 17.66l-4.24 4.24M23 12h-6m-6 0H1m20.24 4.24l-4.24-4.24M6.34 6.34L2.1 2.1"></path>
          </svg>
        </div>
        <h3>快速入口</h3>
      </div>
    </div>

    <div class="links-container">
      <router-link
        v-for="(link, index) in quickLinks"
        :key="link.key"
        :to="link.url"
        class="link-item"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <div class="link-bg"></div>
        <div class="link-content">
          <div class="icon-wrapper">
            <div class="icon-hexagon">
              <span class="icon-text">{{ link.icon }}</span>
            </div>
            <div class="icon-glow"></div>
          </div>
          <span class="link-text">{{ link.text }}</span>
        </div>
        <div class="link-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteMenusStore } from '@/stores/siteMenus'
import { useSitePagesStore } from '@/stores/sitePages'
import type { SitePage } from '@/types/sitePage'

/** 固定入口：始终排在最后，与 Header 会员入口一致 */
const STATIC_QUICK_LINKS: QuickLinkItem[] = [
  { key: 'static-register', icon: '注', text: '会员注册', url: '/apply' },
  { key: 'static-login', icon: '录', text: '会员登录', url: '/login' }
]

const CUSTOM_SLOT_COUNT = 2

export interface QuickLinkItem {
  key: string
  icon: string
  text: string
  url: string
}

function iconCharFromName(name: string): string {
  const t = name.trim()
  return t ? t.charAt(0) : '·'
}

function findNewsPage(pages: SitePage[]): SitePage | undefined {
  return pages.find((p) => p.code === 'news') ?? pages.find((p) => p.pageType === 'channel')
}

function findAboutPage(pages: SitePage[]): SitePage | undefined {
  return pages.find((p) => p.code === 'about') ?? pages.find((p) => p.pageType === 'single')
}

const sitePagesStore = useSitePagesStore()
const siteMenusStore = useSiteMenusStore()

function pageToQuickLink(page: SitePage, pages: SitePage[]): QuickLinkItem {
  return {
    key: `page-${page.id}`,
    icon: iconCharFromName(page.name),
    text: page.name,
    url: siteMenusStore.navLinkForPage(page, pages)
  }
}

const quickLinks = computed<QuickLinkItem[]>(() => {
  const pages = sitePagesStore.enabledPages
  const newsPage = findNewsPage(pages)
  const aboutPage = findAboutPage(pages)
  const reservedIds = new Set(
    [newsPage?.id, aboutPage?.id].filter((id): id is number => id != null)
  )

  const customPages = pages
    .filter((p) => p.code !== 'home' && !reservedIds.has(p.id))
    .slice(0, CUSTOM_SLOT_COUNT)

  const result: QuickLinkItem[] = []
  if (newsPage) result.push(pageToQuickLink(newsPage, pages))
  if (aboutPage) result.push(pageToQuickLink(aboutPage, pages))
  for (const page of customPages) {
    result.push(pageToQuickLink(page, pages))
  }
  result.push(...STATIC_QUICK_LINKS)
  return result
})
</script>

<style scoped>
.quick-links-card {
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

.quick-links-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 0 30px rgba(12, 77, 162, 0.08);
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0c4da2 0%, #3b82f6 100%);
  border-radius: 10px;
  color: white;
}

.title-icon svg {
  width: 20px;
  height: 20px;
}

.title-wrapper h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.links-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(226, 232, 240, 0.5);
  padding: 1px;
}

.link-item {
  position: relative;
  background: white;
  padding: 30px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.9);
  animation: popIn 0.5s ease forwards;
}

@keyframes popIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.link-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(12, 77, 162, 0) 0%, rgba(59, 130, 246, 0) 100%);
  transition: all 0.4s ease;
}

.link-item:hover .link-bg {
  background: linear-gradient(135deg, rgba(12, 77, 162, 0.03) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.link-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.icon-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-hexagon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: rotate(0deg);
}

.link-item:hover .icon-hexagon {
  background: linear-gradient(135deg, #0c4da2 0%, #3b82f6 100%);
  transform: rotate(360deg) scale(1.1);
  box-shadow: 0 10px 30px rgba(12, 77, 162, 0.3);
}

.icon-text {
  font-size: 22px;
  font-weight: 700;
  color: #0c4da2;
  transition: color 0.4s ease;
}

.link-item:hover .icon-text {
  color: white;
}

.icon-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(12, 77, 162, 0.3) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.4s ease;
}

.link-item:hover .icon-glow {
  opacity: 1;
  transform: scale(1.5);
}

.link-text {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  transition: all 0.3s ease;
}

.link-item:hover .link-text {
  color: #0c4da2;
  transform: translateY(-2px);
}

.link-arrow {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.link-arrow svg {
  width: 16px;
  height: 16px;
}

.link-item:hover .link-arrow {
  opacity: 1;
  transform: translateX(0);
  color: #0c4da2;
}

@media (max-width: 768px) {
  .links-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .link-item {
    padding: 24px 12px;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .icon-hexagon {
    width: 48px;
    height: 48px;
  }

  .icon-text {
    font-size: 18px;
  }
}
</style>
