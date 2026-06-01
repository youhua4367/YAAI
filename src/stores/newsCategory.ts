import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchNewsCategories } from '@/api/news'
import type { NewsCategory } from '@/types/news'
import { newsCategorySidebarItems } from '@/utils/newsCategoryRoute'

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

  function sidebarItemsForPage(basePath: string): { name: string; path: string }[] {
    return newsCategorySidebarItems(basePath, enabledCategories.value)
  }

  function categoryById(id: number): NewsCategory | undefined {
    return enabledCategories.value.find((c) => c.id === id)
  }

  return {
    categories,
    loaded,
    loading,
    enabledCategories,
    ensureLoaded,
    sidebarItemsForPage,
    categoryById
  }
})
