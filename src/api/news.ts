import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { NewsItem, NewsQueryParams, PageResult } from '@/types/news'

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

/** 某分类下已发布新闻（默认第一页） */
export async function fetchNewsListByCategoryId(
  categoryId: number,
  pageSize = 100
): Promise<NewsItem[]> {
  if (!Number.isFinite(categoryId) || categoryId <= 0) return []
  try {
    const res = await getNewsPage({
      categoryId,
      pageNum: 1,
      pageSize,
      status: true
    })
    return res.success && res.data?.records ? res.data.records : []
  } catch {
    return []
  }
}

/** 详情（后端在 `GET /news/{id}` 内会先增加浏览量） */
export function getNewsById(id: number): Promise<Result<NewsItem>> {
  return request.get(`/news/${id}`)
}
