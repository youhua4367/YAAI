<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from './components/layout/Header.vue';
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';

const route = useRoute();
const isUserCenter = computed(() => route.path === '/user');
const isLoginPage = computed(() => route.path === '/login');
const hideChrome = computed(() => isUserCenter.value || isLoginPage.value);
</script>

<template>
  <div class="app">
    <template v-if="!hideChrome">
      <Header />
      <Navbar />
    </template>
    <router-view />
    <Footer v-if="!hideChrome" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
}

:deep(.app > router-view) {
  flex: 1;
}

:deep(.app > header),
:deep(.app > nav),
:deep(.app > footer) {
  flex: none;
}
</style>
