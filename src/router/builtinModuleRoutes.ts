import type { RouteRecordRaw } from 'vue-router'
import { normalizePagePath } from '@/utils/paths'
import type { SitePage } from '@/types/sitePage'

const CHANNEL_PAGE_TYPES = new Set(['channel', 'single'])

export interface BuiltinModuleRouteOptions {
  /** 页面在 GET /menus 下有关联子菜单（如 /news） */
  hasSubmenus?: boolean
}

/** channel / single，或有侧栏子菜单的页面 → SidebarLayout + DynamicPage */
export function createBuiltinModuleRoute(
  page: SitePage,
  options: BuiltinModuleRouteOptions = {}
): RouteRecordRaw | null {
  if (CHANNEL_PAGE_TYPES.has(page.pageType) || options.hasSubmenus) {
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
        component: () => import('@/views/cms/DynamicPage.vue'),
        meta
      },
      {
        path: ':segment',
        name: `ChannelSegment_${page.id}`,
        component: () => import('@/views/cms/DynamicPage.vue'),
        meta
      }
    ]
  }
}
