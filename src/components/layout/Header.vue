<template>
  <div class="header-wrapper">
    <div class="topbar">
      <div class="container">
        <div class="topbar-left">
          <a href="#">办公系统</a>
          <span class="divider">|</span>
          <router-link v-if="!isLoggedIn" :to="LOGIN_PATH">会员登录</router-link>
          <router-link v-if="!isLoggedIn" to="/apply">会员注册</router-link>
          <span v-if="isLoggedIn" class="welcome-text">欢迎您，{{ displayName }}</span>
        </div>
        <div class="topbar-right">
          <span>欢迎访问云南人工智能学会官网</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { LOGIN_PATH } from '@/constants/authPaths'
import { useTokenStore } from '@/stores/token'
import { useMemberProfile } from '@/composables/useMemberProfile'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const tokenStore = useTokenStore()
const isLoggedIn = computed(() => tokenStore.isLoggedIn)
const { displayName } = useMemberProfile()
</script>

<style scoped>/* 定义全局主题变量 */
.header-wrapper {
  --primary-color: #0056b3; /* 科技蓝 */
  --primary-hover: #003d82;
  --text-main: #333333;
  --text-light: #777777;
  --topbar-bg: #f8f9fa;
  --border-color: #e0e0e0;

  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 限制内容最大宽度并居中 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ================= 顶部状态栏 ================= */
.topbar {
  background-color: var(--topbar-bg);
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  color: var(--text-light);
  padding: 8px 0;
}

.topbar-left {
  display: flex;
  align-items: center;
}

.topbar-left a {
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.3s ease;
}

.topbar-left a:hover {
  color: var(--primary-color);
}

.topbar-left .divider {
  margin: 0 12px;
  color: #ccc;
  font-size: 10px;
}

.welcome-text {
  color: var(--primary-color);
  font-weight: 500;
}
</style>