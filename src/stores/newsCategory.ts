import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { NewsCategory } from '@/types/newsCategory'
import { fetchEnabledNewsCategories } from '@/api/newsCategory'

/** 侧栏 / 顶栏用的 `{ name, path }`，path 为 `/news/c/:id` */
export interface NewsCategoryMenuItem {
  name: string
  path: string
  id: number
  code: string
}

function sortCategories(list: NewsCategory[]): NewsCategory[] {
  return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

/**
 * 新闻分类菜单数据：启用分类列表，供侧栏与导航拉取。
 */
export const useNewsCategoryStore = defineStore('newsCategory', () => {
  const categories = ref<NewsCategory[]>([])
  const loaded = ref(false)
  const loading = ref(false)

  const menuItems = computed<NewsCategoryMenuItem[]>(() =>
    sortCategories(categories.value.filter((c) => c.status)).map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      path: `/news/c/${c.id}`
    }))
  )

  async function ensureLoaded(): Promise<void> {
    if (loaded.value) return
    loading.value = true
    try {
      const res = await fetchEnabledNewsCategories()
      categories.value = res.success && res.data?.items ? res.data.items : []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  /** 按后端 code 取分类 id（首页区块「更多」等） */
  function categoryIdByCode(...codes: string[]): number | undefined {
    for (const code of codes) {
      const row = categories.value.find((c) => c.code === code)
      if (row) return row.id
    }
    return undefined
  }

  return {
    categories,
    loaded,
    loading,
    menuItems,
    ensureLoaded,
    categoryIdByCode
  }
})
