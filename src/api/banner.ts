import request from '@/utils/request'
import type { Result } from '@/types/result'
import type { Banner, BannerListResult } from '@/types/banner'

/** 首页轮播等业务使用的分组编码（与后台配置一致，接入页面时作为 `groupCode` 传入） */
export const HOME_BANNER_GROUP_CODE = 'home_banner'

export interface BannerListQuery {
  groupCode?: string
  status?: boolean
}

/** 列表：`GET /banners`，`data` 为 `{ items, total }` */
export function getBanners(params: BannerListQuery = {}): Promise<Result<BannerListResult>> {
  return request.get('/banners', { params })
}

/** 当前生效列表：`GET /banners/active/{groupCode}`，`data` 为 `Banner[]` */
export function getActiveBanners(groupCode: string): Promise<Result<Banner[]>> {
  return request.get(`/banners/active/${encodeURIComponent(groupCode)}`)
}

/** 详情：`GET /banners/{id}` */
export function getBannerById(id: number): Promise<Result<Banner>> {
  return request.get(`/banners/${id}`)
}
