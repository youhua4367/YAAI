<!-- 会员中心首页 -->
<template>
  <div class="home-page">
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="user-info">
          <div class="avatar">
            <img v-if="memberSingle?.img" :src="memberSingle.img" alt="头像" class="avatar-img" />
            <i v-else class="fas fa-user-circle"></i>
          </div>
          <div class="user-details">
            <h3 class="welcome-text">欢迎您，{{ displayName }}</h3>
            <p class="membership-info">
              工作单位：<ProfileField :value="memberSingle?.workUnit" /><br />
              入会时间：<ProfileField :value="joinDateRaw" date /><br />
              入会状态：<span class="status" :class="statusClass">{{ statusText }}</span><br />
              最高学历：<ProfileField :value="memberSingle?.highestEducation" />
            </p>
            <div class="user-stats">
              <span class="stat-item">职务：<strong><ProfileField :value="memberSingle?.position" /></strong></span>
              <span class="stat-item">职称：<strong><ProfileField :value="memberSingle?.jobTitle" /></strong></span>
              <span class="stat-item">手机：<strong><ProfileField :value="memberSingle?.contactPhone" /></strong></span>
            </div>
          </div>
        </div>

        <div class="quick-hint">
          <p v-if="notFilled">您尚未完善<strong>个人会员</strong>档案，请前往「个人会员」补充信息。</p>
          <p v-else>使用左侧菜单可查看 <strong>缴费订单</strong> 与 <strong>个人会员</strong>资料。</p>
        </div>
      </div>

      <div v-if="showPaymentTip" class="membership-tips">
        <div class="tip-item">
          <span class="tip-icon">💡</span>
          <span>入会申请已通过，请缴纳会费</span>
          <button class="tip-btn" type="button">立即缴费</button>
        </div>
      </div>
    </div>

    <!-- 通知公告（暂保留静态占位） -->
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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import ProfileField from '@/components/common/ProfileField.vue'
import { useMemberProfile } from '@/composables/useMemberProfile'
import { useCurrentUserStore } from '@/stores/currentUser'
import { userStatusClass, userStatusLabel } from '@/utils/memberDisplay'

const { memberSingle, notFilled, displayName } = useMemberProfile()
const { profile: userProfile } = storeToRefs(useCurrentUserStore())

const statusText = computed(() => userStatusLabel(userProfile.value?.status))
const statusClass = computed(() => userStatusClass(userProfile.value?.status))
const joinDateRaw = computed(
  () => memberSingle.value?.createdAt ?? userProfile.value?.createdAt ?? null
)
const showPaymentTip = computed(() => userProfile.value?.status === 1)
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
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.status.pending {
  color: #faad14;
  background: #fffbe6;
}

.status.paid {
  color: #52c41a;
  background: #f6ffed;
}

.status.default {
  color: #64748b;
  background: #f1f5f9;
}

.user-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 13px;
  color: #999;
}

.stat-item strong {
  color: #333;
  font-weight: 500;
}

.stat-item strong :deep(.field-empty) {
  color: #cbd5e1;
  font-weight: 400;
}

.membership-info :deep(.field-empty) {
  color: #cbd5e1;
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
