<template>
  <div class="card services-card">
    <div class="card-header">
      <div class="title-group">
        <span class="title-decorator"></span>
        <h3>服务矩阵</h3>
      </div>
      <router-link to="/services" class="more-link">
        查看全部 <span class="arrow">→</span>
      </router-link>
    </div>
    
    <div class="services-grid">
      <router-link 
        v-for="(service, index) in services" 
        :key="index"
        :to="service.url"
        class="service-item"
      >
        <div class="hover-indicator"></div>
        
        <div class="service-icon-wrapper">
          <div class="icon-bg"></div>
          <img :src="service.icon" :alt="service.title" class="main-icon">
        </div>
        
        <div class="service-info">
          <h4>{{ service.title }}</h4>
          <p>{{ service.description }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const services = [
  {
    title: '科技咨询',
    description: '提供人工智能领域的技术咨询和专家解决方案',
    icon: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop',
    url: '/services/consulting'
  },
  {
    title: '技术培训',
    description: '开展人工智能前沿技术培训与专业人才培养',
    icon: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop',
    url: '/services/training'
  },
  {
    title: '项目申报',
    description: '协助企业和科研机构申报国家及省级科技项目',
    icon: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop',
    url: '/services/project'
  },
  {
    title: '成果转化',
    description: '促进人工智能高精尖成果的产业化落地与转化',
    icon: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop',
    url: '/services/transformation'
  }
];
</script>

<style scoped>
.services-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

/* --- 头部美化 --- */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 28px;
  border-bottom: 1px solid #f1f5f9;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-decorator {
  width: 4px;
  height: 20px;
  background: #0c4da2;
  border-radius: 2px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.more-link {
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-link:hover {
  color: #0c4da2;
  transform: translateX(3px);
}

/* --- 网格布局 --- */
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px; /* 模拟细边框网格 */
  background: #f1f5f9; /* 网格线颜色 */
  padding: 0;
}

.service-item {
  position: relative;
  text-decoration: none;
  background: #fff;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* --- 悬浮效果 --- */
.service-item:hover {
  background: #f8fafc;
  z-index: 1;
  box-shadow: 0 10px 30px rgba(12, 77, 162, 0.08);
}

.hover-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #0c4da2;
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.service-item:hover .hover-indicator {
  transform: scaleX(1);
}

/* --- 图标美化 --- */
.service-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bg {
  position: absolute;
  inset: 0;
  background: #f0f7ff;
  border-radius: 50%;
  transition: all 0.4s ease;
}

.service-item:hover .icon-bg {
  background: #0c4da2;
  transform: scale(1.1) rotate(15deg);
  border-radius: 18px; /* 悬浮时圆球变方圆 */
}

.main-icon {
  position: relative;
  z-index: 2;
  width: 44px;
  height: 44px;
  object-fit: contain;
  transition: all 0.4s ease;
}

/* 修改此处的 CSS */
.service-item:hover .main-icon {
  /* 移除 filter: brightness(0) invert(1); */
  transform: scale(1.1); 
  /* 如果想让图标更亮一点，可以用这个： */
  filter: brightness(1.1); 
}

/* --- 文字排版 --- */
.service-item h4 {
  margin: 0 0 12px 0;
  font-size: 17px;
  font-weight: 600;
  color: #334155;
  transition: color 0.3s;
}

.service-item:hover h4 {
  color: #0c4da2;
}

.service-item p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  padding: 0 10px;
}

/* --- 响应式适配 --- */
@media (max-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  .service-item {
    padding: 30px 20px;
    border-bottom: 1px solid #f1f5f9;
  }
}
</style>