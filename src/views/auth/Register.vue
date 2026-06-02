<template>
  <AuthPageLayout>
    <template v-if="!registered">
      <h2 class="auth-card__title">会员注册</h2>
      <MemberRegisterForm @success="registered = true" />
    </template>
    <template v-else>
      <div class="auth-success">
        <div class="auth-success__icon">{{ success.iconText }}</div>
        <h2 class="auth-success__title">{{ success.title }}</h2>
        <p class="auth-success__message">{{ success.message }}</p>
        <p class="auth-success__hint">{{ success.hint }}</p>
        <div class="auth-success__actions">
          <router-link
            v-for="action in success.actions"
            :key="action.to"
            :to="action.to"
            :class="action.type === 'primary' ? 'is-primary' : 'is-default'"
          >
            {{ action.text }}
          </router-link>
        </div>
      </div>
    </template>

    <template v-if="!registered" #footer>
      <router-link to="/login">已有账号，去登录</router-link>
      <span class="dot">·</span>
      <router-link to="/">返回首页</router-link>
    </template>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue'
import MemberRegisterForm from '@/components/auth/MemberRegisterForm.vue'
import { APPLY_SUCCESS_CONFIG } from '@/config/apply'

const success = APPLY_SUCCESS_CONFIG
const registered = ref(false)
</script>
