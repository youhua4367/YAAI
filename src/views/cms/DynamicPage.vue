<template>
  <component :is="shellComponent" v-bind="shellProps">
    <div
      class="dynamic-page"
      :class="{
        'dynamic-page--home': isHomePage,
        'dynamic-page--embedded': isEmbeddedInSidebar && !isHomePage
      }"
    >
      <div v-if="loading" class="dynamic-page__state">
        <p class="dynamic-page__hint">页面加载中…</p>
      </div>

      <div v-else-if="loadError" class="dynamic-page__state dynamic-page__state--error">
        <h1 v-if="displayTitle" class="dynamic-page__title">{{ displayTitle }}</h1>
        <p class="dynamic-page__hint">{{ loadError }}</p>
        <p v-if="page" class="dynamic-page__meta">路径：{{ page.path }}</p>
        <button type="button" class="dynamic-page__retry" @click="reload">重试</button>
      </div>

      <div v-else-if="!page" class="dynamic-page__state">
        <p class="dynamic-page__hint">未找到页面配置</p>
      </div>

      <div v-else-if="versionId == null" class="dynamic-page__state container">
        <h1 class="dynamic-page__title">{{ displayTitle }}</h1>
        <p class="dynamic-page__hint">该页面暂无内容（未绑定页面版本）。</p>
      </div>

      <div v-else-if="!rootNode" :class="emptyStateClass">
        <h1 class="dynamic-page__title">{{ displayTitle }}</h1>
        <p class="dynamic-page__hint">页面内容为空</p>
      </div>

      <div v-else-if="isHomePage && rootNode">
        <HomeDynamicContent :root="rootNode" />
      </div>

      <div v-else class="dynamic-page__content" :class="{ container: !isEmbeddedInSidebar }">
        <NodeRenderer :node="rootNode" />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPageNodeTree } from '@/api/public-node-tree'
import HomeDynamicContent from '@/views/home/HomeDynamicContent.vue'
import NodeRenderer from '@/components/lowcode/NodeRenderer.vue'
import SidebarLayout from '@/components/layout/SidebarLayout.vue'
import { useNewsCategoryStore } from '@/stores/newsCategory'
import { useSitePagesStore } from '@/stores/sitePages'
import type { PageNodeTreeNode } from '@/types/lowcode'
import { pickRootNode } from '@/utils/buildNodeTree'
import { normalizePagePath } from '@/utils/paths'

const route = useRoute()
const sitePagesStore = useSitePagesStore()
const newsCategoryStore = useNewsCategoryStore()

const loading = ref(false)
const loadError = ref<string | null>(null)
const rootNode = ref<PageNodeTreeNode | null>(null)

const page = computed(() => {
  const id = route.meta.pageId as number | undefined
  if (id != null) {
    return sitePagesStore.enabledPages.find((p) => p.id === id)
  }
  return sitePagesStore.pageByPath(route.path)
})

const displayTitle = computed(
  () => (route.meta.pageTitle as string) || page.value?.title || page.value?.name || '页面'
)

const versionId = computed(() => page.value?.currentVersionId ?? null)

const isHomePage = computed(() => {
  const path = page.value?.path ?? route.path
  return normalizePagePath(path) === '/' || page.value?.code === 'home'
})

/** 已在 SidebarLayout 的 router-view 内（ChannelModule 子路由），避免重复套侧栏 */
const isInsideSidebarShell = computed(() =>
  route.matched.some(
    (record) =>
      typeof record.name === 'string' && record.name.startsWith('ChannelModule_')
  )
)

/** portal 等顶层路由：有子菜单时套侧栏外壳 */
const useSidebarShell = computed(() => {
  if (isHomePage.value || isInsideSidebarShell.value) return false
  const p = page.value
  if (!p) return false
  if (p.pageType === 'channel' || p.pageType === 'single') return true
  return newsCategoryStore.hasCategoriesForPage(p.id)
})

const isEmbeddedInSidebar = computed(
  () => isInsideSidebarShell.value || useSidebarShell.value
)

const shellComponent = computed(() =>
  useSidebarShell.value && page.value ? SidebarLayout : 'div'
)

const shellProps = computed(() =>
  useSidebarShell.value && page.value ? { pageId: page.value.id } : {}
)

const emptyStateClass = computed(() => {
  if (isHomePage.value) return 'dynamic-page__state dynamic-page__state--home'
  if (isEmbeddedInSidebar.value) return 'dynamic-page__state dynamic-page__state--embedded'
  return 'dynamic-page__state container'
})

async function loadTree(): Promise<void> {
  const currentPage = page.value
  const currentVersionId = currentPage?.currentVersionId

  rootNode.value = null
  loadError.value = null

  if (!currentPage) return

  if (currentVersionId == null) return

  loading.value = true
  try {
    const res = await fetchPageNodeTree(currentVersionId)
    const nodes = res.data?.nodes ?? []

    if (!nodes.length) {
      rootNode.value = null
      return
    }

    rootNode.value = pickRootNode(nodes)
    if (!rootNode.value) {
      console.warn('[DynamicPage] no root node for version:', currentVersionId)
    }
  } catch (err) {
    console.warn('[DynamicPage] fetchPageNodeTree failed:', currentVersionId, err)
    loadError.value = '加载失败，请重试'
    rootNode.value = null
  } finally {
    loading.value = false
  }
}

function reload(): void {
  void loadTree()
}

watch(
  () => [page.value?.id, page.value?.currentVersionId, route.fullPath] as const,
  () => {
    void loadTree()
  },
  { immediate: true }
)
</script>

<style scoped>
.dynamic-page {
  min-height: 50vh;
}

.dynamic-page:not(.dynamic-page--home):not(.dynamic-page--embedded) {
  padding: 48px 0 80px;
  background: #f8fafc;
}

.dynamic-page--embedded {
  min-height: auto;
}

.dynamic-page--embedded .dynamic-page__state {
  min-height: 200px;
  padding: 24px 0;
}

.dynamic-page__state {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px 80px;
  text-align: center;
}

.dynamic-page__state--error {
  background: #f8fafc;
}

.dynamic-page--home {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}

.dynamic-page--home .dynamic-page__state {
  min-height: 100vh;
}

.dynamic-page--home .dynamic-page__hint,
.dynamic-page--home .dynamic-page__title {
  color: #e2e8f0;
}

.dynamic-page__content {
  width: 100%;
}

.dynamic-page__title {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}

.dynamic-page__meta {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
}

.dynamic-page__hint {
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}

.dynamic-page__retry {
  margin-top: 16px;
  padding: 8px 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #334155;
  font-size: 14px;
  cursor: pointer;
}

.dynamic-page__retry:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}
</style>
