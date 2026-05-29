<template>
  <article class="rich-text-block">
    <h2 v-if="title" class="rich-text-block__title">{{ title }}</h2>
    <div v-if="content" class="rich-text-block__content">{{ content }}</div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  content?: string
}>()
</script>

<style scoped>
.rich-text-block {
  padding: 8px 0 24px;
}

.rich-text-block__title {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}

.rich-text-block__content {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: #334155;
  white-space: pre-wrap;
}
</style>
