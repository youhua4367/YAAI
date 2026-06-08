<template>
  <div class="user-center">
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <header class="user-header" :class="{ 'header-collapsed': isHeaderCollapsed }">
      <div class="header-container">
        <div class="header-left" v-show="!isHeaderCollapsed">
          <div class="logo-box">
            <img src="/YAAI_logo_v1.0.svg" alt="YAAI" />
          </div>
          <div class="brand-text">
            <h1>云南人工智能学会</h1>
            <span class="sub-title">MEMBER CENTER</span>
          </div>
        </div>

        <div class="header-right" :class="{ 'full-width': isHeaderCollapsed }">
          <div class="header-control" @click="toggleSidebar">
            <button class="toggle-btn">
              <i class="fas" :class="isSidebarCollapsed ? 'fa-indent' : 'fa-outdent'"></i>
            </button>
            <span class="nav-breadcrumb" v-show="!isSidebarCollapsed">
              控制台 <i class="fas fa-angle-right"></i> {{ currentTabName }}
            </span>
          </div>

          <div class="header-user">
            <el-dropdown trigger="click" @command="handleUserCommand">
              <div class="user-profile">
                <div class="avatar-group">
                  <img :src="avatarUrl" :alt="displayName" />
                  <span class="status-dot"></span>
                </div>
                <div class="user-meta">
                  <span class="user-name">{{ displayName }}</span>
                </div>
                <div class="dropdown-trigger">
                  <i class="fas fa-chevron-down"></i>
                </div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="changePassword">
                    <i class="fas fa-key dropdown-item-icon"></i>
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" :disabled="loggingOut">
                    <i class="fas fa-sign-out-alt dropdown-item-icon"></i>
                    {{ loggingOut ? '退出中…' : '退出登录' }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>

    <el-dialog
      v-model="showChangePasswordDialog"
      title="修改密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <ChangePasswordForm @success="handlePasswordChanged" />
    </el-dialog>

    <main class="user-content">
      <div class="content-container">
        <div class="user-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
          <UserSidebar 
            v-model:currentTab="currentTab" 
            :isCollapsed="isSidebarCollapsed" 
          />

          <div class="content-area">
            <transition name="page-fade" mode="out-in">
              <div :key="currentTab" class="view-container">
                <UserHome v-if="currentTab === 'home'" />
                <MyOrders v-if="currentTab === 'orders'" />
                <UserProfile v-if="currentTab === 'profile'" />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import UserSidebar from './UserSidebar.vue'
import UserHome from './UserHome.vue'
import UserProfile from './UserProfile.vue'
import MyOrders from './MyOrders.vue'
import ChangePasswordForm from '@/components/user/ChangePasswordForm.vue'
import { logout } from '@/api/member'
import { useMemberProfile } from '@/composables/useMemberProfile'
import { LOGIN_PATH } from '@/constants/authPaths'
import { useCurrentUserStore } from '@/stores/currentUser'
import { useMemberProfileStore } from '@/stores/memberProfile'
import { useTokenStore } from '@/stores/token'

const router = useRouter()
const tokenStore = useTokenStore()
const currentUserStore = useCurrentUserStore()
const memberProfileStore = useMemberProfileStore()
const { displayName } = useMemberProfile()

const avatarUrl = computed(() => {
  const name = encodeURIComponent(displayName.value || '会员')
  return `https://ui-avatars.com/api/?name=${name}&background=0c4da2&color=fff&size=40`
})

const currentTab = ref('home')
const isSidebarCollapsed = ref(false)
const isHeaderCollapsed = ref(false)
const loggingOut = ref(false)
const showChangePasswordDialog = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  isHeaderCollapsed.value = !isHeaderCollapsed.value
}

const currentTabName = computed(() => {
  const map: Record<string, string> = {
    home: '首页',
    orders: '我的缴费',
    profile: '个人会员'
  }
  return map[currentTab.value] || ''
})

async function handleLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await logout()
  } catch {
    // 接口失败时也清除本地登录态
  } finally {
    tokenStore.removeToken()
    currentUserStore.clearProfile()
    memberProfileStore.clearMemberProfile()
    loggingOut.value = false
    ElMessage.success('已退出登录')
    router.push(LOGIN_PATH)
  }
}

function handlePasswordChanged() {
  showChangePasswordDialog.value = false
  ElMessage.success('密码修改成功，请重新登录')
  setTimeout(() => {
    void handleLogout()
  }, 1500)
}

function handleUserCommand(command: string) {
  if (command === 'logout') {
    void handleLogout()
  } else if (command === 'changePassword') {
    showChangePasswordDialog.value = true
  }
}
</script>

<style scoped>
/* --- 基础变量 --- */
.user-center {
  --primary: #0c4da2;
  --primary-gradient: linear-gradient(135deg, #0c4da2 0%, #1e3a8a 100%);
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-500: #64748b;
  --slate-800: #1e293b;
  --header-h: 70px;

  min-height: 100vh;
  background-color: #f6f8fb;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* --- 背景光晕 (同主页) --- */
.bg-decoration .blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.12;
  z-index: 0;
}
.blob-1 { width: 400px; height: 400px; background: var(--primary); top: -150px; right: -100px; }
.blob-2 { width: 300px; height: 300px; background: #3b82f6; bottom: -100px; left: -50px; }

/* --- Header 美化 --- */
.user-header {
  height: var(--header-h);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.header-container {
  max-width: 100%;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 240px;
  transition: all 0.3s ease;
}

.logo-box {
  width: 42px; height: 42px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  padding: 4px;
}
.logo-box img { width: 100%; height: 100%; object-fit: contain; }

.brand-text h1 { font-size: 16px; font-weight: 700; color: var(--slate-800); margin: 0; }
.brand-text .sub-title { font-size: 10px; color: var(--slate-500); letter-spacing: 1px; }

.header-right {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}

.header-control { display: flex; align-items: center; gap: 16px; cursor: pointer; }
.toggle-btn {
  background: none; border: none; color: var(--slate-500);
  font-size: 18px; padding: 8px; border-radius: 8px; transition: 0.2s;
}
.header-control:hover .toggle-btn { background: var(--slate-100); color: var(--primary); }
.nav-breadcrumb { font-size: 14px; color: var(--slate-500); font-weight: 500; }
.nav-breadcrumb i { font-size: 12px; margin: 0 4px; opacity: 0.5; }

/* 用户资料 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 14px;
  transition: 0.2s;
  cursor: pointer;
}
.user-profile:hover { background: var(--slate-50); }

.avatar-group { position: relative; }
.avatar-group img { width: 38px; height: 38px; border-radius: 12px; border: 2px solid #fff; }
.status-dot {
  position: absolute; bottom: -2px; right: -2px;
  width: 10px; height: 10px; background: #10b981;
  border: 2px solid #fff; border-radius: 50%;
}

.user-meta { display: flex; align-items: center; }
.user-name { font-size: 14px; font-weight: 600; color: var(--slate-800); }
.dropdown-trigger { color: #cbd5e1; font-size: 10px; margin-left: 4px; }

:deep(.dropdown-item-icon) {
  margin-right: 8px;
  width: 14px;
  text-align: center;
  color: var(--slate-500);
}

/* --- 内容布局 --- */
.user-content {
  flex: 1;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.content-container {
  width: 100%;
  height: 100%;
}

.user-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-layout.sidebar-collapsed {
  grid-template-columns: 72px 1fr;
}

.content-area {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
  min-height: calc(100vh - var(--header-h) - 48px);
  overflow: hidden;
}

/* --- 动画 --- */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease;
}

.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* --- 响应式 --- */
@media (max-width: 768px) {
  .header-left { width: auto; }
  .brand-text { display: none; }
  .user-layout { grid-template-columns: 1fr; }
  .user-layout.sidebar-collapsed { grid-template-columns: 1fr; }
}
</style>