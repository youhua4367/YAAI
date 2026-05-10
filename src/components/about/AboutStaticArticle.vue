<template>
  <div class="about-static-article">
    <header class="content-header">
      <div class="title-with-lines">
        <span class="line-left"></span>
        <h2 class="main-title">{{ data.title }}</h2>
        <span class="line-right"></span>
      </div>
      <p v-if="data.subtitle" class="static-subtitle">{{ data.subtitle }}</p>
      <p v-if="data.englishName" class="static-en">{{ data.englishName }}</p>
    </header>
    <article class="legacy-body">
      <p v-for="(line, i) in paragraphs" :key="i">{{ line }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { staticData } from '@/data/staticData'

const props = defineProps<{
  pageKey: keyof typeof staticData
}>()

const data = computed(() => staticData[props.pageKey])
const paragraphs = computed(() => data.value.content.filter((line) => line.trim().length > 0))
</script>

<style scoped>
.about-static-article {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px 60px;
  color: #333;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.content-header {
  text-align: center;
  margin-bottom: 50px;
}

.static-subtitle {
  margin: 12px 0 0;
  font-size: 16px;
  color: #64748b;
}

.static-en {
  margin: 8px 0 0;
  font-size: 14px;
  color: #94a3b8;
  font-style: italic;
}

.title-with-lines {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
}

.line-left,
.line-right {
  flex: 0 1 120px;
  height: 1px;
  background: #dcdfe6;
  position: relative;
}

.line-left::before,
.line-right::after {
  content: "";
  position: absolute;
  top: -4px;
  width: 10px;
  height: 10px;
  border-top: 1px solid #dcdfe6;
}
.line-left::before {
  left: 0;
  border-left: 1px solid #dcdfe6;
  transform: rotate(-45deg);
}
.line-right::after {
  right: 0;
  border-right: 1px solid #dcdfe6;
  transform: rotate(45deg);
}

.main-title {
  font-size: 32px;
  font-weight: 700;
  color: #222;
  margin: 0;
  letter-spacing: 2px;
}

.legacy-body {
  padding: 0 20px;
  font-size: 17px;
  line-height: 1.85;
  color: #3f4e5e;
  text-align: justify;
}

.legacy-body p {
  margin-bottom: 28px;
  text-indent: 2em;
}

@media (max-width: 768px) {
  .line-left,
  .line-right {
    display: none;
  }

  .main-title {
    font-size: 24px;
  }

  .legacy-body {
    font-size: 16px;
    padding: 0;
  }

  .legacy-body p {
    text-indent: 1.5em;
  }
}
</style>
