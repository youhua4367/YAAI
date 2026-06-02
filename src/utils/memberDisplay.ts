/** 短字段空值占位（表格/列表常用） */
export const EMPTY_MARK = '—'

/** 长文本空值占位 */
export const EMPTY_TEXT = '暂无'

export function isEmptyValue(value: string | null | undefined): boolean {
  return !value?.trim()
}

/** 单行字段：有值显示原文，否则显示 —（或指定 fallback） */
export function displayValue(value: string | null | undefined, fallback?: string): string {
  const text = value?.trim()
  if (text) return text
  const fb = fallback?.trim()
  if (fb) return fb
  return EMPTY_MARK
}

/** 多行/段落字段：空时显示「暂无」 */
export function displayBlockValue(value: string | null | undefined): string {
  const text = value?.trim()
  return text || EMPTY_TEXT
}

export function formatDateValue(value: string | null | undefined): string {
  const text = value?.trim()
  if (!text) return EMPTY_MARK
  return text.length >= 10 ? text.slice(0, 10) : text
}

/** 用户账号 status：0 待申请，1 待缴费，2 已缴费 */
export function userStatusLabel(status: number | null | undefined): string {
  if (status === 0) return '待申请'
  if (status === 1) return '待缴费'
  if (status === 2) return '已缴费'
  return EMPTY_MARK
}

export function userStatusClass(status: number | null | undefined): string {
  if (status === 1) return 'pending'
  if (status === 2) return 'paid'
  return 'default'
}

export function emptyFieldClass(value: string | null | undefined): Record<string, boolean> {
  return { 'field-empty': isEmptyValue(value) }
}

export function emptyBlockClass(value: string | null | undefined): Record<string, boolean> {
  return { 'field-empty-block': isEmptyValue(value) }
}
