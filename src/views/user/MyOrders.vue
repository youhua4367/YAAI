<template>
  <div class="orders-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">我的缴费</h2>
        <p class="page-subtitle">查看历史订单，也可以直接在这里发起缴费或续费。</p>
      </div>

      <button class="header-pay-btn" type="button" @click="togglePaymentPanel">
        <i class="fas fa-credit-card"></i>
        {{ showPaymentPanel ? '收起缴费' : '立即缴费' }}
      </button>
    </div>

    <div v-if="showPaymentPanel" class="payment-panel">
      <PaymentPage @payment-success="handlePaymentSuccess" />
    </div>

    <div class="filter-section">
      <div class="filter-tabs">
        <span
          v-for="tab in tabs"
          :key="tab.value"
          :class="['tab-item', { active: currentTab === tab.value }]"
          @click="currentTab = tab.value"
        >
          {{ tab.label }}
        </span>
      </div>

      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="请输入订单编号搜索"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" type="button" @click="handleSearch">查询</button>
      </div>
    </div>

    <div class="content-section">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>

      <div v-else-if="loadError" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <p class="empty-text">{{ loadError }}</p>
        <button class="retry-btn" type="button" @click="loadOrders">重新加载</button>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-box-open"></i>
        </div>
        <p class="empty-text">暂无缴费记录</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-search"></i>
        </div>
        <p class="empty-text">没有匹配的订单</p>
      </div>

      <div v-else class="orders-list">
        <div
          v-for="(order, index) in filteredOrders"
          :key="order.id ?? order.outTradeNo ?? index"
          class="order-item"
        >
          <div class="order-header">
            <span class="order-no">订单号：{{ order.outTradeNo || '-' }}</span>
            <span :class="['order-status', order.status.toLowerCase()]">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="order-body">
            <div class="order-info">
              <h4 class="order-title">会员缴费</h4>
              <p class="order-desc">订单日期：{{ order.date || formatTime(order.createdAt) }}</p>
              <span class="order-time">创建时间：{{ formatTime(order.createdAt) }}</span>
            </div>

            <div class="order-amount">
              <span class="amount">¥{{ (order.amount ?? 0).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-footer">
            <button
              v-if="order.status === 'UNPAID'"
              class="btn-pay"
              type="button"
              @click="openPaymentPanel"
            >
              去支付
            </button>
            <button class="btn-detail" type="button" @click="handleDetail(order)">查看详情</button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showDetailDialog" title="订单详情" width="500px">
      <div v-if="detailOrder" class="detail-content">
        <div class="detail-row">
          <span class="detail-label">订单编号</span>
          <span class="detail-value mono">{{ detailOrder.outTradeNo || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">支付方式</span>
          <span class="detail-value">{{ detailOrder.paymentMethod === 'alipay' ? '支付宝' : detailOrder.paymentMethod || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">订单金额</span>
          <span class="detail-value price">¥{{ (detailOrder.amount ?? 0).toFixed(2) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">订单状态</span>
          <span class="detail-value">{{ getStatusText(detailOrder.status) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">创建时间</span>
          <span class="detail-value">{{ formatTime(detailOrder.createdAt) }}</span>
        </div>
        <div v-if="detailOrder.paidAt" class="detail-row">
          <span class="detail-label">支付时间</span>
          <span class="detail-value">{{ formatTime(detailOrder.paidAt) }}</span>
        </div>
        <div v-if="detailOrder.expireTime" class="detail-row">
          <span class="detail-label">过期时间</span>
          <span class="detail-value">{{ formatTime(detailOrder.expireTime) }}</span>
        </div>
        <div v-if="detailOrder.transactionId" class="detail-row">
          <span class="detail-label">交易流水号</span>
          <span class="detail-value mono">{{ detailOrder.transactionId }}</span>
        </div>
        <div v-if="detailOrder.closeReason" class="detail-row">
          <span class="detail-label">关单原因</span>
          <span class="detail-value">{{ detailOrder.closeReason }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getMemberOrderList } from '@/api/member'
import { useMemberProfile } from '@/composables/useMemberProfile'
import { formatDateTime } from '@/utils/membershipPayment'
import type { OrderVO } from '@/types/userCenter'
import PaymentPage from './PaymentPage.vue'

interface Props {
  openPaymentKey?: number
}

const props = defineProps<Props>()

const { memberSingle, companyMemberInfo, fetchMemberSingle } = useMemberProfile()

const tabs = [
  { label: '全部', value: 'all' },
  { label: '已支付', value: 'PAID' },
  { label: '待支付', value: 'UNPAID' }
]

const currentTab = ref('all')
const searchKeyword = ref('')
const orders = ref<OrderVO[]>([])
const loading = ref(true)
const loadError = ref('')
const showDetailDialog = ref(false)
const detailOrder = ref<OrderVO | null>(null)
const showPaymentPanel = ref(false)

const memberId = computed(() => {
  if (companyMemberInfo.value?.memberId) return companyMemberInfo.value.memberId
  return memberSingle.value?.memberId ?? null
})

const filteredOrders = computed(() => {
  let result = orders.value

  if (currentTab.value !== 'all') {
    result = result.filter(order => order.status === currentTab.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(order =>
      String(order.outTradeNo ?? '').toLowerCase().includes(keyword)
    )
  }

  return result
})

function getStatusText(status: string) {
  const map: Record<string, string> = {
    UNPAID: '待支付',
    PAID: '已支付',
    CLOSED: '已关闭'
  }
  return map[status] ?? status
}

function formatTime(value?: string | null) {
  return formatDateTime(value)
}

async function loadOrders() {
  loading.value = true
  loadError.value = ''

  try {
    if (!memberId.value) {
      await fetchMemberSingle(true)
    }

    const mid = memberId.value
    if (!mid) {
      orders.value = []
      loadError.value = '未获取到会员 ID，暂时无法查询缴费记录。'
      return
    }

    const res = await getMemberOrderList(mid)
    if (!res.success) {
      throw new Error(res.message || '订单接口返回失败')
    }

    orders.value = Array.isArray(res.data)
      ? [...res.data].sort((a, b) => {
          const ta = new Date(a.createdAt ?? '').getTime()
          const tb = new Date(b.createdAt ?? '').getTime()
          return tb - ta
        })
      : []
  } catch (error: any) {
    loadError.value = error?.message || '加载订单列表失败'
    ElMessage.error(loadError.value)
  } finally {
    loading.value = false
  }
}

function openPaymentPanel() {
  showPaymentPanel.value = true
}

function togglePaymentPanel() {
  showPaymentPanel.value = !showPaymentPanel.value
}

function handleDetail(order: OrderVO) {
  detailOrder.value = order
  showDetailDialog.value = true
}

function handleSearch() {
  // 搜索由 filteredOrders 自动处理
}

async function handlePaymentSuccess() {
  await loadOrders()
}

watch(
  () => props.openPaymentKey,
  (value, oldValue) => {
    if (value === undefined) return
    if (value !== oldValue) {
      showPaymentPanel.value = true
    }
  }
)

onMounted(() => {
  void loadOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px;
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.header-pay-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #1677ff;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.header-pay-btn:hover {
  background: #0958d9;
}

.payment-panel {
  margin-bottom: 24px;
  border: 1px solid #e6eefb;
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfdff 0%, #ffffff 100%);
  overflow: hidden;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.filter-tabs {
  display: flex;
  gap: 24px;
}

.tab-item {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 4px 0;
  position: relative;
  transition: color 0.2s;
}

.tab-item:hover {
  color: #1a73e8;
}

.tab-item.active {
  color: #1a73e8;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1a73e8;
}

.search-box {
  display: flex;
  gap: 8px;
}

.search-input {
  width: 240px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1a73e8;
}

.search-btn,
.retry-btn {
  height: 32px;
  padding: 0 20px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover,
.retry-btn:hover {
  background: #1557b0;
}

.content-section {
  min-height: 400px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #f0f0f0;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

.loading-text,
.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.empty-icon {
  font-size: 52px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.2s;
}

.order-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.order-no {
  font-size: 13px;
  color: #999;
}

.order-status {
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.order-status.paid {
  color: #52c41a;
  background: #f6ffed;
}

.order-status.unpaid {
  color: #faad14;
  background: #fffbe6;
}

.order-status.closed {
  color: #94a3b8;
  background: #f1f5f9;
}

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.order-info {
  flex: 1;
}

.order-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px;
}

.order-desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px;
}

.order-time {
  font-size: 12px;
  color: #999;
}

.order-amount {
  text-align: right;
}

.amount {
  font-size: 18px;
  font-weight: 600;
  color: #f5222d;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-pay {
  padding: 6px 16px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-pay:hover {
  background: #1557b0;
}

.btn-detail {
  padding: 6px 16px;
  background: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-detail:hover {
  color: #1a73e8;
  border-color: #1a73e8;
}

.detail-content {
  padding: 8px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #999;
}

.detail-value {
  font-size: 14px;
  color: #333;
  text-align: right;
}

.detail-value.mono {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.detail-value.price {
  font-size: 16px;
  font-weight: 600;
  color: #f5222d;
}

@media (max-width: 768px) {
  .page-header,
  .filter-section,
  .order-body {
    flex-direction: column;
    align-items: stretch;
  }

  .header-pay-btn,
  .search-input {
    width: 100%;
  }

  .search-box {
    flex-direction: column;
  }

  .order-footer {
    justify-content: flex-start;
  }
}
</style>
