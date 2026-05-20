<template>
  <footer v-if="hasContent" class="footer">
    <div v-if="mainConfigs.length" class="footer-top">
      <div class="container footer-grid">
        <section
          v-for="cfg in mainConfigs"
          :key="cfg.id"
          class="footer-section"
        >
          <h4>{{ cfg.configKey }}</h4>
          <FooterConfigValue :config="cfg" />
        </section>
      </div>
    </div>

    <div v-if="bottomConfig?.configValue" class="footer-bottom">
      <div class="container">
        <p>{{ bottomConfig.configValue }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import FooterConfigValue from '@/components/layout/FooterConfigValue.vue'
import { useSiteConfigStore } from '@/stores/siteConfig'

const siteConfigStore = useSiteConfigStore()

const mainConfigs = computed(() => siteConfigStore.mainFooterConfigs)
const bottomConfig = computed(() => siteConfigStore.bottomFooterConfig)

const hasContent = computed(
  () => mainConfigs.value.length > 0 || Boolean(bottomConfig.value?.configValue?.trim())
)

onMounted(() => {
  void siteConfigStore.ensureLoaded()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer {
  background: linear-gradient(180deg, #163354 0%, #0d1f33 100%);
  color: rgba(255, 255, 255, 0.8);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.footer-top {
  padding: 60px 0 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.footer-section {
  min-width: 0;
}

.footer h4 {
  margin: 0 0 25px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  position: relative;
  word-break: break-word;
}

.footer h4::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 30px;
  height: 2px;
  background: #00d4ff;
}

.footer-bottom {
  text-align: center;
  padding: 24px 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.5px;
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 576px) {
  .footer h4 {
    margin-bottom: 15px;
  }
  .footer-top {
    padding: 40px 0 20px;
  }
}
</style>
