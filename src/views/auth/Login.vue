<template>
  <div class="login-view">
    <div class="login-view__bg" aria-hidden="true" />
    <div class="login-view__stack">
      <div class="yn-login">
        <h2 class="yn-login__title">用户登录</h2>
        <form class="yn-login__form" @submit.prevent="onSubmit">
          <div class="yn-login__box">
            <input
              id="yn-login-account"
              v-model.trim="account"
              type="text"
              required
              autocomplete="username"
            />
            <label for="yn-login-account">手机或邮箱</label>
          </div>
          <div class="yn-login__box">
            <input
              id="yn-login-password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
            />
            <label for="yn-login-password">密码</label>
          </div>
          <button type="submit" class="yn-login__btn" :disabled="loading" :aria-busy="loading">
            <span class="yn-login__btn-text">{{ loading ? '登录中…' : '登录' }}</span>
            <span class="yn-login__btn-edge yn-login__btn-edge--1" aria-hidden="true" />
            <span class="yn-login__btn-edge yn-login__btn-edge--2" aria-hidden="true" />
            <span class="yn-login__btn-edge yn-login__btn-edge--3" aria-hidden="true" />
            <span class="yn-login__btn-edge yn-login__btn-edge--4" aria-hidden="true" />
          </button>
        </form>
      </div>
      <div class="login-view__links">
        <router-link to="/apply">会员注册</router-link>
        <span class="dot">·</span>
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/member'
import type { LoginParams } from '@/types/member'

const router = useRouter()

const account = ref('')
const password = ref('')
const loading = ref(false)

function buildParams(): LoginParams {
  const t = account.value.trim()
  const pwd = password.value
  if (t.includes('@')) return { email: t, password: pwd }
  return { phone: t, password: pwd }
}

async function onSubmit() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await login(buildParams())
    if (res.success) {
      ElMessage.success(res.message || '登录成功')
      await router.replace('/user')
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '网络异常'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  background: linear-gradient(145deg, #0f172a 0%, #1e3a5f 45%, #0c4da2 100%);
}

.login-view__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 20%, rgba(56, 189, 248, 0.12), transparent),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(12, 77, 162, 0.35), transparent);
  pointer-events: none;
}

.login-view__stack {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: min(96vw, 600px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.login-view__links {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}

.login-view__links a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s;
}

.login-view__links a:hover {
  color: #38bdf8;
}

.login-view__links .dot {
  color: rgba(255, 255, 255, 0.35);
  user-select: none;
}

.yn-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 48px 56px 52px;
  background-color: rgba(0, 0, 0, 0.22);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.38);
  border-radius: 16px;
}

.yn-login__title {
  color: #fff;
  margin: 0 0 36px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 2px;
}

.yn-login__form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.yn-login__box {
  position: relative;
  width: 100%;
}

.yn-login__box input {
  outline: none;
  border: none;
  width: 100%;
  padding: 16px 0;
  margin-bottom: 36px;
  color: #fff;
  font-size: 18px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.82);
  background-color: transparent;
}

.yn-login__box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 16px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  pointer-events: none;
  transition: all 0.35s ease;
}

.yn-login__box input:focus + label,
.yn-login__box input:valid + label {
  top: -22px;
  color: var(--yn-login-accent, #03e9f4);
  font-size: 14px;
}

.yn-login__btn {
  --yn-login-accent: #03e9f4;
  position: relative;
  display: inline-block;
  margin-top: 12px;
  min-width: 200px;
  padding: 16px 40px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: var(--yn-login-accent);
  background: transparent;
  transition: color 0.35s ease, background-color 0.35s ease, box-shadow 0.35s ease;
  overflow: hidden;
  border-radius: 4px;
}

.yn-login__btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.yn-login__btn-text {
  position: relative;
  z-index: 1;
}

.yn-login__btn:not(:disabled):hover {
  color: #fff;
  border-radius: 6px;
  background-color: var(--yn-login-accent);
  box-shadow:
    0 0 5px var(--yn-login-accent),
    0 0 25px var(--yn-login-accent),
    0 0 50px var(--yn-login-accent),
    0 0 100px var(--yn-login-accent);
}

.yn-login__btn-edge {
  position: absolute;
  pointer-events: none;
}

.yn-login__btn-edge--1 {
  top: 0;
  left: -100%;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, transparent, var(--yn-login-accent));
  animation: yn-login-move1 1s linear infinite;
}

.yn-login__btn-edge--2 {
  right: 0;
  top: -100%;
  width: 3px;
  height: 100%;
  background: linear-gradient(transparent, var(--yn-login-accent));
  animation: yn-login-move2 1s linear 0.25s infinite;
}

.yn-login__btn-edge--3 {
  right: -100%;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to left, transparent, var(--yn-login-accent));
  animation: yn-login-move3 1s linear 0.5s infinite;
}

.yn-login__btn-edge--4 {
  left: 0;
  bottom: -100%;
  width: 3px;
  height: 100%;
  background: linear-gradient(var(--yn-login-accent), transparent);
  animation: yn-login-move4 1s linear 0.75s infinite;
}

@keyframes yn-login-move1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

@keyframes yn-login-move2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

@keyframes yn-login-move3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

@keyframes yn-login-move4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}

@media (max-width: 480px) {
  .yn-login {
    padding: 36px 24px 40px;
  }

  .yn-login__title {
    font-size: 24px;
    margin-bottom: 28px;
  }

  .yn-login__box input,
  .yn-login__box label {
    font-size: 16px;
    padding: 14px 0;
  }

  .yn-login__btn {
    min-width: 100%;
    padding: 14px 24px;
    font-size: 17px;
  }
}
</style>
