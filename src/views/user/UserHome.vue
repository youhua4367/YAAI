<!-- 会员中心首页 -->
<template>
  <div class="home-page">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="user-info">
          <div class="avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="user-details">
            <h3 class="welcome-text">欢迎您，张雅健</h3>
            <p class="membership-info">
              所属机构：中国人工智能学会<br>
              入会时间：2024-01-01<br>
              入会状态：<span class="status paid">待支付</span><br>
              到期时间：未设置
            </p>
            <div class="user-stats">
              <span class="stat-item">当前级别：<strong>普通会员</strong></span>
              <span class="stat-item">上次登录时间：<strong>2024-03-29</strong></span>
              <span class="stat-item"><span class="badge premium">会员徽章</span></span>
            </div>
          </div>
        </div>
        
        <div class="quick-hint">
          <p>使用左侧菜单可查看 <strong>缴费订单</strong> 与 <strong>个人资料</strong>。</p>
        </div>
      </div>
      
      <div class="membership-tips">
        <div class="tip-item">
          <span class="tip-icon">💡</span>
          <span>入会申请已通过，请缴纳会费</span>
          <button class="tip-btn">立即缴费</button>
        </div>
      </div>
    </div>
    
    <!-- 通知公告 -->
    <div class="notice-section">
      <div class="section-header">
        <h4 class="section-title">通知公告</h4>
        <a href="#" class="more-link">更多 &gt;&gt;</a>
      </div>
      <div class="notice-list">
        <div class="notice-item">
          <span class="notice-title">测试公告</span>
          <span class="notice-date">2026-02-26</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员中心首页组件
</script>

<style scoped>
.home-page {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: 100%;
}

.welcome-section {
  margin-bottom: 24px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #f6f9ff 0%, #e6f0fd 100%);
  border-radius: 8px;
  border: 1px solid #d1e3ff;
}

.user-info {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #1a73e8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 40px;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
}

.welcome-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.membership-info {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.paid {
  color: #faad14;
  background: #fffbe6;
}

.user-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #999;
}

.stat-item strong {
  color: #333;
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge.premium {
  color: #faad14;
  background: #fffbe6;
  border: 1px solid #ffe58f;
}

.quick-hint {
  max-width: 280px;
  padding: 16px 18px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8eef5;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.quick-hint p {
  margin: 0;
}

.quick-hint strong {
  color: #0c4da2;
  font-weight: 600;
}

.membership-tips {
  padding: 16px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-icon {
  font-size: 16px;
}

.tip-btn {
  margin-left: auto;
  padding: 6px 16px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.tip-btn:hover {
  background: #1557b0;
}

.notice-section {
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.more-link {
  font-size: 13px;
  color: #1a73e8;
  text-decoration: none;
  transition: color 0.2s;
}

.more-link:hover {
  color: #1557b0;
  text-decoration: underline;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  transition: background 0.2s;
  cursor: pointer;
}

.notice-item:hover {
  background: #f5f7fa;
}

.notice-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.notice-date {
  font-size: 13px;
  color: #999;
}

@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .quick-hint {
    max-width: none;
    width: 100%;
    margin-top: 16px;
  }
}
</style>