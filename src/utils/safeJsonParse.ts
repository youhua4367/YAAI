export function safeJsonParse<T = Record<string, unknown>>(
  raw: string | null | undefined,
  fallback: T
): T {
  if (raw == null || raw === '') return fallback
  try {
    return JSON.parse(raw) as T
  } catch (err) {
    console.warn('[lowcode] safeJsonParse failed:', raw, err)
    return fallback
  }
}
