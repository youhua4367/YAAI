<template>
  <aside class="member-sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <div class="nav-section">
      <div class="nav-header" v-show="!isCollapsed">
        <span class="header-decorator"></span>
        <span class="nav-title">会员中心</span>
      </div>

      <ul class="nav-menu">
        <li 
          v-for="item in menuItems" 
          :key="item.key"
          :class="{ active: currentTab === item.key }" 
          @click="handleTabClick(item.key)"
          :title="isCollapsed ? item.label : ''"
        >
          <div class="active-pill"></div>
          <span class="nav-icon">
            <i :class="item.icon"></i>
          </span>
          <span class="nav-text" v-show="!isCollapsed">{{ item.label }}</span>
          
          <i class="fas fa-chevron-right arrow-icon" v-show="!isCollapsed"></i>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface Props {
  currentTab: string;
  isCollapsed: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:currentTab', tab: string): void;
}>();

const menuItems = [
  { key: 'home', label: '首页', icon: 'fas fa-th-large' },
  { key: 'orders', label: '我的缴费', icon: 'fas fa-wallet' },
  { key: 'profile', label: '个人会员', icon: 'fas fa-user-circle' }
]

const handleTabClick = (tab: string) => {
  emit('update:currentTab', tab);
};
</script>

<style scoped>
.member-sidebar {
  --primary: #0c4da2;
  --primary-light: #f0f7ff;
  --text-main: #1e293b; /* Slate 800 */
  --text-muted: #64748b; /* Slate 500 */
  
  background: #ffffff;
  border-radius: 16px; /* 统一圆角 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid #edf2f7;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 240px;
  overflow: hidden;
}

/* 折叠状态宽度 */
.member-sidebar.is-collapsed {
  width: 72px;
}

/* 标题样式 */
.nav-header {
  padding: 24px 20px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-decorator {
  width: 4px;
  height: 16px;
  background: var(--primary);
  border-radius: 2px;
}

.nav-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: 0.5px;
}

/* 菜单列表 */
.nav-menu {
  margin: 0;
  padding: 8px 12px;
  list-style: none;
}

.nav-menu li {
  position: relative;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: 10px;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

/* 选中项的左侧指示器（胶囊型） */
.active-pill {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: var(--primary);
  border-radius: 0 4px 4px 0;
  transition: height 0.3s ease;
}

.nav-menu li.active .active-pill {
  height: 20px;
}

/* 悬浮与激活态 */
.nav-menu li:hover {
  background-color: var(--bg-subtle, #f8fafc);
  color: var(--primary);
}

.nav-menu li.active {
  background-color: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

/* 图标与文字 */
.nav-icon {
  font-size: 18px;
  width: 24px;
  display: flex;
  justify-content: center;
  transition: transform 0.3s ease;
}

.nav-menu li:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  margin-left: 12px;
  font-size: 14px;
  flex: 1;
}

/* 右侧小箭头 */
.arrow-icon {
  font-size: 10px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.nav-menu li.active .arrow-icon {
  opacity: 0.5;
  transform: translateX(0);
}

/* 折叠状态下的特殊处理 */
.is-collapsed .nav-menu li {
  justify-content: center;
  padding: 14px 0;
}

.is-collapsed .nav-icon {
  width: 100%;
}

.is-collapsed .active-pill {
  left: 4px; /* 折叠时稍微往里一点 */
}
</style>