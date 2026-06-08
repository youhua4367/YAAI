<template>
  <div class="member-info-card">
    <h3 class="card-title">会员信息</h3>
    
    <!-- 基本信息 -->
    <div v-if="profile.memberSingle" class="info-section">
      <h4 class="section-title">基本信息</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">姓名：</span>
          <span class="value">{{ profile.memberSingle.name || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">性别：</span>
          <span class="value">{{ profile.memberSingle.gender || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">所属委员会：</span>
          <span class="value highlight">{{ profile.committeeName || '未设置' }}</span>
        </div>
        <div class="info-item">
          <span class="label">委员会角色：</span>
          <span class="value">{{ profile.committeeMember?.role || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">手机：</span>
          <span class="value">{{ profile.memberSingle.contactPhone || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ profile.memberSingle.email || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">工作单位：</span>
          <span class="value">{{ profile.memberSingle.workUnit || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">职务：</span>
          <span class="value">{{ profile.memberSingle.position || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">职称：</span>
          <span class="value">{{ profile.memberSingle.jobTitle || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">最高学历：</span>
          <span class="value">{{ profile.memberSingle.highestEducation || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- 教育经历 -->
    <div v-if="profile.educationList.length > 0" class="info-section">
      <h4 class="section-title">教育经历</h4>
      <div v-for="(edu, index) in profile.educationList" :key="edu.id" class="experience-item">
        <div class="experience-header">
          <span class="exp-index">{{ index + 1 }}</span>
          <span class="exp-school">{{ edu.school }}</span>
        </div>
        <div class="experience-details">
          <p><strong>专业：</strong>{{ edu.major }}</p>
          <p><strong>学位：</strong>{{ edu.degree }}</p>
          <p v-if="edu.startDate || edu.endDate">
            <strong>时间：</strong>
            {{ edu.startDate || '?' }} 至 {{ edu.endDate || '至今' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 工作经历 -->
    <div v-if="profile.workList.length > 0" class="info-section">
      <h4 class="section-title">工作经历</h4>
      <div v-for="(work, index) in profile.workList" :key="work.id" class="experience-item">
        <div class="experience-header">
          <span class="exp-index">{{ index + 1 }}</span>
          <span class="exp-company">{{ work.company }}</span>
        </div>
        <div class="experience-details">
          <p><strong>部门：</strong>{{ work.department || '-' }}</p>
          <p><strong>职位：</strong>{{ work.jobTitle || '-' }}</p>
          <p><strong>状态：</strong>{{ work.status }}</p>
          <p v-if="work.startDate || work.endDate">
            <strong>时间：</strong>
            {{ work.startDate || '?' }} 至 {{ work.endDate || '至今' }}
          </p>
          <p v-if="work.workContent"><strong>工作内容：</strong>{{ work.workContent }}</p>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!profile.memberSingle && !loading" class="empty-state">
      <p>暂无会员信息</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MemberFullProfile } from '@/composables/useLoginDataLoader'

defineProps<{
  profile: MemberFullProfile
  loading?: boolean
}>()
</script>

<style scoped>
.member-info-card {
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.label {
  color: #64748b;
  font-size: 14px;
  min-width: 90px;
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

.experience-item {
  margin-bottom: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #0c4da2;
}

.experience-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.exp-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #0c4da2;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}

.exp-school,
.exp-company {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.experience-details {
  padding-left: 36px;
}

.experience-details p {
  margin: 6px 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

.experience-details strong {
  color: #475569;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}
</style>
