import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNewsCategoryStore } from '@/stores/newsCategory'
import { useSiteMenusStore } from '@/stores/siteMenus'
import { useSitePagesStore } from '@/stores/sitePages'

/**
 * 栏目页上下文：
 * - pageId 来自路由 meta
 * - 子项来自 news_category，归属：category.parentId === 页面根菜单 menu.id
 * - 列表数据：/news/show-list?category_id = category.id
 */
export function usePageContext() {
  const route = useRoute()
  const sitePagesStore = useSitePagesStore()
  const siteMenusStore = useSiteMenusStore()
  const newsCategoryStore = useNewsCategoryStore()

  const pageId = computed(() => route.meta.pageId as number | undefined)

  const page = computed(() => {
    if (pageId.value != null) {
      return sitePagesStore.pageById(pageId.value)
    }
    return sitePagesStore.pageByPath(route.path)
  })

  const rootMenu = computed(() => {
    const id = pageId.value
    if (id == null) return undefined
    return siteMenusStore.rootMenuForPage(id)
  })

  const activeCategory = computed(() => {
    const id = pageId.value
    if (id == null) return undefined
    return newsCategoryStore.findCategoryByRoute(id, route.fullPath, route.query)
  })

  return {
    route,
    pageId,
    page,
    rootMenu,
    activeCategory,
    /** @deprecated 使用 activeCategory */
    activeSubmenu: activeCategory,
    siteMenusStore,
    sitePagesStore,
    newsCategoryStore
  }
}
