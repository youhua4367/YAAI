<template>
  <div class="nav-wrap">
    <div class="container">
      <div class="nav-content">
        <div class="brand" @click="goHome">
          <div class="logo">
            <img src="/YAAI_logo_v1.0.svg" alt="云南人工智能学会" />
          </div>
          <div class="titles">
            <h1>云南人工智能学会</h1>
            <p>YNAI</p>
          </div>
        </div>

        <ul class="nav">
          <li
            v-for="item in navItems"
            :key="item.key"
            :class="{ active: isNavItemActive(item) }"
          >
            <router-link :to="item.path">{{ item.name }}</router-link>
            <div v-if="item.children?.length" class="dropdown">
              <router-link
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
              >{{ child.name }}</router-link>
            </div>
          </li>
        </ul>

        <div class="nav-tools">
          <button class="search-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <div class="divider"></div>
          <a href="#" class="lang-en">EN</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSiteMenusStore } from '@/stores/siteMenus'
import { useSitePagesStore } from '@/stores/sitePages'
import type { NavMenuItem } from '@/utils/sitePageNav'
import { isPathUnderModule } from '@/utils/paths'

const route = useRoute()
const router = useRouter()
const siteMenusStore = useSiteMenusStore()
const sitePagesStore = useSitePagesStore()

const navItems = computed(() => siteMenusStore.navItems)

function goHome() {
  const home = sitePagesStore.basePathByCode('home') ?? '/'
  void router.push(home)
}

function isNavItemActive(item: NavMenuItem): boolean {
  if (item.code === 'conference') return route.path.startsWith('/conference')
  if (item.code === 'services') return route.path === '/services'
  if (item.pageId != null) {
    const page = sitePagesStore.pageById(item.pageId)
    if (page) return isPathUnderModule(route.path, page.path)
  }
  return isPathUnderModule(route.path, item.path)
}
</script>

<style scoped>
.nav-wrap {
  background: #0f172a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(59, 130, 246, 0.15);
  backdrop-filter: blur(12px);
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo img {
  height: 44px;
}

.titles h1 {
  margin: 0;
  font-size: 20px;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 1px;
}

.titles p {
  margin: -2px 0 0 0;
  font-size: 13px;
  color: #3b82f6;
  letter-spacing: 2px;
  font-weight: 700;
  font-family: 'Arial', sans-serif;
}

.nav {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0 20px;
  flex: 1;
  justify-content: flex-start;
  gap: 8px;
}

.nav > li {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
}

.nav > li > a {
  padding: 8px 18px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav > li:hover > a {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.nav > li.active > a {
  color: #3b82f6;
  font-weight: 600;
}

.nav > li.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  background: #3b82f6;
  box-shadow: 0 -1px 8px rgba(59, 130, 246, 0.5);
}

.dropdown {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  top: 75px;
  min-width: 180px;
  background: #1e293b;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 0;
  z-index: 100;
  transition: all 0.25s ease-out;
}

.nav > li:hover .dropdown {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.dropdown a {
  display: block;
  padding: 10px 20px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
}

.dropdown a:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding-left: 25px;
}

.nav-tools {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;
  flex-shrink: 0;
}

.search-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.search-btn svg {
  width: 22px;
  height: 22px;
}

.search-btn:hover {
  color: #3b82f6;
  transform: scale(1.1);
}

.divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
}

.lang-en {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 1280px) {
  .nav > li > a { font-size: 15px; padding: 8px 12px; }
  .nav { gap: 2px; }
}
</style>
