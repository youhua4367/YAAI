<template>
  <div class="card friend-links-section">
    <div class="card-header">
      <div class="title-group">
        <span class="decorator"></span>
        <h3>友情链接</h3>
      </div>
      <span class="sub-tip">外部协作单位与学术合作机构</span>
    </div>
    
    <div class="links-container">
      <a 
        v-for="(link, index) in friendLinks" 
        :key="index"
        :href="link.url"
        target="_blank"
        class="link-tag"
      >
        <span class="link-text">{{ link.name }}</span>
        <svg class="external-icon" viewBox="0 0 1024 1024" width="12" height="12">
          <path d="M768 853.333H170.667V256h298.666v-85.333H170.667c-46.934 0-85.334 38.4-85.334 85.333v597.334c0 46.933 38.4 85.333 85.334 85.333h597.333c46.933 0 85.333-38.4 85.333-85.333V554.667H768v298.666zM597.333 85.333v85.334h124.587L315.733 576.853l60.587 60.587 406.187-406.187v124.587h85.333V85.333H597.333z" fill="currentColor"></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
// 友情链接数据
const friendLinks = [
  { name: '中国人工智能学会', url: 'http://www.caa.org.cn/' },
  { name: '云南省科学技术协会', url: 'http://www.ynast.org.cn/' },
  { name: '云南大学', url: 'https://www.ynu.edu.cn/' },
  { name: '昆明理工大学', url: 'https://www.kmust.edu.cn/' },
  { name: '云南师范大学', url: 'https://www.ynnu.edu.cn/' },
  { name: '昆明医科大学', url: 'https://www.kmmc.cn/' },
  { name: '云南省科技厅', url: 'http://kjt.yn.gov.cn/' },
  { name: '昆明市科技局', url: 'http://kjj.km.gov.cn/' }
];
</script>

<style scoped>
.friend-links-section {
  background: #fcfdfe; /* 极浅的蓝灰色背景，区分于上方主内容 */
  border-radius: 12px;
  border: 1px solid #edf2f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.decorator {
  width: 4px;
  height: 16px;
  background: #0c4da2;
  border-radius: 2px;
  opacity: 0.7;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  letter-spacing: 0.5px;
}

.sub-tip {
  font-size: 12px;
  color: #94a3b8;
}

.links-container {
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.link-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.link-text {
  font-size: 13.5px;
  color: #475569;
  font-weight: 500;
}

.external-icon {
  color: #cbd5e1;
  transition: all 0.3s;
}

/* --- 悬浮交互 --- */
.link-tag:hover {
  background: #fff;
  border-color: #0c4da2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 77, 162, 0.1);
}

.link-tag:hover .link-text {
  color: #0c4da2;
}

.link-tag:hover .external-icon {
  color: #0c4da2;
  transform: translate(1px, -1px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .links-container {
    padding: 16px;
    gap: 8px;
  }
  
  .link-tag {
    padding: 6px 12px;
  }
  
  .sub-tip {
    display: none; /* 移动端隐藏副标题以节省空间 */
  }
}
</style>