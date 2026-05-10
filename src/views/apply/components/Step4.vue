<template>
  <div class="success-content">
    <div class="success-icon">{{ success.iconText }}</div>
    <h2 class="success-title">{{ success.title }}</h2>
    <p class="success-message">{{ success.message }}</p>
    <p class="success-hint">{{ success.hint }}</p>
    <div class="success-actions">
      <router-link
        v-for="action in success.actions"
        :key="action.to"
        :to="action.to"
        class="btn"
        :class="action.type === 'primary' ? 'btn-primary' : 'btn-default'"
      >
        {{ action.text }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APPLY_SUCCESS_CONFIG } from '@/config/apply'

const success = APPLY_SUCCESS_CONFIG
</script>

<style scoped>
.success-content { text-align: center; }
.success-icon { width: 80px; height: 80px; border-radius: 50%; background: #52c41a; color: #fff; font-size: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
.success-title { font-size: 24px; font-weight: 600; color: #333; margin-bottom: 16px; }
.success-message { font-size: 16px; color: #666; margin-bottom: 8px; }
.success-hint { font-size: 14px; color: #999; margin-bottom: 32px; }
.success-actions { display: flex; gap: 16px; justify-content: center; }
.btn { padding: 12px 32px; border-radius: 4px; font-size: 14px; text-decoration: none; }
.btn-primary { background: #0c4da2; color: #fff; }
.btn-default { background: #fff; color: #666; border: 1px solid #d9d9d9; }
</style>
