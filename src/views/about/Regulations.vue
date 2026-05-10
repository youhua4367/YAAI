<template>
  <ContentList :items="items" basePath="/about/regulations" :show-pagination="false" />
</template>

<script setup lang="ts">
import ContentList from '../../components/common/ContentList.vue'

/** 规章制度条目请通过后台新闻/栏目维护后，在此对接列表接口 */
const items: { id: number; title: string; date?: string }[] = []
</script>

<style scoped>
</style>
