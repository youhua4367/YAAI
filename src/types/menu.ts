/** `GET /menus` 列表项 */
export interface SiteMenu {
  id: number
  parentId: number | null
  name: string
  code: string
  urlType: string
  pageId: number | null
  externalUrl: string | null
  sortOrder: number | null
  status: boolean
  icon?: string | null
  remark?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface SiteMenuQuery {
  name?: string
  code?: string
  status?: boolean
}

export interface SiteMenuListResult {
  items: SiteMenu[]
  total: number
}
