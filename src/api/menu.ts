import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { SiteMenuListResult, SiteMenuQuery } from '@/types/menu'

/** 菜单列表 `GET /menus`（平铺，前端按 parentId 组树） */
export function fetchMenus(params: SiteMenuQuery = {}): Promise<Result<SiteMenuListResult>> {
  return request.get('/menus', { params })
}
