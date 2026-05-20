import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchShowAllSiteConfigs } from '@/api/siteConfig'
import type { SiteConfig } from '@/types/siteConfig'
import { sortConfigsById } from '@/utils/siteConfigFormat'

export const useSiteConfigStore = defineStore('siteConfig', () => {
  const configs = ref<SiteConfig[]>([])
  const loaded = ref(false)
  const loading = ref(false)

  const configsSortedById = computed(() => sortConfigsById(configs.value))

  /** 除 id 最大项外，按 id 升序的主区域配置 */
  const mainFooterConfigs = computed(() => {
    const sorted = configsSortedById.value
    if (sorted.length <= 1) return []
    return sorted.slice(0, -1)
  })

  /** id 最大的一项 → 底部版权栏 */
  const bottomFooterConfig = computed(() => {
    const sorted = configsSortedById.value
    if (!sorted.length) return null
    return sorted[sorted.length - 1]!
  })

  function get(key: string): string | undefined {
    const row = configs.value.find((c) => c.configKey === key)
    const v = row?.configValue
    return v != null && v !== '' ? v : undefined
  }

  async function ensureLoaded(): Promise<void> {
    if (loaded.value) return
    loading.value = true
    try {
      const res = await fetchShowAllSiteConfigs()
      configs.value = res.success && res.data?.configs ? res.data.configs : []
    } catch {
      configs.value = []
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

  return {
    configs,
    loaded,
    loading,
    configsSortedById,
    mainFooterConfigs,
    bottomFooterConfig,
    get,
    ensureLoaded
  }
})
