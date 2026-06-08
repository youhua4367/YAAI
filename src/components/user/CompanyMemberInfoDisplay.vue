<template>
  <div class="company-member-info-card">
    <h3 class="card-title">单位会员信息</h3>

    <!-- 基本信息 -->
    <div v-if="info" class="info-section">
      <h4 class="section-title">基本信息</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">单位名称：</span>
          <span class="value highlight">{{ info.unitName }}</span>
        </div>
        <div class="info-item">
          <span class="label">会员编号：</span>
          <span class="value">{{ info.memberNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">所属委员会：</span>
          <span class="value">{{ info.committeeName }}</span>
        </div>
        <div class="info-item">
          <span class="label">委员会角色：</span>
          <span class="value">{{ info.committeeRole }}</span>
        </div>
        <div class="info-item">
          <span class="label">单位类别：</span>
          <span class="value">{{ info.unitCategory }}</span>
        </div>
        <div class="info-item">
          <span class="label">所属行业：</span>
          <span class="value">{{ info.industry }}</span>
        </div>
        <div class="info-item">
          <span class="label">审核状态：</span>
          <span class="value" :class="getStatusClass(info.auditStatus)">
            {{ info.auditStatus }}
          </span>
        </div>
        <div class="info-item">
          <span class="label">会员状态：</span>
          <span class="value" :class="getMembershipStatusClass(info.membershipStatus)">
            {{ info.membershipStatus }}
          </span>
        </div>
      </div>
    </div>

    <!-- 单位详细信息 -->
    <div v-if="info" class="info-section">
      <h4 class="section-title">单位详细信息</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">法定代表人：</span>
          <span class="value">{{ info.legalRepresentative }}</span>
        </div>
        <div class="info-item">
          <span class="label">统一社会信用代码：</span>
          <span class="value">{{ info.unifiedSocialCreditCode }}</span>
        </div>
        <div class="info-item">
          <span class="label">注册资金：</span>
          <span class="value">{{ info.registeredCapital }}万元</span>
        </div>
        <div class="info-item">
          <span class="label">成立日期：</span>
          <span class="value">{{ formatDate(info.establishedDate) }}</span>
        </div>
        <div class="info-item">
          <span class="label">融资轮次：</span>
          <span class="value">{{ info.financingRound }}</span>
        </div>
        <div class="info-item full-width">
          <span class="label">通讯地址：</span>
          <span class="value">{{ info.address }}</span>
        </div>
        <div class="info-item">
          <span class="label">邮政编码：</span>
          <span class="value">{{ info.postalCode }}</span>
        </div>
        <div class="info-item">
          <span class="label">官方网站：</span>
          <a v-if="info.website" :href="formatWebsite(info.website)" target="_blank" class="value link">
            {{ info.website }}
          </a>
          <span v-else class="value">-</span>
        </div>
        <div class="info-item full-width" v-if="info.businessScope">
          <span class="label">业务范围：</span>
          <span class="value">{{ info.businessScope }}</span>
        </div>
      </div>
    </div>

    <!-- 负责人信息 -->
    <div v-if="info" class="info-section">
      <h4 class="section-title">单位负责人信息</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">负责人姓名：</span>
          <span class="value">{{ info.leaderName }}</span>
        </div>
        <div class="info-item">
          <span class="label">负责人职务：</span>
          <span class="value">{{ info.leaderTitle || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">负责人手机：</span>
          <span class="value">{{ info.leaderPhone }}</span>
        </div>
        <div class="info-item">
          <span class="label">负责人邮箱：</span>
          <span class="value">{{ info.leaderEmail }}</span>
        </div>
      </div>
    </div>

    <!-- 联系人信息 -->
    <div v-if="info" class="info-section">
      <h4 class="section-title">联系人信息</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">联系人姓名：</span>
          <span class="value">{{ info.contactName }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系部门：</span>
          <span class="value">{{ info.contactDept || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系人手机：</span>
          <span class="value">{{ info.contactMobile }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系人邮箱：</span>
          <span class="value">{{ info.contactEmail }}</span>
        </div>
        <div class="info-item" v-if="info.contactOfficePhone">
          <span class="label">办公电话：</span>
          <span class="value">{{ info.contactOfficePhone }}</span>
        </div>
        <div class="info-item" v-if="info.contactGender">
          <span class="label">联系人性别：</span>
          <span class="value">{{ info.contactGender }}</span>
        </div>
        <div class="info-item" v-if="info.contactTitle">
          <span class="label">联系人职务：</span>
          <span class="value">{{ info.contactTitle }}</span>
        </div>
        <div class="info-item" v-if="info.contactJobTitle">
          <span class="label">联系人职称：</span>
          <span class="value">{{ info.contactJobTitle }}</span>
        </div>
      </div>
    </div>

    <!-- 附件信息 -->
    <div v-if="info && (info.qualificationList.length > 0 || info.honorList.length > 0 || info.otherList.length > 0)" class="info-section">
      <h4 class="section-title">附件资料</h4>

      <div v-if="info.qualificationList.length > 0" class="attachment-group">
        <h5 class="attachment-title">资质证书</h5>
        <div class="attachment-list">
          <a
            v-for="(item, index) in info.qualificationList"
            :key="index"
            :href="item.fileUrl"
            target="_blank"
            class="attachment-item"
          >
            <i class="fas fa-file-alt"></i>
            <span>{{ item.fileName }}</span>
          </a>
        </div>
      </div>

      <div v-if="info.honorList.length > 0" class="attachment-group">
        <h5 class="attachment-title">荣誉证书</h5>
        <div class="attachment-list">
          <a
            v-for="(item, index) in info.honorList"
            :key="index"
            :href="item.fileUrl"
            target="_blank"
            class="attachment-item"
          >
            <i class="fas fa-certificate"></i>
            <span>{{ item.fileName }}</span>
          </a>
        </div>
      </div>

      <div v-if="info.otherList.length > 0" class="attachment-group">
        <h5 class="attachment-title">其他资料</h5>
        <div class="attachment-list">
          <a
            v-for="(item, index) in info.otherList"
            :key="index"
            :href="item.fileUrl"
            target="_blank"
            class="attachment-item"
          >
            <i class="fas fa-paperclip"></i>
            <span>{{ item.fileName }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 营业执照 -->
    <div v-if="info && info.businessLicenseUrl" class="info-section">
      <h4 class="section-title">营业执照</h4>
      <div class="license-preview">
        <a :href="info.businessLicenseUrl" target="_blank" class="license-link">
          <img :src="info.businessLicenseUrl" alt="营业执照" class="license-image" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompanyMemberInfoVO } from '@/types/userCenter'

const props = defineProps<{
  info: CompanyMemberInfoVO | null
}>()

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return dateStr.split('T')[0]
}

function formatWebsite(url: string): string {
  if (!url) return '#'
  return url.startsWith('http') ? url : `https://${url}`
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    '待审核': 'status-pending',
    '已通过': 'status-approved',
    '已拒绝': 'status-rejected'
  }
  return map[status] || ''
}

function getMembershipStatusClass(status: string): string {
  const map: Record<string, string> = {
    '正常': 'status-normal',
    '过期': 'status-expired',
    '暂停': 'status-suspended'
  }
  return map[status] || ''
}
</script>

<style scoped>
.company-member-info-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #0c4da2;
  padding-bottom: 10px;
}

.info-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #555;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  color: #64748b;
  font-size: 14px;
  min-width: 120px;
}

.value {
  color: #334155;
  font-size: 14px;
  font-weight: 500;
}

.value.highlight {
  color: #0c4da2;
  font-weight: 600;
}

.value.link {
  color: #0c4da2;
  text-decoration: none;
}

.value.link:hover {
  text-decoration: underline;
}

.status-pending {
  color: #f59e0b;
  font-weight: 600;
}

.status-approved,
.status-normal {
  color: #10b981;
  font-weight: 600;
}

.status-rejected,
.status-expired {
  color: #ef4444;
  font-weight: 600;
}

.status-suspended {
  color: #6b7280;
  font-weight: 600;
}

.attachment-group {
  margin-bottom: 16px;
}

.attachment-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  color: #0369a1;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s;
}

.attachment-item:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
}

.attachment-item i {
  font-size: 14px;
}

.license-preview {
  margin-top: 12px;
}

.license-link {
  display: inline-block;
  max-width: 100%;
}

.license-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s;
}

.license-image:hover {
  transform: scale(1.02);
}
</style>
