import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { fetchNewsCategories } from '@/api/news'
import { useSiteMenusStore } from '@/stores/siteMenus'
import { useSitePagesStore } from '@/stores/sitePages'
import type { NewsCategory } from '@/types/news'
import {
  categoriesForMenu,
  newsCategorySidebarItems,
  parseCategoryIdFromFullPath,
  parseCategoryIdFromRoute
} from '@/utils/newsCategoryRoute'
import { normalizePagePath } from '@/utils/paths'

export const useNewsCategoryStore = defineStore('newsCategory', () => {
  const categories = ref<NewsCategory[]>([])
  const loaded = ref(false)
  const loading = ref(false)

  const enabledCategories = computed(() =>
    categories.value
      .filter((c) => c.status !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  )

  async function ensureLoaded(): Promise<void> {
    if (loaded.value) return
    loading.value = true
    try {
      categories.value = await fetchNewsCategories()
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

  /** 某根菜单 id 下的分类（parentId === menuId） */
  function listForMenu(menuId: number, onlyEnabled = true): NewsCategory[] {
    return categoriesForMenu(menuId, enabledCategories.value, onlyEnabled)
  }

  /** 某页面根菜单下的分类 */
  function listForPage(pageId: number, onlyEnabled = true): NewsCategory[] {
    const root = useSiteMenusStore().rootMenuForPage(pageId)
    if (!root) return []
    return listForMenu(root.id, onlyEnabled)
  }

  function hasCategoriesForPage(pageId: number): boolean {
    return listForPage(pageId).length > 0
  }

  /** 侧栏 / 顶栏下拉：page → rootMenu → categories */
  function sidebarItemsForPage(pageId: number): { name: string; path: string }[] {
    const sitePages = useSitePagesStore()
    const page = sitePages.pageById(pageId)
    const root = useSiteMenusStore().rootMenuForPage(pageId)
    if (!page || !root) return []
    const basePath = normalizePagePath(page.path)
    return newsCategorySidebarItems(basePath, enabledCategories.value, root.id)
  }

  function categoryById(id: number): NewsCategory | undefined {
    return enabledCategories.value.find((c) => c.id === id)
  }

  function categoryByCode(code: string): NewsCategory | undefined {
    const key = code?.trim()
    if (!key) return undefined
    return enabledCategories.value.find((c) => c.code === key)
  }

  /**
   * 当前路由对应的分类（须属于该页根菜单）
   * URL 中 category_id 对应 /news/show-list 的 categoryId
   */
  function findCategoryByRoute(
    pageId: number,
    fullPath: string,
    routeQuery?: RouteLocationNormalizedLoaded['query']
  ): NewsCategory | undefined {
    const root = useSiteMenusStore().rootMenuForPage(pageId)
    if (!root) return undefined

    let categoryId = parseCategoryIdFromFullPath(fullPath)
    if (categoryId <= 0 && routeQuery) {
      categoryId = parseCategoryIdFromRoute({ query: routeQuery })
    }
    if (categoryId <= 0) return undefined

    const category = categoryById(categoryId)
    if (!category || category.parentId !== root.id) return undefined
    return category
  }

  /** 首页等：按页面顺序取前 N 个分类 */
  function pickHomeCategories(limit = 2): NewsCategory[] {
    const sitePages = useSitePagesStore()
    const picked: NewsCategory[] = []
    for (const page of [...sitePages.enabledPages].sort((a, b) => a.id - b.id)) {
      for (const category of listForPage(page.id)) {
        picked.push(category)
        if (picked.length >= limit) return picked
      }
    }
    return picked
  }

  return {
    categories,
    loaded,
    loading,
    enabledCategories,
    ensureLoaded,
    listForMenu,
    listForPage,
    hasCategoriesForPage,
    sidebarItemsForPage,
    categoryById,
    categoryByCode,
    findCategoryByRoute,
    pickHomeCategories
  }
})
