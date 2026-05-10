<template>
  <div class="register-layout">
    <div class="register-form-section">
      <el-form ref="formRef" :model="localModel" :rules="rules" label-position="top" status-icon>
        <el-form-item v-for="field in fields" :key="field.key" :label="field.label" :prop="field.key" required>
          <el-input
            v-model="localModel[field.key]"
            :type="field.inputType"
            :placeholder="field.placeholder"
            :maxlength="field.maxlength"
            :show-password="field.inputType === 'password'"
          >
            <template v-if="field.key === 'code'" #append>
              <el-button
                type="primary"
                size="small"
                :disabled="!canSendCode || isSendingCode"
                @click="handleSendCode"
              >
                {{ sendCodeText }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="acceptAgreement">
          <el-checkbox v-model="localModel.acceptAgreement">
            {{ config.agreementPrefix }}
            <router-link :to="config.agreementPath" target="_blank" class="link">{{ config.agreementText }}</router-link>
          </el-checkbox>
        </el-form-item>
      </el-form>

      <div class="step-actions">
        <button class="btn btn-default" @click="$emit('prev')">{{ config.prevText }}</button>
        <button class="btn btn-primary" :disabled="isSubmitting" @click="handleSubmit">
          {{ isSubmitting ? config.submittingText : config.submitText }}
        </button>
      </div>
    </div>

    <div class="register-sidebar">
      <div class="sidebar-section">
        <h4>{{ config.policyTitle }}</h4>
        <router-link v-for="item in config.policyLinks" :key="item.to" :to="item.to">{{ item.text }}</router-link>
      </div>
      <div class="sidebar-section">
        <h4>{{ config.contactTitle }}</h4>
        <p v-for="line in config.contacts" :key="line">{{ line }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { APPLY_ACCOUNT_CONFIG } from '@/config/apply'
import { sendCode } from '@/api/common'
import type { ApplyAccountFormModel } from '@/types/apply'

const authStore = useAuthStore()

const emit = defineEmits<{
  prev: []
  success: []
}>()

const formRef = ref<FormInstance>()
const config = APPLY_ACCOUNT_CONFIG
const fields = config.fields.map((field) => ({
  ...field,
  inputType: ('type' in field ? field.type : undefined) ?? 'text',
  maxlength: 'maxlength' in field ? field.maxlength : undefined
}))

const localModel = reactive<ApplyAccountFormModel>({
  username: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
  acceptAgreement: false
})

const isSubmitting = ref(false)

const canSendCode = computed(() => {
  return countdown.value === 0 && localModel.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localModel.email)
})

const sendCodeText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}s` : '获取验证码'
})

const countdown = ref(0)
const isSendingCode = ref(false)

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSendCode = async () => {
  const valid = await formRef.value?.validateField('email').catch(() => false)
  if (!valid) {
    return
  }

  isSendingCode.value = true
  try {
    await sendCode(localModel.email)
    ElMessage.success('验证码已发送到您的邮箱')
    startCountdown()
  } catch (error) {
    ElMessage.error('发送验证码失败，请重试')
  } finally {
    isSendingCode.value = false
  }
}

const validatePassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error(config.validation.passwordRequired))
    return
  }
  if (value.length < 8 || value.length > 32 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    callback(new Error(config.validation.passwordRule))
    return
  }
  callback()
}

const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value !== localModel.password) {
    callback(new Error(config.validation.passwordMismatch))
    return
  }
  callback()
}

const validateAgreement = (_rule: unknown, value: boolean, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error(config.validation.agreementRequired))
    return
  }
  callback()
}

const rules: FormRules<ApplyAccountFormModel> = {
  username: [
    { required: true, message: config.validation.usernameRequired, trigger: 'blur' },
    { min: 4, max: 20, message: config.validation.usernameLength, trigger: 'blur' },
    { pattern: /^[A-Za-z0-9_]+$/, message: config.validation.usernamePattern, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: config.validation.phoneRequired, trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: config.validation.phonePattern, trigger: 'blur' }
  ],
  email: [
    { required: true, message: config.validation.emailRequired, trigger: 'blur' },
    { type: 'email', message: config.validation.emailPattern, trigger: 'blur' }
  ],
  code: [{ required: true, message: config.validation.codeRequired, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: config.validation.confirmPasswordRequired, trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  acceptAgreement: [{ validator: validateAgreement, trigger: 'change' }]
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  isSubmitting.value = true
  try {
    await authStore.doRegister(localModel)
    ElMessage.success('注册成功，请继续完善会员资料')
    emit('success')
  } catch (error) {
    ElMessage.error('注册失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.register-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 60px;
}

.register-form-section {
  padding-right: 40px;
  border-right: 1px solid #e8e8e8;
}

.link {
  color: #0c4da2;
  text-decoration: none;
  margin-left: 4px;
}

.register-sidebar {
  padding-top: 8px;
}

.sidebar-section {
  margin-bottom: 32px;
}

.sidebar-section h4 {
  font-size: 14px;
  color: #0c4da2;
  margin-bottom: 12px;
  font-weight: 500;
}

.sidebar-section a {
  display: block;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;
}

.sidebar-section p {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.6;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.btn {
  padding: 12px 32px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #0c4da2;
  color: #fff;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-default {
  background: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
}

@media (max-width: 1024px) {
  .register-layout {
    grid-template-columns: 1fr;
  }

  .register-form-section {
    border-right: none;
    padding-right: 0;
  }

  .register-sidebar {
    display: none;
  }
}
</style>
