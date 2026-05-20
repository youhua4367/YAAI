import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { useSitePagesStore } from '@/stores/sitePages'
import { useSiteMenusStore } from '@/stores/siteMenus'
import { useSiteConfigStore } from '@/stores/siteConfig'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  pinia.use(createPersistedState())

  app.use(pinia)

  const sitePagesStore = useSitePagesStore(pinia)
  const siteMenusStore = useSiteMenusStore(pinia)
  await sitePagesStore.ensureLoaded()
  await siteMenusStore.ensureLoaded()
  await useSiteConfigStore(pinia).ensureLoaded()
  sitePagesStore.registerSiteRoutes(router)

  app.use(router)
  app.use(ElementPlus)
  app.mount('#app')
}

bootstrap().catch((err) => {
  console.error('[bootstrap] 启动失败', err)
})
