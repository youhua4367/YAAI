import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { SiteConfigShowAllResult } from '@/types/siteConfig'

/** 展示端：查询全部站点配置 `GET /site-configs/show-all_config` */
export function fetchShowAllSiteConfigs(keys?: string): Promise<Result<SiteConfigShowAllResult>> {
  return request.get('/site-configs/show-all_config', {
    params: keys ? { keys } : undefined
  })
}
