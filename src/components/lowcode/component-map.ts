import { defineAsyncComponent, type Component } from 'vue'
import type { PageNodeTreeNode } from '@/types/lowcode'
import LowcodeContainer from '@/components/lowcode/LowcodeContainer.vue'
import RichTextBlock from '@/components/lowcode/RichTextBlock.vue'
import UnknownComponent from '@/components/lowcode/UnknownComponent.vue'

const COMPONENT_MAP: Record<string, Component> = {
  page_container: LowcodeContainer,
  rich_text: RichTextBlock,
  hero_banner: defineAsyncComponent(
    () => import('@/views/home/sections/HomeCarousel.vue')
  ),
  notice_list: defineAsyncComponent(
    () => import('@/views/home/sections/HomeNotice.vue')
  ),
  quick_links: defineAsyncComponent(
    () => import('@/views/home/sections/HomeQuickLinks.vue')
  ),
  home_services: defineAsyncComponent(
    () => import('@/views/home/sections/HomeServices.vue')
  ),
  home_events: defineAsyncComponent(
    () => import('@/views/home/sections/HomeEvents.vue')
  ),
  news_list: defineAsyncComponent(
    () => import('@/components/lowcode/NewsListBlock.vue')
  ),
  home_shortcuts: defineAsyncComponent(
    () => import('@/views/home/sections/HomeShortcuts.vue')
  ),
  friend_links: defineAsyncComponent(
    () => import('@/views/home/sections/HomeFriendLinks.vue')
  )
}

export function isKnownComponentKey(key: string | null | undefined): key is string {
  return key != null && key in COMPONENT_MAP
}

export function getComponentByKey(key: string | null | undefined): Component {
  if (!isKnownComponentKey(key)) return UnknownComponent
  return COMPONENT_MAP[key]
}

export function isContainerNode(node: PageNodeTreeNode): boolean {
  return node.nodeType === 'container' || node.componentKey === 'page_container'
}

export const LOWCODE_COMPONENT_KEYS = Object.freeze(Object.keys(COMPONENT_MAP))
