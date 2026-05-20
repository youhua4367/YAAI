import { computed } from 'vue'
import { useSitePagesStore } from '@/stores/sitePages'
import { useSiteMenusStore } from '@/stores/siteMenus'
import { normalizePagePath } from '@/utils/paths'

/**
 * 站点路径：来自 GET /pages 与 GET /menus，不写死 /news、/about。
 */
export function useSitePaths() {
  const sitePages = useSitePagesStore()
  const siteMenus = useSiteMenusStore()

  const homePath = computed(() => sitePages.basePathByCode('home') ?? '/')

  const channelPage = computed(() => sitePages.channelPage())

  const newsPath = computed(() =>
    channelPage.value ? normalizePagePath(channelPage.value.path) : ''
  )

  const aboutPage = computed(() =>
    sitePages.enabledPages.find((p) => p.pageType === 'single')
  )

  const aboutIntroductionPath = computed(() => {
    const page = aboutPage.value
    if (!page) return ''
    const items = siteMenus.sidebarItemsForPage(page.id)
    if (items[0]?.path) return items[0].path
    return normalizePagePath(page.path)
  })

  function newsListPath(): string {
    return newsPath.value
  }

  return {
    homePath,
    newsPath,
    aboutPage,
    aboutIntroductionPath,
    newsListPath
  }
}
