<template>
  <div class="change-password-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      class="password-form"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="formData.oldPassword"
          type="password"
          placeholder="请输入原密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="formData.newPassword"
          type="password"
          placeholder="8-32位，必须包含字母和数字"
          show-password
        />
        <div class="password-hint">
          密码要求：8-32位，必须包含字母和数字
        </div>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="submitting"
        >
          确认修改
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { changePassword, type ChangePasswordParams } from '@/api/user'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive<ChangePasswordParams>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== formData.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
      message: '密码必须为8-32位，且必须包含字母和数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await changePassword(formData)
        emit('success')
      } catch (error: any) {
        ElMessage.error(error.message || '密码修改失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>

<style scoped>
.change-password-form {
  padding: 20px;
}

.password-form {
  margin-top: 10px;
}

.password-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
