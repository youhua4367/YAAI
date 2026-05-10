import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { NewsCategory } from '@/types/newsCategory'

/** `GET /news-categories` 列表包裹结构 */
export interface NewsCategoryListData {
  items: NewsCategory[]
  total: number
}

/** 已启用分类：`GET /news-categories?status=true` */
export function fetchEnabledNewsCategories(): Promise<Result<NewsCategoryListData>> {
  return request.get('/news-categories', { params: { status: true } })
}
