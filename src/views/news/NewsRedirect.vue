<template>
  <div class="news-redirect-hint" v-if="showHint">正在进入新闻栏目…</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsCategoryStore } from '@/stores/newsCategory'

const router = useRouter()
const categoryStore = useNewsCategoryStore()
const showHint = ref(true)

onMounted(async () => {
  await categoryStore.ensureLoaded()
  const first = categoryStore.menuItems[0]
  if (first) {
    await router.replace(first.path)
  } else {
    await router.replace('/')
  }
  showHint.value = false
})
</script>

<style scoped>
.news-redirect-hint {
  padding: 48px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}
</style>
