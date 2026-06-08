<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <div class="auth-box">
      <input
        id="reg-username"
        v-model.trim="form.username"
        type="text"
        required
        autocomplete="username"
        maxlength="20"
      />
      <label for="reg-username">用户名</label>
    </div>
    <div class="auth-box">
      <input
        id="reg-phone"
        v-model.trim="form.phone"
        type="tel"
        required
        autocomplete="tel"
        maxlength="11"
      />
      <label for="reg-phone">注册手机号</label>
    </div>
    <div class="auth-box">
      <input
        id="reg-email"
        v-model.trim="form.email"
        type="email"
        required
        autocomplete="email"
      />
      <label for="reg-email">注册邮箱</label>
    </div>
    <div class="auth-box auth-box--code">
      <input
        id="reg-code"
        v-model.trim="form.code"
        type="text"
        required
        autocomplete="one-time-code"
        maxlength="8"
      />
      <label for="reg-code">验证码</label>
      <button
        type="button"
        class="auth-code-btn"
        :disabled="!canSendCode || isSendingCode"
        @click="handleSendCode"
      >
        {{ sendCodeText }}
      </button>
    </div>
    <div class="auth-box">
      <input
        id="reg-password"
        v-model="form.password"
        type="password"
        required
        autocomplete="new-password"
        minlength="8"
        maxlength="32"
      />
      <label for="reg-password">密码</label>
    </div>
    <div class="auth-box">
      <input
        id="reg-confirm-password"
        v-model="form.confirmPassword"
        type="password"
        required
        autocomplete="new-password"
        minlength="8"
        maxlength="32"
      />
      <label for="reg-confirm-password">确认密码</label>
    </div>

    <button type="submit" class="auth-btn" :disabled="isSubmitting" :aria-busy="isSubmitting">
      <span class="auth-btn-text">{{ isSubmitting ? config.submittingText : config.submitText }}</span>
      <span class="auth-btn-edge auth-btn-edge--1" aria-hidden="true" />
      <span class="auth-btn-edge auth-btn-edge--2" aria-hidden="true" />
      <span class="auth-btn-edge auth-btn-edge--3" aria-hidden="true" />
      <span class="auth-btn-edge auth-btn-edge--4" aria-hidden="true" />
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { sendCode } from '@/api/common'
import { useAuthStore } from '@/stores/auth'
import { APPLY_ACCOUNT_CONFIG } from '@/config/apply'
import type { RegisterParams } from '@/types/member'

const emit = defineEmits<{ success: [] }>()

const authStore = useAuthStore()
const config = APPLY_ACCOUNT_CONFIG

const form = reactive({
  username: '',
  phone: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const isSubmitting = ref(false)
const isSendingCode = ref(false)
const countdown = ref(0)

const canSendCode = computed(() => {
  return countdown.value === 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
})

const sendCodeText = computed(() => (countdown.value > 0 ? `${countdown.value}s` : '获取验证码'))

function startCountdown() {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

function validateForm(): boolean {
  const v = config.validation
  const username = form.username.trim()
  if (!username) {
    ElMessage.warning(v.usernameRequired)
    return false
  }
  if (username.length < 4 || username.length > 20) {
    ElMessage.warning(v.usernameLength)
    return false
  }
  if (!/^[A-Za-z0-9_]+$/.test(username)) {
    ElMessage.warning(v.usernamePattern)
    return false
  }
  if (!form.phone.trim()) {
    ElMessage.warning(v.phoneRequired)
    return false
  }
  if (!/^1\d{10}$/.test(form.phone.trim())) {
    ElMessage.warning(v.phonePattern)
    return false
  }
  if (!form.email.trim()) {
    ElMessage.warning(v.emailRequired)
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    ElMessage.warning(v.emailPattern)
    return false
  }
  if (!form.code.trim()) {
    ElMessage.warning(v.codeRequired)
    return false
  }
  if (!form.password) {
    ElMessage.warning(v.passwordRequired)
    return false
  }
  if (form.password.length < 8 || form.password.length > 32 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
    ElMessage.warning(v.passwordRule)
    return false
  }
  if (!form.confirmPassword) {
    ElMessage.warning(v.confirmPasswordRequired)
    return false
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.warning(v.passwordMismatch)
    return false
  }
  return true
}

async function handleSendCode() {
  if (!canSendCode.value || isSendingCode.value) return
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    ElMessage.warning(config.validation.emailPattern)
    return
  }

  isSendingCode.value = true
  try {
    await sendCode(form.email.trim())
    ElMessage.success('验证码已发送到您的邮箱')
    startCountdown()
  } catch {
    ElMessage.error('发送验证码失败，请重试')
  } finally {
    isSendingCode.value = false
  }
}

async function handleSubmit() {
  if (isSubmitting.value || !validateForm()) return

  isSubmitting.value = true
  try {
    const payload: RegisterParams = {
      username: form.username.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      code: form.code.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      acceptAgreement: true
    }
    const result = await authStore.doRegister(payload)

    if (result.success) {
      ElMessage.success('注册成功！')
      emit('success')
    }
  } catch {
    ElMessage.error('注册失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>
