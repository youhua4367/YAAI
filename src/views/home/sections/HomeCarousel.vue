<template>
  <div class="carousel-container">
    <!-- 3D轮播轨道 -->
    <div class="carousel-3d">
      <article 
        v-for="(slide, index) in slides" 
        :key="index"
        class="slide"
        :class="{ 
          active: index === activeSlide,
          prev: index === getPrevIndex(),
          next: index === getNextIndex()
        }"
        :style="getSlideStyle(index)"
        @click="setActiveSlide(index)"
      >
        <div class="slide-inner">
          <div class="slide-bg" :style="{ backgroundImage: `url(${slide.image})` }"></div>
          <div class="slide-shine"></div>
          
          <div class="slide-overlay">
            <div class="slide-content">
              <span class="slide-badge" :class="{ 'badge-in': index === activeSlide }">
                <span class="badge-text">{{ slide.badge }}</span>
                <span class="badge-glow"></span>
              </span>
              <h2 class="slide-title" :class="{ 'title-in': index === activeSlide }">
                {{ slide.title }}
              </h2>
              <p class="slide-desc" :class="{ 'desc-in': index === activeSlide }">
                {{ slide.description }}
              </p>
              <div class="slide-action" :class="{ 'action-in': index === activeSlide }">
                <button class="learn-more">
                  <span class="btn-text">了解详情</span>
                  <span class="btn-icon">→</span>
                  <span class="btn-shine"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 进度指示器 -->
    <div class="progress-indicator">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="progress-item"
        :class="{ active: index === activeSlide }"
        @click="setActiveSlide(index)"
      >
        <div class="progress-bg"></div>
        <div class="progress-fill" :style="{ width: index === activeSlide ? progressWidth + '%' : '0%' }"></div>
        <span class="progress-num">0{{ index + 1 }}</span>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="decor-line"></div>
    <div class="decor-circle"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const activeSlide = ref(0);
const progressWidth = ref(0);
let interval: number | null = null;
let progressInterval: number | null = null;
const slideDuration = 6000;

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    badge: '年度重点活动',
    title: '云南人工智能创新大会暨产业对接周正式启动',
    description: '围绕大模型、智能制造、智慧政务、低空经济与具身智能等方向，建设面向云南的学术交流与成果转化平台。'
  },
  {
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80',
    badge: '学会新闻',
    title: '云智会与省内高校、园区及企业签署协同创新合作计划',
    description: '围绕科研基金、场景开放、竞赛培训和技术服务，推动区域人工智能创新共同体建设。'
  },
  {
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1600&q=80',
    badge: '品牌项目',
    title: '“云智讲堂”第十二期开讲：面向边疆场景的多模态智能系统',
    description: '邀请高校学者、产业专家与青年研究人员，聚焦边缘智能、遥感分析与多语种应用。'
  }
];

const getPrevIndex = () => (activeSlide.value - 1 + slides.length) % slides.length;
const getNextIndex = () => (activeSlide.value + 1) % slides.length;

const getSlideStyle = (index: number) => {
  const diff = index - activeSlide.value;
  const normalizedDiff = ((diff + slides.length) % slides.length);
  
  if (normalizedDiff === 0) {
    return {
      transform: 'translateX(0) scale(1) rotateY(0deg)',
      zIndex: 3,
      opacity: 1
    };
  } else if (normalizedDiff === 1 || normalizedDiff === -2) {
    return {
      transform: 'translateX(60%) scale(0.85) rotateY(-15deg)',
      zIndex: 2,
      opacity: 0.6
    };
  } else {
    return {
      transform: 'translateX(-60%) scale(0.85) rotateY(15deg)',
      zIndex: 2,
      opacity: 0.6
    };
  }
};

const setActiveSlide = (index: number) => {
  activeSlide.value = index;
  startTimer();
};

const startTimer = () => {
  if (interval) clearInterval(interval);
  if (progressInterval) clearInterval(progressInterval);
  
  progressWidth.value = 0;
  const step = 100 / (slideDuration / 50);
  
  progressInterval = window.setInterval(() => {
    progressWidth.value += step;
    if (progressWidth.value >= 100) {
      progressWidth.value = 0;
    }
  }, 50);
  
  interval = window.setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % slides.length;
    progressWidth.value = 0;
  }, slideDuration);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
  if (progressInterval) clearInterval(progressInterval);
});
</script>

<style scoped>
.carousel-container {
  position: relative;
  height: 520px;
  perspective: 1500px;
  overflow: visible;
}

/* 3D轮播轨道 */
.carousel-3d {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.slide {
  position: absolute;
  width: 70%;
  height: 100%;
  left: 15%;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  transform-style: preserve-3d;
}

.slide-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
}

/* 背景图 */
.slide-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 8s ease-out;
}

.slide.active .slide-bg {
  transform: scale(1.1);
}

/* 光泽效果 */
.slide-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.1) 45%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 55%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 0s;
}

.slide.active .slide-shine {
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  50%, 100% { transform: translateX(100%); }
}

/* 渐变遮罩 */
.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.9) 0%,
    rgba(15, 23, 42, 0.6) 40%,
    transparent 70%
  );
  display: flex;
  align-items: center;
  padding: 0 60px;
}

.slide-content {
  max-width: 550px;
  color: white;
}

/* 徽章动画 */
.slide-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: linear-gradient(135deg, #0c4da2 0%, #3b82f6 100%);
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.badge-in {
  opacity: 1;
  transform: translateY(0);
}

.badge-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
}

.slide.active .badge-glow {
  animation: badgeGlow 2s ease-in-out infinite;
}

@keyframes badgeGlow {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* 标题动画 */
.slide-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease 0.1s;
}

.title-in {
  opacity: 1;
  transform: translateY(0);
}

/* 描述动画 */
.slide-desc {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease 0.2s;
}

.desc-in {
  opacity: 1;
  transform: translateY(0);
}

/* 按钮动画 */
.slide-action {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease 0.3s;
}

.action-in {
  opacity: 1;
  transform: translateY(0);
}

.learn-more {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #e63946 0%, #dc2626 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(230, 57, 70, 0.4);
}

.learn-more:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(230, 57, 70, 0.5);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.learn-more:hover .btn-icon {
  transform: translateX(5px);
}

.btn-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
}

.learn-more:hover .btn-shine {
  animation: btnShine 0.6s ease;
}

@keyframes btnShine {
  to { transform: translateX(100%); }
}

/* 进度指示器 */
.progress-indicator {
  position: absolute;
  bottom: 40px;
  left: 60px;
  display: flex;
  gap: 20px;
  z-index: 10;
}

.progress-item {
  position: relative;
  width: 60px;
  height: 3px;
  cursor: pointer;
}

.progress-bg {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #0c4da2, #3b82f6);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-num {
  position: absolute;
  top: -25px;
  left: 0;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s ease;
}

.progress-item.active .progress-num {
  color: #3b82f6;
}

/* 装饰元素 */
.decor-line {
  position: absolute;
  top: 50%;
  right: -100px;
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
  transform: rotate(-45deg);
  animation: decorFloat 4s ease-in-out infinite;
}

.decor-circle {
  position: absolute;
  bottom: 80px;
  right: 80px;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: decorRotate 20s linear infinite;
}

.decor-circle::before {
  content: '';
  position: absolute;
  inset: 20px;
  border: 1px solid rgba(230, 57, 70, 0.2);
  border-radius: 50%;
}

@keyframes decorFloat {
  0%, 100% { transform: rotate(-45deg) translateX(0); opacity: 0.5; }
  50% { transform: rotate(-45deg) translateX(30px); opacity: 1; }
}

@keyframes decorRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式 */
@media (max-width: 1024px) {
  .carousel-container {
    height: 450px;
  }

  .slide {
    width: 85%;
    left: 7.5%;
  }

  .slide-title {
    font-size: 28px;
  }

  .slide-overlay {
    padding: 0 40px;
  }

  .progress-indicator {
    left: 40px;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    height: 400px;
  }

  .slide {
    width: 100%;
    left: 0;
  }

  .slide-title {
    font-size: 22px;
  }

  .slide-desc {
    font-size: 14px;
  }

  .slide-overlay {
    padding: 0 24px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(15, 23, 42, 0.9) 50%
    );
    align-items: flex-end;
    padding-bottom: 100px;
  }

  .learn-more {
    padding: 12px 24px;
    font-size: 14px;
  }

  .progress-indicator {
    left: 50%;
    transform: translateX(-50%);
    bottom: 30px;
  }

  .decor-line,
  .decor-circle {
    display: none;
  }
}
</style>
