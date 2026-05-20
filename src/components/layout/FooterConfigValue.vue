<template>
  <nav v-if="friendLinks.length" class="footer-value-links">
    <a
      v-for="link in friendLinks"
      :key="link.url"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
    >{{ link.name }}</a>
  </nav>
  <img
    v-else-if="showImage"
    class="footer-value-img"
    :src="imageSrc"
    :alt="config.configKey"
    loading="lazy"
  />
  <p v-else-if="textValue" class="footer-value-text">{{ textValue }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SiteConfig } from '@/types/siteConfig'
import {
  isImageConfigValue,
  parseFriendLinks,
  resolvePublicAssetUrl
} from '@/utils/siteConfigFormat'

const props = defineProps<{
  config: SiteConfig
}>()

const textValue = computed(() => props.config.configValue?.trim() ?? '')

const friendLinks = computed(() =>
  props.config.configKey === 'friend_links' ? parseFriendLinks(props.config.configValue) : []
)

const showImage = computed(() =>
  friendLinks.value.length === 0 && isImageConfigValue(props.config.configKey, props.config.configValue)
)

const imageSrc = computed(() => resolvePublicAssetUrl(props.config.configValue))
</script>

<style scoped>
.footer-value-text {
  margin: 0;
  line-height: 1.8;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  white-space: pre-wrap;
  word-break: break-word;
}

.footer-value-img {
  max-width: 160px;
  max-height: 48px;
  object-fit: contain;
}

.footer-value-links a {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.footer-value-links a:hover {
  color: #00d4ff;
  padding-left: 6px;
}
</style>
