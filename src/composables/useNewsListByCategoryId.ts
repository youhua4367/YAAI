import { computed, ref, watch, type Ref } from 'vue'
import { fetchNewsListByCategoryId } from '@/api/news'
import type { NewsItem } from '@/types/news'

export interface NewsListItem {
  id: string
  title: string
  date?: string
}

function formatListDate(publishTime: string | null | undefined): string | undefined {
  if (!publishTime) return undefined
  return publishTime.length >= 10 ? publishTime.substring(0, 10) : publishTime
}

/**
 * 按 news_category.id 展示新闻列表：`GET /news/show-list?category_id=N`
 */
export function useNewsListByCategoryId(categoryId: Ref<number>) {
  const rawList = ref<NewsItem[]>([])

  const items = computed<NewsListItem[]>(() =>
    rawList.value.map((n) => ({
      id: String(n.id),
      title: n.title,
      date: formatListDate(n.publishTime)
    }))
  )

  async function load() {
    const id = categoryId.value
    rawList.value = await fetchNewsListByCategoryId(id)
  }

  watch(categoryId, load, { immediate: true })

  return { items, rawList, load }
}
