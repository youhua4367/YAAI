<template>
  <div class="breadcrumbs-wrapper">
    <nav class="breadcrumbs-container">
      <router-link to="/" class="breadcrumb-link home-entry">
        <svg class="home-icon" viewBox="0 0 1024 1024" width="16" height="16">
          <path d="M946.5 505L560.1 118.8c-25.9-25.9-67.9-25.9-93.8 0L80.1 505c-20.8 20.8-20.8 54.5 0 75.4 10.4 10.4 24.1 15.6 37.7 15.6 13.6 0 27.3-5.2 37.7-15.6L512 222.8l356.5 357.5c10.4 10.4 24.1 15.6 37.7 15.6 13.6 0 27.3-5.2 37.7-15.6 20.8-20.9 20.8-54.5 0-75.3z" fill="currentColor"></path>
          <path d="M512 744H192V451.1c0-29.5-23.9-53.3-53.3-53.3s-53.3 23.9-53.3 53.3V850.7c0 29.5 23.9 53.3 53.3 53.3h369.3c29.5 0 53.3-23.9 53.3-53.3s-23.9-53.3-53.3-53.3z" fill="currentColor"></path>
        </svg>
        <span class="link-text">首页</span>
      </router-link>

      <span class="breadcrumb-separator"><i class="sep-slash"></i></span>
      
      <span class="breadcrumb-current-group" :class="{ 'is-last': !activeItem || isActiveItemExact }">
        {{ groupTitle }}
      </span>

      <template v-if="activeItem && !isActiveItemExact">
        <span class="breadcrumb-separator"><i class="sep-slash"></i></span>
        <span class="breadcrumb-active-item">{{ activeItem.name }}</span>
      </template>
    </nav>
    
    <div class="breadcrumb-divider"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  groupTitle: string;
  items: { name: string; path: string }[];
  /** 在 /content/:id 等场景下列表页路径，用于高亮侧栏与面包屑 */
  highlightPath?: string;
}>();

const route = useRoute();

const activeItem = computed(() => {
  if (props.highlightPath) {
    const h = props.highlightPath;
    return (
      props.items.find(item => item.path === h) ??
      props.items.find(item => h.startsWith(item.path))
    );
  }
  return props.items.find(item => route.path.startsWith(item.path));
});

const isActiveItemExact = computed(() => {
  if (!activeItem.value) return false;
  if (props.highlightPath) {
    // 统一内容详情路由与真实列表路径不同，需始终展示子栏目层级
    if (route.path.startsWith('/content/')) {
      return false;
    }
    return props.highlightPath === activeItem.value.path;
  }
  return route.path === activeItem.value.path;
});
</script>

<style scoped>
/* 容器增加间距 */
.breadcrumbs-wrapper {
  margin-bottom: 32px;
}

.breadcrumbs-container {
  display: flex;
  align-items: center;
  padding: 8px 0 16px 0; /* 底部留出间距给横线 */
  font-size: 13px;
}

/* 链接与文字样式（保持之前的设计） */
.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 6px;
}

.breadcrumb-link:hover {
  color: #0c4da2;
  background-color: rgba(12, 77, 162, 0.05);
}

.breadcrumb-separator {
  margin: 0 8px;
}

.sep-slash {
  display: block;
  width: 1px;
  height: 12px;
  background-color: #cbd5e1;
  transform: rotate(25deg);
}

.breadcrumb-current-group {
  color: #475569;
  font-weight: 500;
}

.breadcrumb-current-group.is-last {
  color: #1e293b;
  font-weight: 600;
}

.breadcrumb-active-item {
  color: #0c4da2;
  font-weight: 600;
}

/* --- 横线美化：渐变分割线 --- */
.breadcrumb-divider {
  height: 1px;
  /* 使用线性渐变：
     从左侧透明 -> 中间淡淡的边框色 -> 右端透明
     这样横线不会显得太突兀切断页面 
  */
  background: linear-gradient(
    to right, 
    rgba(226, 232, 240, 0) 0%, 
    rgba(226, 232, 240, 1) 15%, 
    rgba(226, 232, 240, 1) 85%, 
    rgba(226, 232, 240, 0) 100%
  );
  position: relative;
}

/* 可选：在横线最左侧加一个品牌色的小色块，呼应 Home 页的装饰条 */
.breadcrumb-divider::before {
  content: "";
  position: absolute;
  left: 0;
  top: -1px;
  width: 40px;
  height: 3px;
  background: #0c4da2;
  border-radius: 2px;
  opacity: 0.8;
}

/* 动画：横线加载时轻轻展开 */
.breadcrumb-divider {
  animation: growWidth 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes growWidth {
  from { opacity: 0; width: 0; }
  to { opacity: 1; width: 100%; }
}
</style>