/** 规范化站点 path（保证以 `/` 开头，去掉末尾 `/`） */
export function normalizePagePath(path: string): string {
  const trimmed = path.trim()
  if (!trimmed || trimmed === '/') return '/'
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withSlash.replace(/\/+$/, '') || '/'
}

/** 拼接模块根路径与子路径（子路径可带或不带前导 `/`） */
export function joinPaths(base: string, segment?: string): string {
  const root = normalizePagePath(base)
  if (!segment) return root
  const seg = segment.replace(/^\/+/, '')
  if (!seg) return root
  if (root === '/') return `/${seg}`
  return `${root}/${seg}`
}

/** 当前路由是否落在某模块根路径下（含根路径自身） */
export function isPathUnderModule(routePath: string, moduleBase: string): boolean {
  const base = normalizePagePath(moduleBase)
  const current = normalizePagePath(routePath)
  if (base === '/') return current === '/'
  return current === base || current.startsWith(`${base}/`)
}
