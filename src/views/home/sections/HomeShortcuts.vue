<template>
  <div class="card shortcuts-section">
    <div class="card-header">
      <div class="title-group">
        <span class="decorator"></span>
        <h3>常用入口</h3>
      </div>
    </div>
    
    <div class="shortcuts-grid">
      <router-link 
        v-for="(shortcut, index) in shortcuts" 
        :key="index"
        :to="shortcut.url"
        class="shortcut-item"
      >
        <div class="shortcut-icon-wrapper">
          <div class="icon-blob"></div>
          <img :src="shortcut.icon" :alt="shortcut.title" class="icon-img">
        </div>
        <div class="shortcut-info">
          <span class="shortcut-name">{{ shortcut.title }}</span>
          <span class="shortcut-desc">{{ shortcut.desc }}</span>
        </div>
        <div class="entry-arrow">
          <svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.936a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L715.424 533.376a30.592 30.592 0 0 0 0-42.752L382.592 149.312a29.12 29.12 0 0 0-41.728 0z" fill="currentColor"></path></svg>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const shortcuts = [
  {
    title: '会员注册',
    desc: '在线提交入会申请',
    icon: 'https://img.icons8.com/fluency/48/add-user-male.png',
    url: '/apply'
  },
  {
    title: '会员中心',
    desc: '缴费、资料与账户',
    icon: 'https://img.icons8.com/color/48/user.png',
    url: '/user'
  },
  {
    title: '服务矩阵',
    desc: '会员服务与平台资源',
    icon: 'https://img.icons8.com/fluency/48/book.png',
    url: '/services'
  },
  {
    title: '会议系统',
    desc: '会议信息与参会指引',
    icon: 'https://img.icons8.com/fluency/48/conference.png',
    url: '/conference'
  }
]
</script>

<style scoped>
.shortcuts-section {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.decorator {
  width: 4px;
  height: 18px;
  background: #0c4da2;
  border-radius: 2px;
}

.card-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
}

/* --- 网格优化：全宽状态下采用 4 列 --- */
.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 24px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  text-decoration: none;
  color: #334155;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}

.shortcut-item:hover {
  background: #fff;
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(12, 77, 162, 0.08);
  border-color: rgba(12, 77, 162, 0.15);
}

/* --- 图标背景装饰 --- */
.shortcut-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.icon-blob {
  position: absolute;
  inset: 0;
  background: #e0ecff;
  border-radius: 14px;
  transform: rotate(45deg);
  transition: all 0.4s ease;
}

.shortcut-item:hover .icon-blob {
  background: #0c4da2;
  transform: rotate(90deg) scale(1.1);
}

.icon-img {
  position: relative;
  z-index: 2;
  width: 32px;
  height: 32px;
  object-fit: contain;
  transition: all 0.3s;
}

.shortcut-item:hover .icon-img {
  filter: brightness(0) invert(1);
}

/* --- 文本信息 --- */
.shortcut-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.shortcut-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.shortcut-desc {
  font-size: 12px;
  color: #94a3b8;
}

/* --- 右侧引导小箭头 --- */
.entry-arrow {
  color: #cbd5e1;
  transition: all 0.3s;
  opacity: 0;
  transform: translateX(-10px);
}

.shortcut-item:hover .entry-arrow {
  opacity: 1;
  transform: translateX(0);
  color: #0c4da2;
}

/* --- 响应式适配 --- */
@media (max-width: 1024px) {
  .shortcuts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .shortcuts-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }
  .shortcut-item {
    padding: 16px;
  }
}
</style>