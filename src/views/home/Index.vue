<template>
  <div class="page-wrap">
    <!-- 动态背景层 -->
    <div class="dynamic-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="gradient-orb orb-4"></div>
      <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      <div class="grid-overlay"></div>
    </div>

    <div class="container">
      <!-- Hero轮播区 -->
      <section class="home-section hero-section" v-intersect="onHeroIntersect">
        <HomeCarousel />
      </section>

      <!-- 通知与快速入口 -->
      <section class="home-section flex-section" v-intersect="onSectionIntersect">
        <div class="grid-row">
          <div class="grid-col-4 slide-in-left">
            <HomeNotice />
          </div>
          <div class="grid-col-8 slide-in-right">
            <HomeQuickLinks />
          </div>
        </div>
      </section>

      <!-- 服务矩阵 -->
      <section class="home-section" v-intersect="onSectionIntersect">
        <HomeServices />
      </section>

      <!-- 活动预告 -->
      <section class="home-section" v-intersect="onSectionIntersect">
        <HomeEvents />
      </section>

      <!-- 新闻公告 / 学会新闻 -->
      <section class="home-section flex-section" v-intersect="onSectionIntersect">
        <div class="grid-row">
          <div class="grid-col-12 slide-in-left">
            <HomeNews />
          </div>
        </div>
      </section>

      <!-- 快捷导航 -->
      <section class="home-section" v-intersect="onSectionIntersect">
        <HomeShortcuts />
      </section>

      <!-- 友情链接 -->
      <section class="home-section footer-links" v-intersect="onSectionIntersect">
        <HomeFriendLinks />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HomeCarousel from '@/views/home/sections/HomeCarousel.vue';
import HomeNotice from '@/views/home/sections/HomeNotice.vue';
import HomeQuickLinks from '@/views/home/sections/HomeQuickLinks.vue';
import HomeNews from '@/views/home/sections/HomeNews.vue';
import HomeServices from '@/views/home/sections/HomeServices.vue';
import HomeEvents from '@/views/home/sections/HomeEvents.vue';
import HomeShortcuts from '@/views/home/sections/HomeShortcuts.vue';
import HomeFriendLinks from '@/views/home/sections/HomeFriendLinks.vue';

const particleCanvas = ref<HTMLCanvasElement | null>(null);
let animationId: number;

// 粒子动画系统
const initParticles = () => {
  if (!particleCanvas.value) return;
  
  const canvas = particleCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 粒子类
  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;

    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '147, 197, 253' : '248, 113, 113';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  // 创建粒子
  const particles: Particle[] = [];
  const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // 连线
  const connectParticles = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(147, 197, 253, ${0.15 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    connectParticles();
    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.removeEventListener('resize', resizeCanvas);
  };
};

// 滚动触发动画
const onHeroIntersect = (el: Element) => {
  el.classList.add('is-visible');
};

const onSectionIntersect = (el: Element) => {
  el.classList.add('is-visible');
};

// 自定义指令：滚动监听
const vIntersect = {
  mounted(el: Element, binding: any) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            binding.value(el);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
  }
};

onMounted(() => {
  const cleanup = initParticles();
  
  onUnmounted(() => {
    cancelAnimationFrame(animationId);
    cleanup?.();
  });
});
</script>

<style scoped>
/* ===== 动态背景系统 ===== */
.page-wrap {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding: 24px 0 60px;
  position: relative;
  overflow: hidden;
}

.dynamic-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* 渐变光球动画 */
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(12, 77, 162, 0.6) 0%, transparent 70%);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(230, 57, 70, 0.4) 0%, transparent 70%);
  bottom: 20%;
  left: -150px;
  animation-delay: -5s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%);
  top: 40%;
  right: 10%;
  animation-delay: -10s;
}

.orb-4 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  bottom: -100px;
  right: 20%;
  animation-delay: -15s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(20px, 10px) scale(1.05);
  }
}

/* 粒子画布 */
.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 网格叠加层 */
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: perspective(500px) rotateX(60deg) translateY(0);
  }
  100% {
    transform: perspective(500px) rotateX(60deg) translateY(50px);
  }
}

/* ===== 容器与布局 ===== */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* ===== 区块动画系统 ===== */
.home-section {
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hero区域特殊动画 */
.hero-section {
  opacity: 1;
  transform: none;
  animation: heroGlow 3s ease-in-out infinite alternate;
}

@keyframes heroGlow {
  from {
    filter: drop-shadow(0 0 20px rgba(12, 77, 162, 0.3));
  }
  to {
    filter: drop-shadow(0 0 40px rgba(12, 77, 162, 0.5));
  }
}

/* 左右滑入动画 */
.slide-in-left {
  opacity: 0;
  transform: translateX(-60px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.slide-in-right {
  opacity: 0;
  transform: translateX(60px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.home-section.is-visible .slide-in-left,
.home-section.is-visible .slide-in-right {
  opacity: 1;
  transform: translateX(0);
}

/* ===== 栅格系统 ===== */
.grid-row {
  display: flex;
  gap: 28px;
}

.grid-col-4 { flex: 4; min-width: 0; }
.grid-col-6 { flex: 6; min-width: 0; }
.grid-col-8 { flex: 8; min-width: 0; }
.grid-col-12 { flex: 12; min-width: 0; }

/* ===== 全局卡片样式增强 ===== */
:deep(.card) {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.card:hover) {
  transform: translateY(-5px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 30px rgba(12, 77, 162, 0.1) !important;
}

/* ===== 响应式设计 ===== */
@media (max-width: 1024px) {
  .grid-row {
    flex-direction: column;
    gap: 24px;
  }
  
  .home-section {
    margin-bottom: 32px;
  }

  .gradient-orb {
    filter: blur(60px);
    opacity: 0.3;
  }

  .orb-1 { width: 300px; height: 300px; }
  .orb-2 { width: 250px; height: 250px; }
  .orb-3 { width: 200px; height: 200px; }
  .orb-4 { width: 180px; height: 180px; }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .slide-in-left,
  .slide-in-right {
    transform: translateY(30px);
  }

  .home-section.is-visible .slide-in-left,
  .home-section.is-visible .slide-in-right {
    transform: translateY(0);
  }
}
</style>
