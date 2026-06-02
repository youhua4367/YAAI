import { computed, ref, watch, type Ref } from 'vue'
import { fetchNewsShowList } from '@/api/news'
import type { NewsItem } from '@/types/news'

export interface NewsListItem {
  id: string
  title: string
  date?: string
}

const DEFAULT_PAGE_SIZE = 10

function formatListDate(publishTime: string | null | undefined): string | undefined {
  if (!publishTime) return undefined
  return publishTime.length >= 10 ? publishTime.substring(0, 10) : publishTime
}

function normalizePageSize(size: number | undefined): number {
  if (size == null || !Number.isFinite(size)) return DEFAULT_PAGE_SIZE
  const n = Math.floor(size)
  if (n < 1) return DEFAULT_PAGE_SIZE
  if (n > 100) return 100
  return n
}

/**
 * 按 news_category.id 分页展示新闻：`GET /news/show-list?category_id=N&page=P&page_size=S`
 */
export function useNewsListByCategoryId(
  categoryId: Ref<number>,
  page: Ref<number>,
  pageSize?: Ref<number | undefined>
) {
  const rawList = ref<NewsItem[]>([])
  const total = ref(0)
  const loading = ref(false)

  const resolvedPageSize = computed(() => normalizePageSize(pageSize?.value))

  const items = computed<NewsListItem[]>(() =>
    rawList.value.map((n) => ({
      id: String(n.id),
      title: n.title,
      date: formatListDate(n.publishTime)
    }))
  )

  const totalPages = computed(() => {
    const size = resolvedPageSize.value
    if (size <= 0 || total.value <= 0) return 0
    return Math.ceil(total.value / size)
  })

  async function load() {
    const id = categoryId.value
    if (!Number.isFinite(id) || id <= 0) {
      rawList.value = []
      total.value = 0
      return
    }

    loading.value = true
    try {
      const res = await fetchNewsShowList({
        category_id: id,
        page: page.value,
        page_size: resolvedPageSize.value
      })
      if (res.success && res.data) {
        rawList.value = res.data.items ?? []
        total.value = res.data.total ?? 0
      } else {
        rawList.value = []
        total.value = 0
      }
    } catch {
      rawList.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  watch([categoryId, page, resolvedPageSize], load, { immediate: true })

  return { items, rawList, total, totalPages, loading, load }
}
