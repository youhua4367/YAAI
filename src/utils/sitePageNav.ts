import type { SitePage } from '@/types/sitePage'
import { BUILTIN_MODULE_CODES } from '@/router/builtinModuleRoutes'

export { normalizePagePath } from '@/utils/paths'

export interface NavMenuItem {
  key: string
  name: string
  path: string
  code: string
  pageId?: number
  children?: { name: string; path: string }[]
}

export function shouldRegisterDynamicRoute(page: SitePage): boolean {
  if (!page.status) return false
  if (BUILTIN_MODULE_CODES.has(page.code)) return false
  if (page.pageType === 'channel' || page.pageType === 'single') return false
  if (page.pageType === 'portal') return false
  return true
}
