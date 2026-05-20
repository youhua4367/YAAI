import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Router } from 'vue-router'
import { fetchPages } from '@/api/page'
import type { SitePage } from '@/types/sitePage'
import { normalizePagePath, shouldRegisterDynamicRoute } from '@/utils/sitePageNav'
import { createBuiltinModuleRoute } from '@/router/builtinModuleRoutes'

/** 后端不可用时仅保留首页兜底 */
const FALLBACK_HOME_PAGE: SitePage = {
  id: 1,
  name: '首页',
  code: 'home',
  path: '/',
  pageType: 'portal',
  title: '首页',
  status: true,
  currentVersionId: null
}

export const useSitePagesStore = defineStore('sitePages', () => {
  const pages = ref<SitePage[]>([])
  const loaded = ref(false)
  const loading = ref(false)
  const routesRegistered = ref(false)
  const usingFallback = ref(false)
  const loadError = ref<string | null>(null)

  const enabledPages = computed(() =>
    pages.value.filter((p) => p.status).sort((a, b) => a.id - b.id)
  )

  function pageByCode(code: string): SitePage | undefined {
    return enabledPages.value.find((p) => p.code === code)
  }

  function basePathByCode(code: string): string | undefined {
    const page = pageByCode(code)
    return page ? normalizePagePath(page.path) : undefined
  }

  function pageByPath(path: string): SitePage | undefined {
    const normalized = normalizePagePath(path)
    return enabledPages.value.find((p) => normalizePagePath(p.path) === normalized)
  }

  function pageById(id: number): SitePage | undefined {
    return enabledPages.value.find((p) => p.id === id)
  }

  function channelPage(): SitePage | undefined {
    return enabledPages.value.find((p) => p.pageType === 'channel')
  }

  async function ensureLoaded(): Promise<void> {
    if (loaded.value) return
    loading.value = true
    usingFallback.value = false
    loadError.value = null
    try {
      const res = await fetchPages({ status: true, current: 1, size: 100 })
      pages.value = res.success && res.data?.records ? res.data.records : []
      if (!pages.value.length) {
        usingFallback.value = true
        pages.value = [FALLBACK_HOME_PAGE]
        loadError.value = '页面列表为空，仅显示首页'
      }
    } catch {
      usingFallback.value = true
      pages.value = [FALLBACK_HOME_PAGE]
      loadError.value = '无法连接后端，仅显示首页'
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

  function registerSiteRoutes(router: Router): void {
    if (routesRegistered.value) return

    for (const page of enabledPages.value) {
      const builtin = createBuiltinModuleRoute(page)
      if (builtin) {
        const name = typeof builtin.name === 'string' ? builtin.name : undefined
        if (!name || !router.hasRoute(name)) {
          router.addRoute(builtin)
        }
        continue
      }

      if (!shouldRegisterDynamicRoute(page)) continue

      const path = normalizePagePath(page.path)
      const name = `SitePage_${page.id}`
      if (router.hasRoute(name)) continue

      router.addRoute({
        path,
        name,
        component: () => import('@/views/cms/DynamicPage.vue'),
        meta: {
          pageId: page.id,
          pageCode: page.code,
          pageTitle: page.title ?? page.name
        }
      })
    }

    routesRegistered.value = true
  }

  return {
    pages,
    loaded,
    loading,
    routesRegistered,
    usingFallback,
    loadError,
    enabledPages,
    pageByCode,
    basePathByCode,
    pageByPath,
    pageById,
    channelPage,
    ensureLoaded,
    registerSiteRoutes
  }
})
