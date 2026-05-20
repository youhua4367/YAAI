import type { SiteMenu } from '@/types/menu'
import type { SitePage } from '@/types/sitePage'
import { joinPaths, normalizePagePath } from '@/utils/paths'

const LEGACY_MODULE_PREFIXES = ['/news', '/about']

function rewriteLegacyPathname(pathname: string, pageBase: string): string {
  const normalized = pathname || '/'
  for (const legacy of LEGACY_MODULE_PREFIXES) {
    if (normalized === legacy) return normalizePagePath(pageBase)
    if (normalized.startsWith(`${legacy}/`)) {
      return joinPaths(pageBase, normalized.slice(legacy.length + 1))
    }
  }
  return normalized
}

/** 将 externalUrl 换绑到当前页面的 path（保留 query / hash） */
export function resolveExternalUrl(raw: string, page: SitePage): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed

  const relative = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const u = new URL(relative, 'http://local')
  const pathname = rewriteLegacyPathname(u.pathname, page.path)
  const search = u.search ?? ''
  const hash = u.hash ?? ''
  return `${pathname}${search}${hash}`
}

/**
 * 解析菜单站内路径：
 * - 根菜单（parentId=null）→ GET /pages 的 path
 * - 子菜单（parentId 非空）→ externalUrl（换绑 page.path），无则退回页面根路径
 */
export function resolveMenuPath(menu: SiteMenu, pages: SitePage[]): string {
  const pagesById = new Map(pages.map((p) => [p.id, p]))
  const page = menu.pageId != null ? pagesById.get(menu.pageId) : undefined

  if (menu.parentId != null) {
    if (menu.externalUrl?.trim() && page) {
      return resolveExternalUrl(menu.externalUrl, page)
    }
    if (page) return normalizePagePath(page.path)
    return '#'
  }

  if (menu.externalUrl?.trim()) {
    if (!page) return menu.externalUrl.trim()
    return resolveExternalUrl(menu.externalUrl, page)
  }

  if (menu.urlType === 'external') {
    return menu.externalUrl?.trim() || '#'
  }

  if (page) return normalizePagePath(page.path)

  return '#'
}

/** 比较站内路径（含 query）是否一致 */
export function isSameMenuPath(a: string, b: string): boolean {
  const norm = (p: string) => {
    const [pathname, search] = p.split('?')
    const base = normalizePagePath(pathname ?? p)
    return search ? `${base}?${search}` : base
  }
  return norm(a) === norm(b)
}
