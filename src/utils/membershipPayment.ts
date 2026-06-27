import type { OrderVO } from '@/types/userCenter'

const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000

export type MemberAuditStatusValue =
  | '待申请'
  | '待审核'
  | '待缴费'
  | '有效会员'

function parseDate(value?: string | null): Date | null {
  if (!value) return null
  const time = new Date(value).getTime()
  if (Number.isNaN(time)) return null
  return new Date(time)
}

function addOneYear(date: Date): Date {
  return new Date(date.getTime() + ONE_YEAR_IN_MS)
}

function getOrderTime(order: OrderVO, preferred: 'paidAt' | 'createdAt' = 'createdAt'): number {
  const primary = preferred === 'paidAt' ? order.paidAt : order.createdAt
  const fallback = preferred === 'paidAt' ? order.createdAt : order.paidAt
  return parseDate(primary)?.getTime() ?? parseDate(fallback)?.getTime() ?? 0
}

export function normalizeAuditStatus(status?: string | null): MemberAuditStatusValue | null {
  const value = status?.trim()
  if (!value) return null
  if (value === '待申请') return '待申请'
  if (value === '待审核') return '待审核'
  if (value === '待缴费') return '待缴费'
  if (value === '有效会员') return '有效会员'
  return null
}

export function isPendingApplication(status?: string | null): boolean {
  return normalizeAuditStatus(status) === '待申请'
}

export function isPendingAudit(status?: string | null): boolean {
  return normalizeAuditStatus(status) === '待审核'
}

export function isApprovedPendingPayment(status?: string | null): boolean {
  return normalizeAuditStatus(status) === '待缴费'
}

export function isActiveMember(status?: string | null): boolean {
  return normalizeAuditStatus(status) === '有效会员'
}

export function isAuditApproved(status?: string | null): boolean {
  const normalized = normalizeAuditStatus(status)
  return normalized === '待缴费' || normalized === '有效会员'
}

export function canViewOrderByStatus(status?: string | null): boolean {
  return isAuditApproved(status)
}

export function findReusableUnpaidOrder(orders: OrderVO[]): OrderVO | null {
  const now = Date.now()
  const candidates = orders
    .filter(order => order.status === 'UNPAID')
    .filter(order => {
      const expireTime = parseDate(order.expireTime)?.getTime()
      return !expireTime || expireTime > now
    })
    .sort((a, b) => getOrderTime(b) - getOrderTime(a))

  return candidates[0] ?? null
}

export function findLatestPaidOrder(orders: OrderVO[]): OrderVO | null {
  const candidates = orders
    .filter(order => order.status === 'PAID')
    .sort((a, b) => getOrderTime(b, 'paidAt') - getOrderTime(a, 'paidAt'))

  return candidates[0] ?? null
}

export function resolveRenewalDeadline(params: {
  expiryDate?: string | null
  latestPaidAt?: string | null
  latestUploadTime?: string | null
}): Date | null {
  const expiryDate = parseDate(params.expiryDate)
  if (expiryDate) return expiryDate

  const latestPaidAt = parseDate(params.latestPaidAt)
  if (latestPaidAt) return addOneYear(latestPaidAt)

  const latestUploadTime = parseDate(params.latestUploadTime)
  if (latestUploadTime) return addOneYear(latestUploadTime)

  return null
}

export function getRemainingDays(target: Date | null): number | null {
  if (!target) return null
  return Math.ceil((target.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '-'
  return value.replace('T', ' ').substring(0, 19)
}

export function formatDateFromObject(date: Date | null): string {
  if (!date) return '-'
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
