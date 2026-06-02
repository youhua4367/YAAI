/** 将 propsJson 中的 contentIds 规范为有效数字 id 列表 */
export function normalizeContentIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((value) => (typeof value === 'number' ? value : Number(value)))
    .filter((id) => Number.isFinite(id) && id > 0)
}
