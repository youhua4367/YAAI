import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchMenus } from '@/api/menu'
import type { SiteMenu } from '@/types/menu'
import type { SitePage } from '@/types/sitePage'
import { useSitePagesStore } from '@/stores/sitePages'
import { useNewsCategoryStore } from '@/stores/newsCategory'
import { resolveMenuPath } from '@/utils/menuPath'
import { isPathUnderModule, normalizePagePath } from '@/utils/paths'
import type { NavMenuItem } from '@/utils/sitePageNav'

function sortMenus(list: SiteMenu[]): SiteMenu[] {
  return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

/** 参与顶栏的页面类型（与 GET /pages 一致） */
const NAV_PAGE_TYPES = new Set(['portal', 'channel', 'single', 'custom'])

export const useSiteMenusStore = defineStore('siteMenus', () => {
  const menus = ref<SiteMenu[]>([])
  const loaded = ref(false)
  const loading = ref(false)

  /** 根菜单：parentId 为 null */
  function isRootMenu(menu: SiteMenu): boolean {
    return menu.parentId == null
  }

  /** 是否与某页面同属一个站点页（靠 pageId 判断，不靠 path） */
  function belongsToPage(menu: SiteMenu, pageId: number): boolean {
    return menu.pageId === pageId
  }

  /** 某页面下的根菜单（parentId=null 且 pageId 一致） */
  function rootMenuForPage(pageId: number): SiteMenu | undefined {
    const roots = menus.value.filter((m) => isRootMenu(m) && belongsToPage(m, pageId))
    return sortMenus(roots)[0]
  }

  /**
   * @deprecated 子项已改为 news_category（parentId = 根菜单 id），请用 newsCategoryStore.listForPage
   */
  function submenusForPage(pageId: number, onlyEnabled = true): SiteMenu[] {
    const root = rootMenuForPage(pageId)
    if (!root) return []

    return sortMenus(
      menus.value.filter((m) => {
        if (!belongsToPage(m, pageId)) return false
        if (isRootMenu(m)) return false
        if (m.parentId !== root.id) return false
        if (onlyEnabled && !m.status) return false
        return true
      })
    )
  }

  /** 首页新闻双栏：取前 N 个 news_category */
  function pickHomeNewsSubmenus(limit = 2) {
    return useNewsCategoryStore().pickHomeCategories(limit)
  }

  function childrenOf(parentMenuId: number, onlyEnabled = true): SiteMenu[] {
    return sortMenus(
      menus.value.filter(
        (m) => m.parentId === parentMenuId && (!onlyEnabled || m.status)
      )
    )
  }

  function menuByCode(code: string): SiteMenu | undefined {
    return menus.value.find((m) => m.code === code)
  }

  function pathByMenuCode(code: string): string | undefined {
    const sitePages = useSitePagesStore()
    const menu = menuByCode(code)
    if (!menu) return undefined
    return resolveMenuPath(menu, sitePages.pages)
  }

  /** 根据当前路由匹配该页根菜单下的 news_category */
  function findSubmenuByRoute(
    pageId: number,
    fullPath: string
  ) {
    return useNewsCategoryStore().findCategoryByRoute(pageId, fullPath)
  }

  function sidebarItemsForPage(pageId: number): { name: string; path: string }[] {
    return useNewsCategoryStore().sidebarItemsForPage(pageId)
  }

  function navChildrenForPage(pageId: number): NavMenuItem['children'] {
    const children = sidebarItemsForPage(pageId)
    return children.length ? children : undefined
  }

  function navLinkForPage(page: SitePage, pages: SitePage[]): string {
    const root = rootMenuForPage(page.id)
    const children = navChildrenForPage(page.id)

    if (children?.length) {
      if (root && !root.status) return children[0]!.path
      if (page.pageType === 'channel') return children[0]!.path
    }

    if (root?.status) return resolveMenuPath(root, pages)
    return normalizePagePath(page.path)
  }

  /** 顶栏：GET /pages 出主项；下拉子项来自 news_category（parentId = 根菜单 id） */
  const topNavItems = computed<NavMenuItem[]>(() => {
    const sitePages = useSitePagesStore()
    const pages = sitePages.enabledPages.filter((p) => NAV_PAGE_TYPES.has(p.pageType))

    return pages.map((page) => {
      const root = rootMenuForPage(page.id)
      return {
        key: `page-${page.id}`,
        name: root?.name ?? page.name,
        path: navLinkForPage(page, pages),
        code: page.code,
        pageId: page.id,
        children: navChildrenForPage(page.id)
      }
    })
  })

  const navItems = computed<NavMenuItem[]>(() => topNavItems.value)

  function isMenuActive(menu: SiteMenu, routePath: string): boolean {
    const sitePages = useSitePagesStore()
    if (menu.pageId != null) {
      const page = sitePages.enabledPages.find((p) => p.id === menu.pageId)
      if (page) return isPathUnderModule(routePath, page.path)
    }
    const path = resolveMenuPath(menu, sitePages.enabledPages)
    if (path.startsWith('http')) return false
    return isPathUnderModule(routePath, path)
  }

  async function ensureLoaded(): Promise<void> {
    if (loaded.value) return
    loading.value = true
    try {
      const res = await fetchMenus()
      menus.value = res.success && res.data?.items ? res.data.items : []
    } catch {
      menus.value = []
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

  return {
    menus,
    loaded,
    loading,
    navItems,
    isRootMenu,
    belongsToPage,
    rootMenuForPage,
    submenusForPage,
    pickHomeNewsSubmenus,
    menuByCode,
    pathByMenuCode,
    findSubmenuByRoute,
    childrenOf,
    sidebarItemsForPage,
    navLinkForPage,
    isMenuActive,
    ensureLoaded
  }
})
