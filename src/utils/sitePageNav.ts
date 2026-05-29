import type { SitePage } from '@/types/sitePage'
import { isPathUnderModule, normalizePagePath } from '@/utils/paths'

export { normalizePagePath } from '@/utils/paths'

export interface NavMenuItem {
  key: string
  name: string
  path: string
  code: string
  pageId?: number
  children?: { name: string; path: string }[]
}

/** 已在 router/index.ts 硬编码的业务路由，不重复注册 DynamicPage */
const STATIC_ROUTE_PREFIXES = [
  '/content',
  '/apply',
  '/login',
  '/user'
] as const

function isStaticRoutePath(path: string): boolean {
  const normalized = normalizePagePath(path)
  return STATIC_ROUTE_PREFIXES.some((prefix) => isPathUnderModule(normalized, prefix))
}

export function shouldRegisterDynamicRoute(page: SitePage): boolean {
  if (!page.status) return false
  if (page.pageType === 'channel' || page.pageType === 'single') return false

  const path = normalizePagePath(page.path)
  if (isStaticRoutePath(path)) return false

  // portal / custom（含首页 `/`）→ DynamicPage
  return true
}
