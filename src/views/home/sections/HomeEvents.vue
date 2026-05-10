<template>
  <div class="card events-section">
    <div class="card-header">
      <div class="title-area">
        <span class="decorator"></span>
        <h3>学会活动</h3>
      </div>
      <router-link to="/conference" class="more-btn">
        更多精彩 <span class="arrow">→</span>
      </router-link>
    </div>

    <div class="events-grid">
      <router-link 
        v-for="(event, index) in events" 
        :key="index"
        :to="event.link"
        class="event-card"
      >
        <div class="event-image-box">
          <img :src="event.image" :alt="event.title">
          <div class="event-tag">学术会议</div>
          <div class="image-overlay">
            <span class="view-btn">查看详情</span>
          </div>
        </div>

        <div class="event-content">
          <h4 class="event-title">{{ event.title }}</h4>
          <div class="event-meta">
            <p class="meta-item">
              <i class="calendar-icon"></i>
              {{ event.date }}
            </p>
            <p class="meta-item">
              <i class="location-icon"></i>
              {{ event.location }}
            </p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
/** 活动详情走会议/活动模块，与本地 detailData 脱钩 */
const events = [
  {
    title: '2026年云南人工智能学术研讨会',
    date: '2026-04-15 至 2026-04-17',
    location: '昆明市·云南大学呈贡校区',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
    link: '/conference'
  },
  {
    title: '人工智能与教育融合发展论坛',
    date: '2026-03-25',
    location: '昆明市·云南师范大学',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    link: '/conference'
  },
  {
    title: '智能医疗技术研讨会',
    date: '2026-03-20',
    location: '昆明市·昆明医科大学',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
    link: '/conference'
  }
]
</script>

<style scoped>
.events-section {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

/* --- 头部设计 --- */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 28px;
  border-bottom: 1px solid #f1f5f9;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.decorator {
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
}

.more-btn {
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s;
}

.more-btn:hover {
  color: #0c4da2;
}

/* --- 网格设计 --- */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px;
}

/* --- 活动卡片个体 --- */
.event-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(12, 77, 162, 0.2);
}

/* --- 图片区域 --- */
.event-image-box {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.event-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.event-card:hover .event-image-box img {
  transform: scale(1.1);
}

/* 图片上方的小标签 */
.event-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(12, 77, 162, 0.85);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  z-index: 2;
}

/* 悬浮时的遮罩按钮效果 */
.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(12, 77, 162, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover .image-overlay {
  opacity: 1;
}

.view-btn {
  color: #fff;
  border: 1px solid #fff;
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 50px;
}

/* --- 内容区域 --- */
.event-content {
  padding: 20px;
  flex: 1;
}

.event-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  line-height: 1.5;
  height: 48px; /* 固定两行高度，确保整齐 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}

.event-card:hover .event-title {
  color: #0c4da2;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
}

/* 这里由于没引用图标库，用CSS模拟点/线，
   你可以替换为 Element-plus 的图标或是 FontAwesome */
.meta-item::before {
  content: "•";
  color: #0c4da2;
  margin-right: 8px;
  font-weight: bold;
}

/* --- 响应式 --- */
@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .events-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  .event-image-box {
    height: 200px;
  }
}
</style>