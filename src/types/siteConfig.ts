/** 单条站点配置 */
export interface SiteConfig {
  id: number
  configKey: string
  configValue: string | null
  remark?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/** `GET /site-configs/show-all_config` 响应 data */
export interface SiteConfigShowAllResult {
  configs: SiteConfig[]
  total: number
}

/** 友情链接 JSON（configKey: friend_links） */
export interface FriendLink {
  name: string
  url: string
}
