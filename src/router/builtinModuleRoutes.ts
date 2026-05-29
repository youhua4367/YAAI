import type { RouteRecordRaw } from 'vue-router'
import { normalizePagePath } from '@/utils/paths'
import type { SitePage } from '@/types/sitePage'

const CHANNEL_PAGE_TYPES = new Set(['channel', 'single'])

/** 仅 channel / single 走侧栏栏目；首页与其它 portal 页由 DynamicPage + node-tree 渲染 */
export function createBuiltinModuleRoute(page: SitePage): RouteRecordRaw | null {
  if (CHANNEL_PAGE_TYPES.has(page.pageType)) {
    return createChannelModuleRoute(page)
  }

  return null
}

function createChannelModuleRoute(page: SitePage): RouteRecordRaw {
  const meta = {
    pageId: page.id,
    pageType: page.pageType,
    pageTitle: page.title ?? page.name
  }

  return {
    path: normalizePagePath(page.path),
    name: `ChannelModule_${page.id}`,
    component: () => import('@/components/layout/SidebarLayout.vue'),
    props: { pageId: page.id },
    meta,
    children: [
      {
        path: '',
        name: `ChannelIndex_${page.id}`,
        component: () => import('@/views/channel/ChannelPane.vue'),
        meta
      },
      {
        path: ':segment',
        name: `ChannelSegment_${page.id}`,
        component: () => import('@/views/channel/ChannelPane.vue'),
        meta
      }
    ]
  }
}
