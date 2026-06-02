import type { SitePage } from '@/types/sitePage'

/** Type3 services_page 自带顶部分类 Tab，不使用 SidebarLayout */
export function pageSkipsSidebarLayout(page: SitePage): boolean {
  return page.code === 'services'
}

export function componentKeySkipsSidebarLayout(componentKey: string | null | undefined): boolean {
  return componentKey?.trim() === 'services_page'
}
