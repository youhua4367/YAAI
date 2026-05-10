<template>
  <ContentList :items="items" basePath="/about/branches" :show-pagination="false" />
</template>

<script setup lang="ts">
import ContentList from '../../components/common/ContentList.vue'

const items: { id: number; title: string; date?: string }[] = []
</script>

<style scoped>
</style>
