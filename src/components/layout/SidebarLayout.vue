<template>
  <div class="page-wrap">
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="container">
      <Breadcrumbs :groupTitle="groupTitle" :items="groupItems" />

      <div class="inner-layout">
        <aside class="sidebar-card">
          <div class="sidebar-header">
            <div class="title-group">
              <span class="title-decorator"></span>
              <h3 class="sidebar-title">{{ groupTitle }}</h3>
            </div>
            <div class="sidebar-subtitle">NAVIGATION</div>
          </div>
          <ul class="sidebar-menu">
            <li v-for="item in groupItems" :key="item.path">
              <router-link 
                :to="item.path" 
                :class="{ active: isActive(item.path) }"
              >
                <span class="menu-text">{{ item.name }}</span>
                <i class="icon-arrow"></i>
              </router-link>
            </li>
          </ul>
        </aside>

        <main class="content-card">
          <div class="content-header" v-if="activeItem">
            <div class="title-underline"></div>
          </div>
          <div class="content-pad">
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { sidebarGroups } from '@/config/sidebar';
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';
import { useNewsCategoryStore } from '@/stores/newsCategory';

const props = defineProps<{
  groupKey: string
}>();

const route = useRoute();
const newsCategoryStore = useNewsCategoryStore();

const groupData = computed(() => {
  return sidebarGroups[props.groupKey] || { title: '', items: [] };
});

const groupTitle = computed(() => {
  return groupData.value.title;
});

/** 新闻动态侧栏由后端分类驱动，其余模块用静态配置 */
const newsSidebarItems = ref<{ name: string; path: string }[]>([]);

async function refreshNewsSidebar() {
  if (props.groupKey !== 'news') return;
  await newsCategoryStore.ensureLoaded();
  newsSidebarItems.value = newsCategoryStore.menuItems.map(({ name, path }) => ({ name, path }));
}

onMounted(() => {
  void refreshNewsSidebar();
});

watch(
  () => props.groupKey,
  () => {
    void refreshNewsSidebar();
  }
);

const groupItems = computed(() => {
  if (props.groupKey === 'news' && newsSidebarItems.value.length > 0) {
    return newsSidebarItems.value;
  }
  return groupData.value.items;
});

const activeItem = computed(() => {
  return groupItems.value.find(item => route.path.startsWith(item.path));
});

const isActiveItemExact = computed(() => {
  return activeItem.value ? route.path === activeItem.value.path : false;
});

const isActive = (path: string) => route.path.startsWith(path);
</script>

<style scoped>
/* --- 全局风格配置 --- */
.page-wrap {
  --primary: #0c4da2;
  --primary-bg: #f0f7ff;
  --text-main: #1e293b; /* Slate 800 */
  --text-muted: #64748b; /* Slate 500 */
  --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  
  background-color: #f6f8fb;
  padding: 40px 0 80px;
  min-height: 80vh;
  position: relative;
  overflow: hidden;
}

/* --- 科技感背景光晕（同主页） --- */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 600px;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.5;
  border-radius: 50%;
}

.blob-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(12, 77, 162, 0.1) 0%, transparent 70%);
  top: -100px;
  right: -50px;
}

.blob-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(12, 77, 162, 0.05) 0%, transparent 70%);
  bottom: 0;
  left: -50px;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* --- 布局 --- */
.inner-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

/* --- 侧边栏美化（贴合主页组件风格） --- */
.sidebar-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  border: 1px solid #edf2f7;
  overflow: hidden;
}

.sidebar-header {
  padding: 28px 24px;
  background: linear-gradient(to bottom, #ffffff, #fcfdfe);
  border-bottom: 1px solid #f1f5f9;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.title-decorator {
  width: 4px;
  height: 18px;
  background: var(--primary);
  border-radius: 2px;
}

.sidebar-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: 0.5px;
}

.sidebar-subtitle {
  font-size: 10px;
  color: #94a3b8;
  letter-spacing: 2px;
  padding-left: 16px;
}

.sidebar-menu {
  list-style: none;
  padding: 12px 0;
  margin: 0;
}

.sidebar-menu li a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  color: var(--text-main);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 15px;
}

.sidebar-menu li a:hover {
  background-color: var(--primary-bg);
  color: var(--primary);
  padding-left: 32px;
}

.sidebar-menu li a.active {
  background: linear-gradient(to right, var(--primary-bg), transparent);
  color: var(--primary);
  font-weight: 700;
  border-left: 4px solid var(--primary);
}

.icon-arrow {
  width: 7px;
  height: 7px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  transform: rotate(45deg);
  opacity: 0;
  transition: 0.3s;
}

.sidebar-menu li a.active .icon-arrow,
.sidebar-menu li a:hover .icon-arrow {
  opacity: 1;
  transform: rotate(45deg) translateX(3px);
}

/* --- 内容卡片 --- */
.content-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  border: 1px solid #edf2f7;
  min-height: 700px;
}

.content-header {
  padding: 40px 40px 0;
}

.title-underline {
  width: 40px;
  height: 4px;
  background: var(--primary);
  border-radius: 2px;
}

.content-pad {
  padding: 30px 40px 40px;
}

/* --- 响应式调整 --- */
@media (max-width: 1024px) {
  .inner-layout { grid-template-columns: 1fr; gap: 24px; }
  .sidebar-menu { display: grid; grid-template-columns: repeat(2, 1fr); padding: 12px; gap: 8px; }
  .sidebar-menu li a { border-radius: 8px; background: #f8fafc; justify-content: center; padding: 12px; }
  .sidebar-menu li a.active { border-left: none; border-bottom: 2px solid var(--primary); }
  .icon-arrow { display: none; }
}
</style>