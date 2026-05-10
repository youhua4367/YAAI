<template>
  <div class="nav-wrap">
    <div class="container">
      <div class="nav-content">
        <div class="brand" @click="$router.push('/')">
          <div class="logo">
            <img src="/YAAI_logo_v1.0.svg" alt="云南人工智能学会" />
          </div>
          <div class="titles">
            <h1>云南人工智能学会</h1>
            <p>YNAI</p>
          </div>
        </div>

        <ul class="nav">
          <li :class="{ active: isActive('/') }">
            <router-link to="/">首页</router-link>
          </li>
          <li :class="{ active: isActive('/about') || isAboutActive() }">
            <router-link to="/about/introduction">关于云智会</router-link>
            <div class="dropdown">
              <router-link to="/about/introduction">学会简介</router-link>
              <router-link to="/about/charter">学会章程</router-link>
              <router-link to="/about/regulations">条例与制度</router-link>
              <router-link to="/about/leaders">主要领导</router-link>
              <router-link to="/about/branches">分支机构</router-link>
              <router-link to="/about/local">地方学会</router-link>
            </div>
          </li>
          <li :class="{ active: isActive('/services') }">
            <router-link to="/services">服务矩阵</router-link>
            <div class="dropdown">
              <router-link to="/services">会员服务</router-link>
              <router-link to="/services">成果奖励</router-link>
              <router-link to="/services">学术基金</router-link>
              <router-link to="/services">出版物</router-link>
              <router-link to="/services">算力平台</router-link>
            </div>
          </li>
          <li :class="{ active: isActive('/news') || isNewsActive() }">
            <router-link to="/news">新闻动态</router-link>
            <div class="dropdown" v-if="newsDropdownItems.length">
              <router-link
                v-for="item in newsDropdownItems"
                :key="item.id"
                :to="item.path"
              >{{ item.name }}</router-link>
            </div>
            <div class="dropdown" v-else>
              <router-link to="/news">进入新闻动态</router-link>
            </div>
          </li>
          <li :class="{ active: isActive('/conference') || isConferenceActive() }">
            <router-link to="/conference">会议系统</router-link>
          </li>
        </ul>

        <div class="nav-tools">
          <button class="search-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <div class="divider"></div>
          <a href="#" class="lang-en">EN</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNewsCategoryStore } from '@/stores/newsCategory';

const route = useRoute();
const newsCategoryStore = useNewsCategoryStore();

const newsDropdownItems = computed(() => newsCategoryStore.menuItems);

onMounted(() => {
  void newsCategoryStore.ensureLoaded();
});

const isActive = (path: string) => route.path === path;
const isConferenceActive = () => route.path.startsWith('/conference');
const isAboutActive = () => route.path.startsWith('/about');
const isNewsActive = () => route.path.startsWith('/news');
</script>

<style scoped>
.nav-wrap {
  background: #0f172a; /* 更纯净的暗色底，显高级 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(59, 130, 246, 0.15);
  backdrop-filter: blur(12px);
}

.container {
  max-width: 1440px; /* 增加最大宽度，减少两侧留白 */
  margin: 0 auto;
  padding: 0 40px;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 确保三块区域分布合理 */
  height: 80px;
}

/* 品牌 Logo */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo img {
  height: 44px;
}

.titles h1 {
  margin: 0;
  font-size: 20px; /* 进一步增大标题 */
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 1px;
}

.titles p {
  margin: -2px 0 0 0;
  font-size: 13px; /* 增大 YNAI 字号 */
  color: #3b82f6; 
  letter-spacing: 2px; /* 增加字母间距 */
  font-weight: 700;
  font-family: 'Arial', sans-serif;
}

/* 导航主列表 */
.nav {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0 20px;
  flex: 1;
  justify-content: flex-start; /* 将导航项向中间偏右靠拢，平衡 Logo 的占据感 */
  gap: 8px; 
}

.nav > li {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
}

.nav > li > a {
  padding: 8px 18px; /* 增加点击范围 */
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 16px; /* 保持大字体 */
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav > li:hover > a {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

/* 选中项的状态 */
.nav > li.active > a {
  color: #3b82f6;
  font-weight: 600;
}

.nav > li.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  background: #3b82f6;
  box-shadow: 0 -1px 8px rgba(59, 130, 246, 0.5);
}

/* 下拉菜单 */
.dropdown {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  top: 75px;
  min-width: 180px;
  background: #1e293b;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 0;
  z-index: 100;
  transition: all 0.25s ease-out;
}

.nav > li:hover .dropdown {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.dropdown a {
  display: block;
  padding: 10px 20px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
}

.dropdown a:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding-left: 25px;
}

/* 工具栏 */
.nav-tools {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;
  flex-shrink: 0;
}

.search-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.search-btn svg {
  width: 22px;
  height: 22px;
}

.search-btn:hover {
  color: #3b82f6;
  transform: scale(1.1);
}

.divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
}

.lang-en {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

/* 适配 1200px 以下屏幕 */
@media (max-width: 1280px) {
  .nav > li > a { font-size: 15px; padding: 8px 12px; }
  .nav { gap: 2px; }
}
</style>