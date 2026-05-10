<template>
  <div class="content-list-container">
    <ul class="list-wrapper" v-if="items.length">
      <li v-for="(item, index) in items" :key="index" class="list-node">
        <router-link :to="getDetailRoute(item.id)" class="list-item">
          <div class="item-main">
            <span class="list-dot"></span>
            <span class="list-title">{{ item.title }}</span>
          </div>
          <div class="item-meta">
            <span class="list-date" v-if="item.date">
              <i class="icon-date"></i>{{ item.date }}
            </span>
            <span class="view-more">详情 <i class="arrow">→</i></span>
          </div>
        </router-link>
      </li>
    </ul>
    <div v-else class="empty-state">
      <p>暂无内容</p>
    </div>

    <nav class="pagination-container" v-if="showPagination && items.length" aria-label="Page navigation">
      <div class="pagination">
        <a href="#" class="page-ctrl prev" title="上一页">
          <i class="fas fa-angle-double-left"></i>
        </a>
        <span class="page-number active">1</span>
        <a href="#" class="page-number">2</a>
        <a href="#" class="page-number">3</a>
        <span class="page-ellipsis">...</span>
        <a href="#" class="page-number">12</a>
        <a href="#" class="page-ctrl next" title="下一页">
          <i class="fas fa-angle-double-right"></i>
        </a>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { contentPath } from '@/utils/contentRoute'

interface ListItem {
  id: string | number
  title: string
  date?: string
}

const props = defineProps({
  items: {
    type: Array as () => ListItem[],
    required: true
  },
  /** 保留供父组件标注来源模块，不参与路由拼接 */
  basePath: {
    type: String,
    default: '/'
  },
  showPagination: {
    type: Boolean,
    default: true
  }
})

const getDetailRoute = (id: string | number) => contentPath(id)
</script>

<style scoped>
.content-list-container {
  --primary-color: #0c4da2;
  --text-main: #334155;
  --text-light: #94a3b8;
  --border-color: #f1f5f9;
  --hover-bg: #f8fafc;
}

.list-wrapper {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-node {
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.list-node:last-child {
  border-bottom: none;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 12px;
  text-decoration: none;
  color: var(--text-main);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  margin: 2px 0;
}

.list-item:hover {
  background: var(--hover-bg);
  padding-left: 20px;
  color: var(--primary-color);
}

.item-main {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.list-dot {
  width: 8px;
  height: 8px;
  background: #cbd5e1;
  border-radius: 2px;
  margin-right: 16px;
  flex-shrink: 0;
  transition: all 0.3s;
  transform: rotate(45deg);
}

.list-item:hover .list-dot {
  background: var(--primary-color);
  box-shadow: 0 0 8px rgba(12, 77, 162, 0.4);
}

.list-title {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  align-items: center;
  margin-left: 24px;
  flex-shrink: 0;
}

.list-date {
  font-size: 14px;
  color: var(--text-light);
  font-family: "SF Mono", "Roboto Mono", monospace;
}

.view-more {
  margin-left: 20px;
  font-size: 13px;
  color: var(--primary-color);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
}

.list-item:hover .view-more {
  opacity: 1;
  transform: translateX(0);
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #94a3b8;
}

.pagination-container {
  margin-top: 48px;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  padding: 6px;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border: 1px solid var(--border-color);
}

.page-number, .page-ctrl {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  padding: 0 6px;
  border-radius: 50%;
  text-decoration: none;
  color: var(--text-main);
  font-size: 14px;
  font-weight: 500;
}

.page-number:hover {
  background: var(--hover-bg);
}

.page-number.active {
  background: var(--primary-color);
  color: #fff;
}

.page-ellipsis {
  padding: 0 8px;
  color: var(--text-light);
}

.page-ctrl {
  color: var(--text-light);
}

.page-ctrl:hover {
  color: var(--primary-color);
}
</style>
