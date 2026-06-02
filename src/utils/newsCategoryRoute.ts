import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { NewsCategory } from '@/types/news'
import { normalizePagePath } from '@/utils/paths'

/** 构建带分类 query 的栏目路径（`category_id` = news_category.id） */
export function buildNewsCategoryPath(
  basePath: string,
  categoryId: number,
  page?: number
): string {
  const base = normalizePagePath(basePath)
  const params = new URLSearchParams()
  params.set('category_id', String(categoryId))
  if (page != null && page > 1) params.set('page', String(page))
  return `${base}?${params.toString()}`
}

/** 从完整路径（含 query）解析 `category_id` */
export function parseCategoryIdFromFullPath(fullPath: string): number {
  const queryIndex = fullPath.indexOf('?')
  if (queryIndex === -1) return -1
  const params = new URLSearchParams(fullPath.slice(queryIndex + 1))
  const raw = params.get('category_id')
  if (raw == null) return -1
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? id : -1
}

/** 从路由 query 解析 `news_category.id` */
export function parseCategoryIdFromRoute(
  route: Pick<RouteLocationNormalizedLoaded, 'query'>
): number {
  const raw = route.query.category_id
  if (raw == null) return -1
  const id = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isFinite(id) && id > 0 ? id : -1
}

/** 从路由 query 解析页码，默认 1 */
export function parsePageFromRoute(
  route: Pick<RouteLocationNormalizedLoaded, 'query'>
): number {
  const raw = route.query.page
  if (raw == null) return 1
  const page = Number(Array.isArray(raw) ? raw[0] : raw)
  if (!Number.isFinite(page) || page < 1) return 1
  return Math.floor(page)
}

/** 某根菜单下的分类：`category.parentId === menu.id` */
export function categoriesForMenu(
  menuId: number,
  categories: NewsCategory[],
  onlyEnabled = true
): NewsCategory[] {
  return categories
    .filter((c) => c.parentId === menuId && (!onlyEnabled || c.status !== false))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function newsCategorySidebarItems(
  basePath: string,
  categories: NewsCategory[],
  menuId: number
): { name: string; path: string }[] {
  const base = normalizePagePath(basePath)
  return categoriesForMenu(menuId, categories).map((c) => ({
    name: c.name,
    path: buildNewsCategoryPath(base, c.id)
  }))
}

export function isNewsPageCode(code: string | undefined | null): boolean {
  return code === 'news'
}
