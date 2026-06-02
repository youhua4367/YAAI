import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { NewsCategory, NewsItem, NewsQueryParams, PageResult } from '@/types/news'

/** `GET /news/show-list` 响应（展示端列表） */
export interface NewsShowListResult {
  items: NewsItem[]
  total: number
  page: number
  page_size: number
}

/** 构建 `GET /news` 查询参数（`pageNum`/`pageSize` → `current`/`size`） */
function toNewsListQuery(
  opts: NewsQueryParams & { categoryId?: number }
): Record<string, string | number | boolean> {
  const current = opts.pageNum ?? 1
  const size = opts.pageSize ?? 10
  const q: Record<string, string | number | boolean> = { current, size }
  if (opts.categoryId != null) q.categoryId = opts.categoryId
  if (opts.title) q.title = opts.title
  if (opts.status !== undefined) q.status = opts.status
  if (opts.isTop !== undefined) q.isTop = opts.isTop
  return q
}

/** 分页列表，对接 `GET /news` */
export function getNewsPage(
  params: NewsQueryParams & { categoryId?: number } = {}
): Promise<Result<PageResult<NewsItem>>> {
  return request.get('/news', { params: toNewsListQuery(params) })
}

/** 新闻分类列表 `GET /news-categories` */
export async function fetchNewsCategories(): Promise<NewsCategory[]> {
  try {
    const res = await request.get('/news-categories')
    const data = res.data
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.records && Array.isArray(data.records)) return data.records
    return []
  } catch {
    return []
  }
}

/**
 * 展示端新闻列表 `GET /news/show-list`
 * @param category_id 对应 `news_category.id` / 新闻 `categoryId`
 */
export function fetchNewsShowList(params: {
  category_id?: number
  page?: number
  page_size?: number
  sort?: string
  keyword?: string
  is_top?: boolean
}): Promise<Result<NewsShowListResult>> {
  const q: Record<string, string | number | boolean> = {
    page: params.page ?? 1,
    page_size: params.page_size ?? 100
  }
  if (params.category_id != null) q.category_id = params.category_id
  if (params.sort) q.sort = params.sort
  if (params.keyword) q.keyword = params.keyword
  if (params.is_top !== undefined) q.is_top = params.is_top
  return request.get('/news/show-list', { params: q })
}

/** 按 `news_category.id` 拉取已发布新闻列表 */
export async function fetchNewsListByCategoryId(
  categoryId: number,
  pageSize = 100
): Promise<NewsItem[]> {
  if (!Number.isFinite(categoryId) || categoryId <= 0) return []
  try {
    const res = await fetchNewsShowList({
      category_id: categoryId,
      page: 1,
      page_size: pageSize
    })
    return res.success && res.data?.items ? res.data.items : []
  } catch {
    return []
  }
}

/** 取新闻用于排序的时间戳（优先 updatedAt） */
function newsUpdatedTimestamp(item: NewsItem): number {
  const raw =
    item.updatedAt ??
    (item as NewsItem & { updateAt?: string | null }).updateAt ??
    item.publishTime ??
    item.createdAt
  if (!raw) return 0
  const t = Date.parse(raw)
  return Number.isFinite(t) ? t : 0
}

/** 按 updatedAt 降序取前 N 条 */
export function pickLatestNewsByUpdatedAt(
  items: NewsItem[],
  limit = 5
): NewsItem[] {
  return [...items]
    .sort((a, b) => newsUpdatedTimestamp(b) - newsUpdatedTimestamp(a))
    .slice(0, limit)
}

/** 首页等：拉取列表后按 updatedAt 筛选最新 N 条 */
export async function fetchLatestNews(limit = 5): Promise<NewsItem[]> {
  try {
    const res = await fetchNewsShowList({
      page: 1,
      page_size: 100
    })
    const items = res.success && res.data?.items ? res.data.items : []
    return pickLatestNewsByUpdatedAt(items, limit)
  } catch {
    return []
  }
}

/** 详情（后端在 `GET /news/{id}` 内会先增加浏览量） */
export function getNewsById(id: number): Promise<Result<NewsItem>> {
  return request.get(`/news/${id}`)
}

/** 按 contentId 顺序批量拉取新闻（跳过无效 id 或请求失败项） */
export async function fetchNewsByIds(ids: number[]): Promise<NewsItem[]> {
  const validIds = ids.filter((id) => Number.isFinite(id) && id > 0)
  if (!validIds.length) return []

  const results = await Promise.all(
    validIds.map(async (id) => {
      try {
        const res = await getNewsById(id)
        return res.success && res.data ? res.data : null
      } catch {
        return null
      }
    })
  )

  return results.filter((item): item is NewsItem => item != null)
}
