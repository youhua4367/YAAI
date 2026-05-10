<!-- 会员中心我的缴费 -->
<template>
  <div class="orders-page">
    <div class="page-header">
      <h2 class="page-title">我的缴费</h2>
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
          type="text" 
          v-model="searchKeyword"
          placeholder="请输入您要搜索的内容"
          class="search-input"
        />
        <button class="search-btn" @click="handleSearch">查询</button>
      </div>
    </div>
    
    <div class="content-section">
      <div v-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-box-open"></i>
        </div>
        <p class="empty-text">暂无数据</p>
      </div>
      
      <div v-else class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-item">
          <div class="order-header">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span :class="['order-status', order.status]">{{ order.statusText }}</span>
          </div>
          <div class="order-body">
            <div class="order-info">
              <h4 class="order-title">{{ order.title }}</h4>
              <p class="order-desc">{{ order.description }}</p>
              <span class="order-time">{{ order.createTime }}</span>
            </div>
            <div class="order-amount">
              <span class="amount">¥{{ order.amount }}</span>
            </div>
          </div>
          <div class="order-footer">
            <button v-if="order.status === 'pending'" class="btn-pay">立即支付</button>
            <button class="btn-detail">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tabs = [
  { label: '全部', value: 'all' },
  { label: '已支付', value: 'paid' },
  { label: '待支付', value: 'pending' },
  { label: '已取消', value: 'cancelled' }
];

const currentTab = ref('all');
const searchKeyword = ref('');

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: 'ORD202403290001',
    title: '会员年费',
    description: '中国人工智能学会2024年度会员费',
    amount: '500.00',
    status: 'paid',
    statusText: '已支付',
    createTime: '2024-03-29 10:30:00'
  },
  {
    id: 2,
    orderNo: 'ORD202403280002',
    title: '会议注册费',
    description: '2024人工智能大会注册费',
    amount: '1200.00',
    status: 'pending',
    statusText: '待支付',
    createTime: '2024-03-28 14:20:00'
  }
]);

const filteredOrders = computed(() => {
  let result = orders.value;
  
  // 按状态筛选
  if (currentTab.value !== 'all') {
    result = result.filter(order => order.status === currentTab.value);
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(order => 
      order.orderNo.toLowerCase().includes(keyword) ||
      order.title.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

const handleSearch = () => {
  console.log('搜索关键词：', searchKeyword.value);
};
</script>

<style scoped>
.orders-page {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: 100%;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.search-input::placeholder {
  color: #bfbfbf;
}

.search-btn {
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

.search-btn:hover {
  background: #1557b0;
}

.content-section {
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.order-status.pending {
  color: #faad14;
  background: #fffbe6;
}

.order-status.cancelled {
  color: #999;
  background: #f5f5f5;
}

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.order-info {
  flex: 1;
}

.order-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px 0;
}

.order-desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
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
</style>