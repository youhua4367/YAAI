<template>
  <div class="card friend-links-section">
    <div class="card-header">
      <div class="title-group">
        <span class="decorator"></span>
        <h3 v-if="sectionTitle">{{ sectionTitle }}</h3>
      </div>
      <span v-if="sectionSubtitle" class="sub-tip">{{ sectionSubtitle }}</span>
    </div>

    <div v-if="friendLinks.length" class="links-container">
      <a
        v-for="(link, index) in friendLinks"
        :key="`${link.url}-${index}`"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-tag"
      >
        <span class="link-text">{{ link.name }}</span>
        <svg class="external-icon" viewBox="0 0 1024 1024" width="12" height="12">
          <path
            d="M768 853.333H170.667V256h298.666v-85.333H170.667c-46.934 0-85.334 38.4-85.334 85.333v597.334c0 46.933 38.4 85.333 85.334 85.333h597.333c46.933 0 85.333-38.4 85.333-85.333V554.667H768v298.666zM597.333 85.333v85.334h124.587L315.733 576.853l60.587 60.587 406.187-406.187v124.587h85.333V85.333H597.333z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
    <el-empty v-else description="暂无链接" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HomeFriendLinkItem } from '@/types/homeSection'
import { resolveSectionTitle } from '@/utils/sectionTitle'

const props = defineProps<{
  nodeName?: string
  title?: string
  subtitle?: string
  links?: HomeFriendLinkItem[]
}>()

const sectionTitle = computed(() => resolveSectionTitle(props.nodeName, props.title))
const sectionSubtitle = computed(() => props.subtitle?.trim() || '')

const friendLinks = computed(() =>
  props.links?.filter((item) => item.name?.trim() && item.url?.trim()) ?? []
)
</script>

<style scoped>
.friend-links-section {
  background: #fcfdfe;
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

@media (max-width: 768px) {
  .links-container {
    padding: 16px;
    gap: 8px;
  }

  .link-tag {
    padding: 6px 12px;
  }

  .sub-tip {
    display: none;
  }
}
</style>
