<template>
  <div class="page-wrap">
    <div class="dynamic-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="gradient-orb orb-4"></div>
      <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      <div class="grid-overlay"></div>
    </div>

    <div class="container">
      <template v-for="(block, index) in layoutBlocks" :key="blockKey(block, index)">
        <section
          v-if="block.type === 'single'"
          :class="block.sectionClass"
          v-intersect="markVisible"
        >
          <NodeRenderer :node="block.node" />
        </section>

        <section
          v-else
          class="home-section flex-section"
          v-intersect="markVisible"
        >
          <div class="grid-row">
            <div
              v-for="item in block.nodes"
              :key="item.node.id"
              :class="item.colClass"
            >
              <NodeRenderer :node="item.node" />
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NodeRenderer from '@/components/lowcode/NodeRenderer.vue'
import { useHomeParticles } from '@/composables/useHomeParticles'
import { vIntersect } from '@/directives/intersect'
import type { PageNodeTreeNode } from '@/types/lowcode'

const props = defineProps<{
  root: PageNodeTreeNode
}>()

const particleCanvas = ref<HTMLCanvasElement | null>(null)
useHomeParticles(particleCanvas)

type SingleBlock = {
  type: 'single'
  node: PageNodeTreeNode
  sectionClass: string
}

type FlexBlock = {
  type: 'flex-row'
  nodes: Array<{ node: PageNodeTreeNode; colClass: string }>
}

type HomeLayoutBlock = SingleBlock | FlexBlock

const sectionNodes = computed(() => {
  if (props.root.componentKey === 'page_container') {
    return props.root.children
  }
  return [props.root]
})

const layoutBlocks = computed<HomeLayoutBlock[]>(() => {
  const children = sectionNodes.value
  const blocks: HomeLayoutBlock[] = []
  let i = 0

  while (i < children.length) {
    const node = children[i]
    const key = node.componentKey

    if (key === 'hero_banner') {
      blocks.push({ type: 'single', node, sectionClass: 'home-section hero-section' })
      i++
      continue
    }

    if (key === 'notice_list' && children[i + 1]?.componentKey === 'quick_links') {
      blocks.push({
        type: 'flex-row',
        nodes: [
          { node: children[i], colClass: 'grid-col-4 slide-in-left' },
          { node: children[i + 1], colClass: 'grid-col-8 slide-in-right' }
        ]
      })
      i += 2
      continue
    }

    if (key === 'news_list') {
      blocks.push({
        type: 'flex-row',
        nodes: [{ node: children[i], colClass: 'grid-col-12 slide-in-left' }]
      })
      i++
      continue
    }

    if (key === 'friend_links') {
      blocks.push({ type: 'single', node, sectionClass: 'home-section footer-links' })
      i++
      continue
    }

    blocks.push({ type: 'single', node, sectionClass: 'home-section' })
    i++
  }

  return blocks
})

function blockKey(block: HomeLayoutBlock, index: number): string {
  if (block.type === 'single') return `single-${block.node.id}`
  return `flex-${block.nodes.map((n) => n.node.id).join('-')}-${index}`
}

function markVisible(el: Element) {
  el.classList.add('is-visible')
}
</script>

<style scoped>
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
  0%,
  100% {
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

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

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

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

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

.grid-row {
  display: flex;
  gap: 28px;
}

.grid-col-4 {
  flex: 4;
  min-width: 0;
}

.grid-col-8 {
  flex: 8;
  min-width: 0;
}

.grid-col-12 {
  flex: 12;
  min-width: 0;
}

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

  .orb-1 {
    width: 300px;
    height: 300px;
  }
  .orb-2 {
    width: 250px;
    height: 250px;
  }
  .orb-3 {
    width: 200px;
    height: 200px;
  }
  .orb-4 {
    width: 180px;
    height: 180px;
  }
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
