<template>
  <div v-if="redirecting" class="channel-redirect-hint">正在进入栏目…</div>
  <ContentList v-else-if="showNewsList" :items="items" :basePath="listBasePath" />
  <div v-else class="channel-placeholder">
    <h2 class="channel-placeholder__title">{{ title }}</h2>
    <p class="channel-placeholder__hint">页面内容将根据后台配置的路径与 render-tree 渲染。</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContentList from '@/components/common/ContentList.vue'
import { useNewsListByCategoryId } from '@/composables/useNewsListByCategoryId'
import { useSiteMenusStore } from '@/stores/siteMenus'
import { useSitePagesStore } from '@/stores/sitePages'
import { isSameMenuPath } from '@/utils/menuPath'
import { normalizePagePath } from '@/utils/paths'

const route = useRoute()
const router = useRouter()
const siteMenusStore = useSiteMenusStore()
const sitePagesStore = useSitePagesStore()

const redirecting = ref(false)

const pageId = computed(() => route.meta.pageId as number | undefined)
const pageType = computed(() => String(route.meta.pageType ?? ''))

const page = computed(() =>
  pageId.value != null
    ? sitePagesStore.enabledPages.find((p) => p.id === pageId.value)
    : undefined
)

const moduleBase = computed(() =>
  page.value ? normalizePagePath(page.value.path) : normalizePagePath(route.path)
)

const title = computed(
  () => (route.meta.pageTitle as string) || page.value?.title || page.value?.name || '栏目'
)

const segment = computed(() => {
  const raw = route.params.segment
  if (raw == null) return ''
  const s = Array.isArray(raw) ? raw[0] : raw
  return typeof s === 'string' ? s : ''
})

/** 当前子菜单 id = show-list 的 category_id（匹配菜单 externalUrl 对应路径） */
const menuCategoryId = computed(() => {
  const pid = pageId.value
  if (pid == null) return -1
  return siteMenusStore.categoryIdFromRoute(pid, route.fullPath)
})

const activeSubmenuPath = computed(() => {
  const pid = pageId.value
  if (pid == null) return route.fullPath
  const menu = siteMenusStore.findSubmenuByRoute(pid, route.fullPath)
  if (menu) {
    return siteMenusStore.pathByMenuCode(menu.code) ?? route.fullPath
  }
  return route.fullPath
})

const showNewsList = computed(
  () => pageType.value === 'channel' && menuCategoryId.value > 0
)

const needsDefaultRedirect = computed(() => {
  if (segment.value) return false
  const pid = pageId.value
  if (pid == null) return false
  const base = moduleBase.value
  if (isSameMenuPath(route.fullPath, base)) return true
  return pageType.value === 'single'
})

const { items } = useNewsListByCategoryId(menuCategoryId)

const listBasePath = computed(() => activeSubmenuPath.value)

async function redirectToFirstMenuItem() {
  const pid = pageId.value
  if (pid == null || !needsDefaultRedirect.value) {
    redirecting.value = false
    return
  }

  redirecting.value = true
  await siteMenusStore.ensureLoaded()
  const sidebar = siteMenusStore.sidebarItemsForPage(pid)
  const target = sidebar[0]?.path

  if (target && !target.startsWith('http') && !isSameMenuPath(route.fullPath, target)) {
    await router.replace(target)
  }
  redirecting.value = false
}

onMounted(() => {
  void siteMenusStore.ensureLoaded()
  if (needsDefaultRedirect.value) {
    void redirectToFirstMenuItem()
  }
})

watch(
  () => route.fullPath,
  () => {
    if (needsDefaultRedirect.value) {
      void redirectToFirstMenuItem()
    }
  }
)
</script>

<style scoped>
.channel-redirect-hint {
  padding: 48px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}

.channel-placeholder {
  padding: 24px 0;
}

.channel-placeholder__title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.channel-placeholder__hint {
  color: #94a3b8;
  font-size: 14px;
}
</style>
