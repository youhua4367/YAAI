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
          :title="isCollapsed ? item.label : ''"
          @click="handleTabClick(item.key)"
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
import { computed } from 'vue'
import { useMemberPermissions } from '@/composables/useMemberPermissions'
import { useMemberProfile } from '@/composables/useMemberProfile'

interface Props {
  currentTab: string
  isCollapsed: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:currentTab', tab: string): void
}>()

const { canViewOrders } = useMemberPermissions()
const { memberType } = useMemberProfile()

const isCompanyMember = computed(() => memberType.value === 'company')
const menuItems = computed(() => {
  const items = [
    { key: 'home', label: '首页', icon: 'fas fa-th-large' }
  ]

  if (canViewOrders.value) {
    items.push({ key: 'orders', label: '我的缴费', icon: 'fas fa-wallet' })
  }

  if (isCompanyMember.value) {
    items.push({ key: 'profile', label: '单位会员', icon: 'fas fa-building' })
  } else {
    items.push({ key: 'profile', label: '个人会员', icon: 'fas fa-user-circle' })
  }

  return items
})

function handleTabClick(tab: string) {
  emit('update:currentTab', tab)
}
</script>

<style scoped>
.member-sidebar {
  --primary: #0c4da2;
  --primary-light: #f0f7ff;
  --text-main: #1e293b;
  --text-muted: #64748b;

  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid #edf2f7;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 240px;
  overflow: hidden;
}

.member-sidebar.is-collapsed {
  width: 72px;
}

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

.nav-menu li:hover {
  background-color: #f8fafc;
  color: var(--primary);
}

.nav-menu li.active {
  background-color: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

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

.is-collapsed .nav-menu li {
  justify-content: center;
  padding: 14px 0;
}

.is-collapsed .nav-icon {
  width: 100%;
}

.is-collapsed .active-pill {
  left: 4px;
}
</style>
