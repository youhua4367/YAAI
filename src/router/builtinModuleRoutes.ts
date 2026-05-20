import type { RouteRecordRaw } from 'vue-router'
import { normalizePagePath } from '@/utils/paths'
import type { SitePage } from '@/types/sitePage'

/** 仅首页为固定内置模块，其余栏目由 pageType 与后台 path 决定 */
export const BUILTIN_MODULE_CODES = new Set(['home'])

const CHANNEL_PAGE_TYPES = new Set(['channel', 'single'])

export function createBuiltinModuleRoute(page: SitePage): RouteRecordRaw | null {
  const base = normalizePagePath(page.path)

  if (page.code === 'home' || (page.pageType === 'portal' && base === '/')) {
    return {
      path: base,
      name: `SiteHome_${page.id}`,
      component: () => import('@/views/home/Index.vue')
    }
  }

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
