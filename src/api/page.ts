import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { SitePageListResult, SitePageQuery } from '@/types/sitePage'

/** 分页查询页面列表 `GET /pages` */
export function fetchPages(params: SitePageQuery = {}): Promise<Result<SitePageListResult>> {
  return request.get('/pages', {
    params: {
      current: params.current ?? 1,
      size: params.size ?? 100,
      ...params
    }
  })
}
