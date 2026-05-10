/**
 * 新闻分类（与 `GET /news-categories` 返回的 `items` 元素一致）
 */
export interface NewsCategory {
  id: number
  parentId: number | null
  name: string
  code: string
  sortOrder: number
  status: boolean
  createdAt?: string | null
  updatedAt?: string | null
}
