import type { IPage } from '@/types/page'

/** `GET /pages` 列表项（与后端 `Pages` 实体 JSON 一致） */
export interface SitePage {
  id: number
  name: string
  code: string
  path: string
  pageType: string
  title: string | null
  status: boolean
  currentVersionId: number | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  remark?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface SitePageQuery {
  current?: number
  size?: number
  name?: string
  code?: string
  path?: string
  pageType?: string
  status?: boolean
}

export type SitePageListResult = IPage<SitePage>
