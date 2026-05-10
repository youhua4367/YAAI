<!-- 会员中心个人信息 -->
<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>个人信息</h2>
      <button class="btn btn-primary">编辑资料</button>
    </div>

    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">
          <img src="https://ui-avatars.com/api/?name=User&background=ffffff&color=8B949E&size=100" alt="用户头像" class="default-avatar-img" />
        </div>
        <div class="profile-info">
          <h3>张雅健</h3>
          <p class="member-type">会员类型：普通会员</p>
          <p class="join-date">入会时间：2024-01-15</p>
          <p class="expire-date">到期时间：2025-01-14</p>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>姓名</label>
              <span>张雅健</span>
            </div>
            <div class="detail-item">
              <label>性别</label>
              <span>男</span>
            </div>
            <div class="detail-item">
              <label>出生日期</label>
              <span>1990-01-01</span>
            </div>
            <div class="detail-item">
              <label>民族</label>
              <span>汉族</span>
            </div>
            <div class="detail-item">
              <label>证件类型</label>
              <span>身份证</span>
            </div>
            <div class="detail-item">
              <label>证件号码</label>
              <span>5301********1234</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>联系方式</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>手机号码</label>
              <span>138****5678</span>
            </div>
            <div class="detail-item">
              <label>电子邮箱</label>
              <span>zhang@example.com</span>
            </div>
            <div class="detail-item">
              <label>通讯地址</label>
              <span>云南省昆明市五华区学府路123号</span>
            </div>
            <div class="detail-item">
              <label>邮政编码</label>
              <span>650031</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>工作信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>工作单位</label>
              <span>云南大学信息学院</span>
            </div>
            <div class="detail-item">
              <label>职务</label>
              <span>副教授</span>
            </div>
            <div class="detail-item">
              <label>职称</label>
              <span>副教授</span>
            </div>
            <div class="detail-item">
              <label>研究领域</label>
              <span>机器学习、计算机视觉</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.profile-page {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #0c4da2;
  color: #fff;
}

.btn-primary:hover {
  background: #0a3f8a;
}

.profile-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 30px;
  height: calc(100% - 80px);
  overflow-y: auto;
}

.profile-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.profile-avatar {
  position: relative;
}

.default-avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
}

.profile-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item label {
  color: #666;
  font-size: 14px;
}

.detail-item span {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
