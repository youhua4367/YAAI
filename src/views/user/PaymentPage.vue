<template>
  <div class="payment-page">
    <div class="page-header">
      <h2 class="page-title">会费缴纳</h2>
      <p class="page-subtitle">审核通过后可缴费；完成缴费后，满一年再续费。</p>
    </div>

    <div v-if="pageLoading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ loadingText }}</p>
    </div>

    <div v-else-if="pageError" class="error-state">
      <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
      <p class="error-text">{{ pageError }}</p>
      <button class="btn-retry" @click="initializePage">重新加载</button>
    </div>

    <div v-else-if="viewState === 'pending-review'" class="result-section info-section">
      <div class="result-icon info"><i class="fas fa-hourglass-half"></i></div>
      <h3>审核中</h3>
      <p>您的会员申请正在审核，审核通过后系统会提醒您缴费。</p>
    </div>

    <div v-else-if="viewState === 'not-approved'" class="result-section info-section">
      <div class="result-icon info"><i class="fas fa-info-circle"></i></div>
      <h3>暂不能缴费</h3>
      <p>当前会员资料尚未通过审核，请先完成评估流程。</p>
    </div>

    <div v-else-if="viewState === 'active'" class="result-section success-section">
      <div class="result-icon success"><i class="fas fa-check-circle"></i></div>
      <h3>当前无需缴费</h3>
      <p>{{ activeHint }}</p>
      <div v-if="renewalDeadlineText !== '-'" class="summary-card">
        <div class="summary-row">
          <span>有效期至</span>
          <strong>{{ renewalDeadlineText }}</strong>
        </div>
        <div v-if="remainingDaysText" class="summary-row">
          <span>距离下次续费</span>
          <strong>{{ remainingDaysText }}</strong>
        </div>
      </div>
    </div>

    <div v-else-if="order" class="payment-content">
      <div class="order-card">
        <div class="card-header">
          <span class="card-label">{{ orderModeText }}</span>
          <span :class="['status-badge', statusClass]">{{ statusText }}</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="label">会员类型</span>
            <span class="value">{{ categoryName || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">订单编号</span>
            <span class="value mono">{{ order.outTradeNo }}</span>
          </div>
          <div class="info-row">
            <span class="label">创建时间</span>
            <span class="value">{{ formatTime(order.createdAt) }}</span>
          </div>
          <div v-if="renewalDeadlineText !== '-'" class="info-row">
            <span class="label">续费基准</span>
            <span class="value">{{ renewalDeadlineText }}</span>
          </div>
          <div class="info-row highlight">
            <span class="label">应付金额</span>
            <span class="amount">¥{{ (amount ?? order.amount ?? 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div v-if="isPaid" class="result-section success-section">
        <div class="result-icon success"><i class="fas fa-check-circle"></i></div>
        <h3>支付成功</h3>
        <p>您的会费已缴纳成功，系统已为您刷新会员状态。</p>
      </div>

      <div v-else-if="isExpired" class="result-section expired-section">
        <div class="result-icon expired"><i class="fas fa-clock"></i></div>
        <h3>订单已过期</h3>
        <p>当前订单已超过支付时限，请重新创建新的缴费订单。</p>
        <button class="btn-primary" @click="createFreshOrder">重新创建订单</button>
      </div>

      <div v-else class="pay-section">
        <div class="summary-card">
          <div class="summary-row">
            <span>缴费原因</span>
            <strong>{{ paymentReason }}</strong>
          </div>
          <div v-if="renewalDeadlineText !== '-'" class="summary-row">
            <span>缴费判断时间</span>
            <strong>{{ renewalDeadlineText }}</strong>
          </div>
        </div>

        <div class="countdown-box">
          <i class="fas fa-hourglass-half"></i>
          <span>剩余支付时间</span>
          <span class="countdown-time" :class="{ warning: remainingSeconds <= 60 }">
            {{ countdownText }}
          </span>
        </div>

        <div class="pay-actions">
          <button class="btn-alipay" @click="openPayUrl" :disabled="payOpened && polling">
            <i class="fab fa-alipay"></i>
            {{ payOpened ? '已打开支付宝' : '打开支付宝支付' }}
          </button>
          <button class="btn-check" @click="manualCheck" :disabled="polling">
            <i class="fas fa-sync-alt" :class="{ spinning: polling }"></i>
            {{ polling ? '查询中...' : '我已完成支付' }}
          </button>
        </div>

        <p class="pay-hint">
          系统会优先复用您当前未过期的待支付订单；只有在没有可用订单时，才会创建新的缴费订单。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createPaymentOrder, getMemberOrderDetail, getMemberOrderList } from '@/api/member'
import { useMemberProfile } from '@/composables/useMemberProfile'
import { useCurrentUserStore } from '@/stores/currentUser'
import type { OrderCreateVO, OrderVO } from '@/types/userCenter'
import {
  findLatestPaidOrder,
  findReusableUnpaidOrder,
  formatDateFromObject,
  formatDateTime,
  getRemainingDays,
  isActiveMember,
  isAuditApproved,
  isPendingApplication,
  isPendingAudit,
  resolveRenewalDeadline
} from '@/utils/membershipPayment'

type PaymentViewState =
  | 'pending-review'
  | 'not-approved'
  | 'active'
  | 'pay'

const emit = defineEmits<{
  (e: 'payment-success'): void
}>()

const { memberSingle, companyMemberInfo, fetchMemberSingle, auditStatus } = useMemberProfile()
const currentUserStore = useCurrentUserStore()

const order = ref<OrderVO | null>(null)
const orderList = ref<OrderVO[]>([])
const payUrl = ref('')
const amount = ref<number | null>(null)
const categoryName = ref('')
const pageLoading = ref(true)
const loadingText = ref('正在加载缴费信息...')
const pageError = ref('')
const polling = ref(false)
const payOpened = ref(false)
const viewState = ref<PaymentViewState>('not-approved')
const paymentReason = ref('会员审核通过后首次缴费')
const renewalDeadline = ref<Date | null>(null)

const countdownText = ref('--:--')
const remainingSeconds = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null
let pollTimer: ReturnType<typeof setInterval> | null = null

const memberId = computed(() => {
  if (companyMemberInfo.value?.memberId) return companyMemberInfo.value.memberId
  return memberSingle.value?.memberId ?? null
})

const latestUploadTime = computed(() => {
  if (companyMemberInfo.value?.businessLicenseUrl) {
    const candidates = [
      companyMemberInfo.value.qualificationList?.[0]?.uploadTime,
      companyMemberInfo.value.honorList?.[0]?.uploadTime,
      companyMemberInfo.value.otherList?.[0]?.uploadTime,
      companyMemberInfo.value.createdAt
    ].filter(Boolean) as string[]

    return candidates[0] ?? null
  }

  const attachments = [
    ...(memberSingle.value?.qualificationList ?? []),
    ...(memberSingle.value?.honorList ?? []),
    ...(memberSingle.value?.otherList ?? [])
  ]

  const sorted = attachments
    .map(item => item.uploadTime)
    .filter(Boolean)
    .sort((a, b) => new Date(b as string).getTime() - new Date(a as string).getTime())

  return sorted[0] ?? memberSingle.value?.createdAt ?? null
})

const isPaid = computed(() => order.value?.status === 'PAID')
const isExpired = computed(() => {
  if (!order.value?.expireTime) return false
  return new Date(order.value.expireTime).getTime() <= Date.now()
})

const statusText = computed(() => {
  const map: Record<string, string> = { UNPAID: '待支付', PAID: '已支付' }
  return map[order.value?.status ?? ''] ?? order.value?.status ?? ''
})

const statusClass = computed(() => {
  const map: Record<string, string> = { UNPAID: 'unpaid', PAID: 'paid' }
  return map[order.value?.status ?? ''] ?? ''
})

const renewalDeadlineText = computed(() => {
  if (!renewalDeadline.value) return '-'
  return formatDateFromObject(renewalDeadline.value)
})

const remainingDaysText = computed(() => {
  const days = getRemainingDays(renewalDeadline.value)
  if (days === null) return ''
  if (days <= 0) return '已到续费时间'
  return `还有 ${days} 天`
})

const activeHint = computed(() => {
  if (!renewalDeadline.value) return '您已完成会费缴纳，当前会籍有效。'
  const days = getRemainingDays(renewalDeadline.value)
  if (days === null) return '您已完成会费缴纳，当前会籍有效。'
  return days > 0
    ? `您已完成会费缴纳，当前无需重复创建订单。`
    : '您的续费时间已到，请完成新一年的会费缴纳。'
})

const orderModeText = computed(() => {
  if (paymentReason.value.includes('续费')) return '续费订单'
  return '缴费订单'
})

function formatTime(value?: string | null) {
  return formatDateTime(value)
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function startCountdown() {
  stopCountdown()
  countdownTimer = setInterval(() => {
    if (!order.value?.expireTime) return
    const diff = Math.max(0, new Date(order.value.expireTime).getTime() - Date.now())
    remainingSeconds.value = Math.ceil(diff / 1000)
    const min = Math.floor(remainingSeconds.value / 60)
    const sec = remainingSeconds.value % 60
    countdownText.value = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    if (remainingSeconds.value <= 0) {
      stopCountdown()
      stopPolling()
    }
  }, 1000)
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(() => {
    void checkPaymentStatus()
  }, 3000)
}

async function ensureMemberProfile() {
  if (!memberId.value) {
    await fetchMemberSingle(true)
  }
  if (!memberId.value) {
    throw new Error('无法获取会员信息，请确认已完成会员申请。')
  }
}

async function loadOrders() {
  const mid = memberId.value
  if (!mid) {
    orderList.value = []
    return
  }

  const res = await getMemberOrderList(mid)
  if (res.success && res.data) {
    orderList.value = [...res.data].sort((a, b) => {
      const ta = new Date(a.createdAt ?? '').getTime()
      const tb = new Date(b.createdAt ?? '').getTime()
      return tb - ta
    })
    return
  }

  orderList.value = []
}

function applyOrderData(target: OrderVO | null, payload?: Partial<OrderCreateVO>) {
  order.value = target
  payUrl.value = payload?.payUrl || target?.payUrl || ''
  amount.value = payload?.amount ?? target?.amount ?? null
  categoryName.value = payload?.categoryName || categoryName.value || ''

  stopPolling()
  stopCountdown()

  if (!target) return
  if (target.status === 'UNPAID') startCountdown()
}

function resolveCurrentDeadline() {
  const latestPaidOrder = findLatestPaidOrder(orderList.value)
  renewalDeadline.value = resolveRenewalDeadline({
    expiryDate: companyMemberInfo.value?.expiryDate ?? memberSingle.value?.expiryDate,
    latestPaidAt: latestPaidOrder?.paidAt ?? latestPaidOrder?.createdAt,
    latestUploadTime: latestUploadTime.value
  })
}

async function createFreshOrder() {
  const mid = memberId.value
  if (!mid) {
    ElMessage.error('未找到会员信息，请稍后重试。')
    return
  }

  pageLoading.value = true
  loadingText.value = '正在创建缴费订单...'
  pageError.value = ''
  payOpened.value = false

  try {
    const res = await createPaymentOrder({ memberId: mid, paymentMethod: 'alipay' })
    if (!res.success || !res.data) {
      throw new Error(res.message || '创建订单失败')
    }

    applyOrderData(res.data.order, res.data)
    viewState.value = 'pay'
    await loadOrders()
  } catch (error: any) {
    pageError.value = error?.message || '创建订单失败，请稍后重试'
    ElMessage.error(pageError.value)
  } finally {
    pageLoading.value = false
  }
}

async function initializePage() {
  pageLoading.value = true
  loadingText.value = '正在加载缴费信息...'
  pageError.value = ''
  payOpened.value = false
  order.value = null
  stopCountdown()
  stopPolling()

  try {
    await ensureMemberProfile()
    await loadOrders()

    const approved = isAuditApproved(auditStatus.value)

    if (!approved) {
      viewState.value =
        isPendingApplication(auditStatus.value) || isPendingAudit(auditStatus.value)
          ? 'pending-review'
          : 'not-approved'
      return
    }

    resolveCurrentDeadline()

    const dueForPayment =
      !renewalDeadline.value || renewalDeadline.value.getTime() <= Date.now()

    if (!dueForPayment && isActiveMember(auditStatus.value)) {
      viewState.value = 'active'
      paymentReason.value = '当前会籍仍在有效期内'
      return
    }

    paymentReason.value = findLatestPaidOrder(orderList.value)
      ? '距离上次缴费/资料上传已满一年，需要续费'
      : '会员审核通过后首次缴费'

    const reusableOrder = findReusableUnpaidOrder(orderList.value)
    if (reusableOrder) {
      applyOrderData(reusableOrder)
      viewState.value = 'pay'
      return
    }

    await createFreshOrder()
  } catch (error: any) {
    pageError.value = error?.message || '加载缴费信息失败，请稍后重试'
    ElMessage.error(pageError.value)
  } finally {
    pageLoading.value = false
  }
}

async function checkPaymentStatus() {
  if (!order.value?.outTradeNo || polling.value) return
  polling.value = true
  try {
    const res = await getMemberOrderDetail(order.value.outTradeNo)
    if (res.success && res.data) {
      applyOrderData(res.data)
      if (res.data.status === 'PAID') {
        ElMessage.success('支付成功')
        await currentUserStore.fetchCurrentUser(true)
        await fetchMemberSingle(true)
        await loadOrders()
        resolveCurrentDeadline()
        emit('payment-success')
      }
    }
  } catch {
    // ignore polling errors
  } finally {
    polling.value = false
  }
}

function openPayUrl() {
  if (!payUrl.value) return
  window.open(payUrl.value, '_blank')
  payOpened.value = true
  if (!pollTimer) startPolling()
}

async function manualCheck() {
  await checkPaymentStatus()
  if (!isPaid.value) {
    ElMessage.info('暂未检测到支付结果，请稍后再试。')
  }
}

onMounted(() => {
  void initializePage()
})

onUnmounted(() => {
  stopCountdown()
  stopPolling()
})
</script>

<style scoped>
.payment-page {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  color: #ff4d4f;
  margin-bottom: 16px;
}

.error-text {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px;
}

.btn-retry,
.btn-primary {
  padding: 10px 24px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-retry:hover,
.btn-primary:hover {
  background: #1557b0;
}

.order-card,
.summary-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.order-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.card-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.status-badge.unpaid {
  color: #faad14;
  background: #fffbe6;
}

.status-badge.paid {
  color: #52c41a;
  background: #f6ffed;
}

.card-body {
  padding: 20px;
}

.info-row,
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.info-row {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.summary-card {
  padding: 16px 20px;
  margin: 0 auto 24px;
  max-width: 560px;
}

.summary-row + .summary-row {
  margin-top: 12px;
}

.summary-row span {
  color: #64748b;
  font-size: 14px;
}

.summary-row strong {
  color: #1f2937;
  font-size: 14px;
}

.label {
  font-size: 14px;
  color: #999;
}

.value {
  font-size: 14px;
  color: #333;
}

.value.mono {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.info-row.highlight {
  padding-top: 16px;
  margin-top: 4px;
}

.amount {
  font-size: 24px;
  font-weight: 700;
  color: #f5222d;
}

.payment-content,
.result-section,
.pay-section {
  text-align: center;
}

.result-section {
  padding: 40px 0;
}

.result-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.result-icon.success {
  color: #52c41a;
}

.result-icon.expired {
  color: #faad14;
}

.result-icon.info {
  color: #1677ff;
}

.result-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.result-section p {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px;
}

.pay-section {
  padding: 20px 0;
}

.countdown-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-bottom: 28px;
}

.countdown-time {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  font-family: 'Courier New', monospace;
}

.countdown-time.warning {
  color: #f5222d;
}

.pay-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.btn-alipay,
.btn-check {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-alipay {
  background: #1677ff;
  color: #fff;
  border: none;
}

.btn-alipay:hover {
  background: #0958d9;
}

.btn-alipay:disabled {
  background: #a0c4ff;
  cursor: not-allowed;
}

.btn-check {
  background: #fff;
  color: #1a73e8;
  border: 1px solid #1a73e8;
}

.btn-check:hover {
  background: #e6f0fd;
}

.btn-check:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

.pay-hint {
  font-size: 13px;
  color: #999;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}
</style>
