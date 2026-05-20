<template>
  <div v-if="slides.length" class="carousel-container">
    <div class="carousel-3d">
      <article
        v-for="(slide, index) in slides"
        :key="slide.id"
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
          <div class="slide-bg" :style="{ backgroundImage: slide.image ? `url(${slide.image})` : undefined }" />
          <div class="slide-shine"></div>

          <div class="slide-overlay">
            <div class="slide-content">
              <span
                v-if="slide.badge"
                class="slide-badge"
                :class="{ 'badge-in': index === activeSlide }"
              >
                <span class="badge-text">{{ slide.badge }}</span>
                <span class="badge-glow"></span>
              </span>
              <h2 class="slide-title" :class="{ 'title-in': index === activeSlide }">
                {{ slide.title }}
              </h2>
              <p v-if="slide.description" class="slide-desc" :class="{ 'desc-in': index === activeSlide }">
                {{ slide.description }}
              </p>
              <div v-if="slide.linkUrl" class="slide-action" :class="{ 'action-in': index === activeSlide }">
                <component
                  :is="slide.linkExternal ? 'a' : 'router-link'"
                  class="learn-more"
                  :href="slide.linkExternal ? slide.linkUrl : undefined"
                  :to="slide.linkExternal ? undefined : slide.linkUrl"
                  @click.stop
                >
                  <span class="btn-text">了解详情</span>
                  <span class="btn-icon">→</span>
                  <span class="btn-shine"></span>
                </component>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-if="slides.length > 1" class="progress-indicator">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="progress-item"
        :class="{ active: index === activeSlide }"
        @click="setActiveSlide(index)"
      >
        <div class="progress-bg"></div>
        <div
          class="progress-fill"
          :style="{ width: index === activeSlide ? progressWidth + '%' : '0%' }"
        />
        <span class="progress-num">0{{ index + 1 }}</span>
      </div>
    </div>

    <div class="decor-line"></div>
    <div class="decor-circle"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchHomeBanners } from '@/api/banner'
import type { Banner } from '@/types/banner'
import { resolvePublicAssetUrl } from '@/utils/siteConfigFormat'

const slideDuration = 6000

interface CarouselSlide {
  id: number
  image: string
  badge: string
  title: string
  description: string
  linkUrl: string
  linkExternal: boolean
}

const slides = ref<CarouselSlide[]>([])
const activeSlide = ref(0)
const progressWidth = ref(0)
let interval: number | null = null
let progressInterval: number | null = null

function mapBanner(banner: Banner): CarouselSlide {
  const linkUrl = banner.linkUrl?.trim() || ''
  return {
    id: banner.id,
    image: resolvePublicAssetUrl(banner.imageUrl),
    badge: '',
    title: banner.title?.trim() || '',
    description: banner.subtitle?.trim() || '',
    linkUrl,
    linkExternal: /^https?:\/\//i.test(linkUrl)
  }
}

const getPrevIndex = () =>
  slides.value.length
    ? (activeSlide.value - 1 + slides.value.length) % slides.value.length
    : 0
const getNextIndex = () =>
  slides.value.length ? (activeSlide.value + 1) % slides.value.length : 0

const getSlideStyle = (index: number) => {
  const len = slides.value.length
  if (!len) return {}
  const diff = index - activeSlide.value
  const normalizedDiff = (diff + len) % len

  if (normalizedDiff === 0) {
    return {
      transform: 'translateX(0) scale(1) rotateY(0deg)',
      zIndex: 3,
      opacity: 1
    }
  }
  if (normalizedDiff === 1 || normalizedDiff === -2) {
    return {
      transform: 'translateX(60%) scale(0.85) rotateY(-15deg)',
      zIndex: 2,
      opacity: 0.6
    }
  }
  return {
    transform: 'translateX(-60%) scale(0.85) rotateY(15deg)',
    zIndex: 2,
    opacity: 0.6
  }
}

const setActiveSlide = (index: number) => {
  activeSlide.value = index
  startTimer()
}

const startTimer = () => {
  if (interval) clearInterval(interval)
  if (progressInterval) clearInterval(progressInterval)
  if (slides.value.length <= 1) return

  progressWidth.value = 0
  const step = 100 / (slideDuration / 50)

  progressInterval = window.setInterval(() => {
    progressWidth.value += step
    if (progressWidth.value >= 100) {
      progressWidth.value = 0
    }
  }, 50)

  interval = window.setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % slides.value.length
    progressWidth.value = 0
  }, slideDuration)
}

onMounted(async () => {
  const banners = await fetchHomeBanners()
  slides.value = banners.map(mapBanner).filter((s) => s.title || s.image)
  activeSlide.value = 0
  startTimer()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  height: 520px;
  perspective: 1500px;
  overflow: visible;
}

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

.slide-bg {
  position: absolute;
  inset: 0;
  background-color: #1e293b;
  background-size: cover;
  background-position: center;
  transition: transform 8s ease-out;
}

.slide.active .slide-bg {
  transform: scale(1.1);
}

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
  0% {
    transform: translateX(-100%);
  }
  50%,
  100% {
    transform: translateX(100%);
  }
}

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

.slide-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: linear-gradient(135deg, #0c4da2 0%, #3b82f6 100%);
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
}

.slide.active .badge-glow {
  animation: badgeGlow 2s ease-in-out infinite;
}

@keyframes badgeGlow {
  0%,
  100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

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
  text-decoration: none;
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
}

.learn-more:hover .btn-shine {
  animation: btnShine 0.6s ease;
}

@keyframes btnShine {
  to {
    transform: translateX(100%);
  }
}

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
  0%,
  100% {
    transform: rotate(-45deg) translateX(0);
    opacity: 0.5;
  }
  50% {
    transform: rotate(-45deg) translateX(30px);
    opacity: 1;
  }
}

@keyframes decorRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

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
    background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.9) 50%);
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
