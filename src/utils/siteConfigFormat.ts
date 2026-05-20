import type { FriendLink, SiteConfig } from '@/types/siteConfig'

export function parseFriendLinks(raw: string | null | undefined): FriendLink[] {
  if (!raw?.trim()) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is FriendLink =>
        typeof item === 'object' &&
        item != null &&
        typeof (item as FriendLink).name === 'string' &&
        typeof (item as FriendLink).url === 'string'
    )
  } catch {
    return []
  }
}

export function resolvePublicAssetUrl(path: string | null | undefined): string {
  if (!path?.trim()) return ''
  const p = path.trim()
  if (/^https?:\/\//i.test(p)) return p
  return p.startsWith('/') ? p : `/${p}`
}

export function isImageConfigValue(key: string, value: string | null | undefined): boolean {
  if (key === 'site_logo') return true
  const v = value?.trim() ?? ''
  return /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(v) || v.startsWith('/images/')
}

export function sortConfigsById(configs: SiteConfig[]): SiteConfig[] {
  return [...configs].sort((a, b) => a.id - b.id)
}
