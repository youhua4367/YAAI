import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { NewsCategory } from '@/types/news'
import { normalizePagePath } from '@/utils/paths'

/** 构建带分类 query 的新闻页路径 */
export function buildNewsCategoryPath(basePath: string, categoryId: number): string {
  const base = normalizePagePath(basePath)
  return `${base}?category_id=${categoryId}`
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

export function newsCategorySidebarItems(
  basePath: string,
  categories: NewsCategory[]
): { name: string; path: string }[] {
  const base = normalizePagePath(basePath)
  return categories
    .filter((c) => c.status !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((c) => ({
      name: c.name,
      path: buildNewsCategoryPath(base, c.id)
    }))
}

export function isNewsPageCode(code: string | undefined | null): boolean {
  return code === 'news'
}
