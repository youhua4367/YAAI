/**
 * 内容详情：`/content/:id` 对应 `GET /news/{id}` 返回的数据（由 ContentDetail 请求并渲染）
 */
export function contentPath(id: string | number): string {
  return `/content/${encodeURIComponent(String(id))}`
}
