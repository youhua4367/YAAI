<template>
  <div class="home-page">
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="user-info">
          <div class="avatar">
            <img
              v-if="isCompanyMember && companyMemberInfo?.businessLicenseUrl"
              :src="companyMemberInfo.businessLicenseUrl"
              alt="营业执照"
              class="avatar-img"
            />
            <img
              v-else-if="memberSingle?.img"
              :src="memberSingle.img"
              alt="头像"
              class="avatar-img"
            />
            <i v-else class="fas" :class="isCompanyMember ? 'fa-building' : 'fa-user-circle'"></i>
          </div>

          <div class="user-details">
            <h3 class="welcome-text">欢迎您，{{ displayName }}</h3>
            <p class="membership-info">
              <template v-if="isCompanyMember && companyMemberInfo">
                单位名称：<ProfileField :value="companyMemberInfo.unitName" /><br />
                入会时间：<ProfileField :value="companyMemberInfo.joinedAt" date /><br />
                入会状态：<span class="status" :class="companyStatusClass">{{ companyStatusText }}</span><br />
                单位类别：<ProfileField :value="companyMemberInfo.unitCategory" />
              </template>

              <template v-else-if="memberSingle">
                工作单位：<ProfileField :value="memberSingle.workUnit" /><br />
                入会时间：<ProfileField :value="joinDateRaw" date /><br />
                入会状态：<span class="status" :class="statusClass">{{ statusText }}</span><br />
                最高学历：<ProfileField :value="memberSingle.highestEducation" />
              </template>
            </p>

            <div class="user-stats" v-if="isCompanyMember && companyMemberInfo">
              <span class="stat-item">行业：<strong><ProfileField :value="companyMemberInfo.industry" /></strong></span>
              <span class="stat-item">联系人：<strong><ProfileField :value="companyMemberInfo.contactName" /></strong></span>
              <span class="stat-item">手机：<strong><ProfileField :value="companyMemberInfo.contactMobile" /></strong></span>
            </div>

            <div class="user-stats" v-else-if="memberSingle">
              <span class="stat-item">职务：<strong><ProfileField :value="memberSingle.position" /></strong></span>
              <span class="stat-item">职称：<strong><ProfileField :value="memberSingle.jobTitle" /></strong></span>
              <span class="stat-item">手机：<strong><ProfileField :value="memberSingle.contactPhone" /></strong></span>
            </div>
          </div>
        </div>

        <div class="quick-hint">
          <p v-if="notFilled && canEditProfile">
            您尚未完善<strong>{{ isCompanyMember ? '单位会员' : '个人会员' }}</strong>档案，请前往对应资料页补充信息。
          </p>
          <p v-else>{{ permissionHint }}</p>
        </div>
      </div>

      <div v-if="showPaymentTip" class="membership-tips">
        <div class="tip-item">
          <span class="tip-icon">🔔</span>
          <span>{{ paymentTipText }}</span>
          <button class="tip-btn" type="button" @click="handleGoToPayment">
            立即缴费
          </button>
        </div>
      </div>

      <div v-if="isPendingReview && !isApprovedPendingPayment && !isPaidMember" class="membership-tips audit-tip">
        <div class="tip-item">
          <span class="tip-icon">⏳</span>
          <span>您的申请正在审核中，请耐心等待审核结果。</span>
        </div>
      </div>
    </div>

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
import { useMemberPermissions } from '@/composables/useMemberPermissions'
import { useCurrentUserStore } from '@/stores/currentUser'
import { getRemainingDays, isAuditApproved, resolveRenewalDeadline } from '@/utils/membershipPayment'

const { memberSingle, companyMemberInfo, notFilled, displayName, memberType, auditStatus } = useMemberProfile()
const { profile: userProfile } = storeToRefs(useCurrentUserStore())
const {
  statusText,
  statusClass,
  isPendingReview,
  isApprovedPendingPayment,
  isPaidMember,
  canEditProfile
} = useMemberPermissions()

const emit = defineEmits<{
  (e: 'navigateToPayment'): void
}>()

const isCompanyMember = computed(() => memberType.value === 'company')

const joinDateRaw = computed(() =>
  isCompanyMember.value && companyMemberInfo.value
    ? companyMemberInfo.value.joinedAt
    : memberSingle.value?.createdAt ?? userProfile.value?.createdAt ?? null
)

const renewalDeadline = computed(() =>
  resolveRenewalDeadline({
    expiryDate: companyMemberInfo.value?.expiryDate ?? memberSingle.value?.expiryDate,
    latestUploadTime: companyMemberInfo.value?.createdAt ?? memberSingle.value?.createdAt
  })
)

const renewalDue = computed(() => {
  if (!isPaidMember.value) return false
  if (!renewalDeadline.value) return true
  return renewalDeadline.value.getTime() <= Date.now()
})

const showPaymentTip = computed(() => {
  if (isApprovedPendingPayment.value) return true
  return renewalDue.value && isAuditApproved(auditStatus.value)
})

const paymentTipText = computed(() =>
  renewalDue.value
    ? '您的会费已到续费时间，请完成新一年的缴费。'
    : '您的会费尚未缴纳，请尽快完成缴费以激活会员资格。'
)

const companyStatusText = computed(() => companyMemberInfo.value?.auditStatus || '未知')

const companyStatusClass = computed(() => {
  const status = companyMemberInfo.value?.auditStatus
  const map: Record<string, string> = {
    待申请: 'pending',
    待审核: 'pending',
    待缴费: 'pending',
    有效会员: 'paid'
  }
  return map[status || ''] || 'default'
})

const permissionHint = computed(() => {
  if (isPendingReview.value) {
    return '您的申请正在审核中，审核期间您可以查看和修改会员资料。'
  }
  if (isApprovedPendingPayment.value) {
    return '审核已通过，请缴纳会费以成为正式会员。'
  }
  if (renewalDue.value) {
    return '您的会费已到续费时间，请完成新一年的缴费。'
  }
  if (isPaidMember.value) {
    const remainingDays = getRemainingDays(renewalDeadline.value)
    if (remainingDays !== null && remainingDays > 0) {
      return `欢迎正式会员，距离下次续费还有 ${remainingDays} 天。`
    }
    return '欢迎正式会员，您可以使用全部功能。'
  }
  return '请先完善会员资料并等待审核结果。'
})

function handleGoToPayment() {
  emit('navigateToPayment')
}
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
  margin: 0 0 12px;
}

.membership-info {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px;
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
  max-width: 320px;
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

.audit-tip {
  background: #f0f5ff;
  border-color: #adc6ff;
  margin-top: 12px;
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
