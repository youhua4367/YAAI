/** `GET /news-categories` 列表项 */
export interface NewsCategory {
  id: number
  name: string
  code?: string | null
  sortOrder?: number | null
  status?: boolean
}

/**
 * 新闻列表查询参数（前端封装）
 * @description 映射到后端 `GET /news` 的 `current`、`size`（沿用 pageNum/pageSize 别名便于旧调用方）
 */
export interface NewsQueryParams {
  /** 对应后端 `current`，默认 1 */
  pageNum?: number
  /** 对应后端 `size` */
  pageSize?: number
  categoryId?: number
  title?: string
  /** 是否已发布 */
  status?: boolean
  /** 是否置顶 */
  isTop?: boolean
}

/**
 * 新闻资讯（与 `GET /news/{id}`、`GET /news` 返回的 `data` / `records` 项一致）
 */
export interface NewsItem {
  id: number
  categoryId: number
  title: string
  summary?: string | null
  content?: string | null
  coverImage?: string | null
  publishTime?: string | null
  source?: string | null
  author?: string | null
  /** 是否已发布 */
  status?: boolean | null
  isTop?: boolean | null
  viewCount?: number | null
  remark?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/**
 * 分页结果对象
 * @description 通用分页响应结构
 */
export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}
