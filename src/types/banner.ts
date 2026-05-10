/**
 * 轮播图（与文档 `Banner` 实体、`GET /banners` 等返回字段一致）
 */
export interface Banner {
  id: number
  groupCode: string
  title?: string | null
  subtitle?: string | null
  imageUrl?: string | null
  linkUrl?: string | null
  sortOrder?: number | null
  status: boolean
  startTime?: string | null
  endTime?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/** `GET /banners` 的 `data` */
export interface BannerListResult {
  items: Banner[]
  total: number
}
