import { defineAsyncComponent, type Component } from 'vue'
import type { PageNodeTreeNode } from '@/types/lowcode'
import LowcodeContainer from '@/components/lowcode/LowcodeContainer.vue'
import UnknownComponent from '@/components/lowcode/UnknownComponent.vue'

const COMPONENT_MAP: Record<string, Component> = {
  page_container: LowcodeContainer,
  rich_text: defineAsyncComponent(() => import('@/views/page/Type2.vue')),
  hero_banner: defineAsyncComponent(
    () => import('@/views/home/sections/HomeCarousel.vue')
  ),
  notice_list: defineAsyncComponent(
    () => import('@/views/home/sections/HomeNotice.vue')
  ),
  quick_links: defineAsyncComponent(
    () => import('@/views/home/sections/HomeQuickLinks.vue')
  ),
  home_news: defineAsyncComponent(
    () => import('@/views/home/sections/HomeNews.vue')
  ),
  news_list: defineAsyncComponent(() => import('@/views/page/Type1.vue')),
  home_services: defineAsyncComponent(
    () => import('@/views/home/sections/HomeServices.vue')
  ),
  services_page: defineAsyncComponent(() => import('@/views/page/Type3.vue')),
  home_events: defineAsyncComponent(
    () => import('@/views/home/sections/HomeEvents.vue')
  ),
  conference_page: defineAsyncComponent(
    () => import('@/views/page/ConferencePage.vue')
  ),
  home_shortcuts: defineAsyncComponent(
    () => import('@/views/home/sections/HomeShortcuts.vue')
  ),
  friend_links: defineAsyncComponent(
    () => import('@/views/home/sections/HomeFriendLinks.vue')
  )
}

function normalizeComponentKey(key: string | null | undefined): string | null {
  if (key == null) return null
  const trimmed = key.trim()
  return trimmed || null
}

export function isKnownComponentKey(key: string | null | undefined): key is string {
  const normalized = normalizeComponentKey(key)
  return normalized != null && normalized in COMPONENT_MAP
}

export function getComponentByKey(key: string | null | undefined): Component {
  const normalized = normalizeComponentKey(key)
  if (normalized == null || !(normalized in COMPONENT_MAP)) return UnknownComponent
  return COMPONENT_MAP[normalized]
}

export function isContainerNode(node: PageNodeTreeNode): boolean {
  return node.nodeType === 'container' || node.componentKey === 'page_container'
}

export const LOWCODE_COMPONENT_KEYS = Object.freeze(Object.keys(COMPONENT_MAP))
