<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="top"
    class="company-apply-form"
    @submit.prevent
  >
    <p class="form-intro">
      请如实填写以下信息并提交单位会员申请，带 * 号为必填项。
    </p>

    <!-- 单位基本信息 -->
    <section class="form-section">
      <h4 class="section-title">单位基本信息</h4>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="所属委员会" prop="committeeId">
            <el-select v-model="form.committeeId" placeholder="请选择委员会" style="width: 100%" :loading="committeesLoading">
              <el-option
                v-for="committee in committees"
                :key="committee.id"
                :label="committee.name"
                :value="committee.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="单位名称" prop="unitName">
            <el-input v-model="form.unitName" placeholder="请输入单位全称" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="单位类别" prop="unitCategory">
            <el-input v-model="form.unitCategory" placeholder="如：企业、事业单位、社会团体等" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="所属行业" prop="industry">
            <el-input v-model="form.industry" placeholder="请输入所属行业" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode">
            <el-input v-model="form.unifiedSocialCreditCode" placeholder="请输入18位信用代码" maxlength="18" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="法定代表人" prop="legalRepresentative">
            <el-input v-model="form.legalRepresentative" placeholder="请输入法定代表人姓名" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="成立时间">
            <el-date-picker
              v-model="form.establishedDate"
              type="date"
              placeholder="请选择成立日期"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="注册资本（万元）">
            <el-input-number
              v-model="form.registeredCapital"
              :min="0"
              :precision="2"
              placeholder="请输入注册资本"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="融资轮次">
            <el-input v-model="form.financingRound" placeholder="如：天使轮、A轮等" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="通讯地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入详细通讯地址" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="邮政编码">
            <el-input v-model="form.postalCode" placeholder="请输入邮政编码" maxlength="6" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="行政地区代码" prop="areaCode">
            <el-input v-model="form.areaCode" placeholder="6位行政区划代码" maxlength="6" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="单位网站">
            <el-input v-model="form.website" placeholder="请输入单位官网地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="业务范围">
            <el-input
              v-model="form.businessScope"
              type="textarea"
              :rows="3"
              placeholder="请输入业务范围（最多200字）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="单位简介">
            <el-input
              v-model="form.unitIntro"
              type="textarea"
              :rows="4"
              placeholder="请输入单位简介"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="人工智能相关产业介绍">
            <el-input
              v-model="form.aiIndustryIntro"
              type="textarea"
              :rows="4"
              placeholder="请介绍与人工智能相关的产业情况"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <!-- 单位负责人信息 -->
    <section class="form-section">
      <h4 class="section-title">单位负责人信息</h4>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="负责人姓名" prop="leaderName">
            <el-input v-model="form.leaderName" placeholder="请输入负责人姓名" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="负责人职务" prop="leaderTitle">
            <el-input v-model="form.leaderTitle" placeholder="请输入负责人职务" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="负责人手机号" prop="leaderPhone">
            <el-input v-model="form.leaderPhone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="负责人邮箱" prop="leaderEmail">
            <el-input v-model="form.leaderEmail" placeholder="请输入电子邮箱" />
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <!-- 联系人信息 -->
    <section class="form-section">
      <h4 class="section-title">联系人信息</h4>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="联系人姓名" prop="contactName">
            <el-input v-model="form.contactName" placeholder="请输入联系人姓名" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="所在部门">
            <el-input v-model="form.contactDept" placeholder="请输入所在部门" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="联系人手机" prop="contactMobile">
            <el-input v-model="form.contactMobile" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="办公电话">
            <el-input v-model="form.contactOfficePhone" placeholder="请输入办公电话" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="联系人邮箱" prop="contactEmail">
            <el-input v-model="form.contactEmail" placeholder="请输入电子邮箱" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="联系人性别">
            <el-select v-model="form.contactGender" placeholder="请选择" style="width: 100%">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
              <el-option label="未知" value="未知" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="联系人职务">
            <el-input v-model="form.contactTitle" placeholder="请输入职务" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="联系人职称">
            <el-input v-model="form.contactJobTitle" placeholder="请输入职称" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="传真">
            <el-input v-model="form.contactFax" placeholder="请输入传真号码" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="职工总人数">
            <el-input-number
              v-model="form.totalEmployees"
              :min="0"
              placeholder="请输入职工人数"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <!-- 附件上传 -->
    <section class="form-section">
      <h4 class="section-title">附件材料</h4>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="营业执照" prop="businessLicenseUrl">
            <el-input v-model="form.businessLicenseUrl" placeholder="请输入营业执照图片URL或上传文件" />
            <div class="upload-tip">提示：请上传清晰的营业执照扫描件或照片</div>
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <!-- 其他信息 -->
    <section class="form-section">
      <h4 class="section-title">其他信息</h4>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="推荐人">
            <el-input v-model="form.recommender" placeholder="可选，如有推荐人请填写" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="加入其他科技社团情况">
            <el-input
              v-model="form.otherSocieties"
              type="textarea"
              :rows="3"
              placeholder="请说明已加入的其他科技社团"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="对学会发展意见建议">
            <el-input
              v-model="form.suggestions"
              type="textarea"
              :rows="3"
              placeholder="欢迎提出宝贵意见"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <div class="form-actions">
      <el-button type="primary" :loading="submitting" @click="handleSubmit">提交申请</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { submitCompanyMemberApplication, getCommitteeList } from '@/api/member'
import type { CommitteeVO } from '@/types/member'
import {
  createEmptyCompanyMemberApplyForm,
  formToCompanyMemberApplyRequest,
  type CompanyMemberApplyFormModel
} from '@/utils/companyMemberApplyForm'

const props = defineProps<{}>()

const emit = defineEmits<{ success: [] }>()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const committeesLoading = ref(false)
const committees = ref<CommitteeVO[]>([])
const form = reactive<CompanyMemberApplyFormModel>(createEmptyCompanyMemberApplyForm())

// 验证规则
const validatePhone = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value?.trim()) {
    callback(new Error('请输入手机号码'))
    return
  }
  if (!/^1[3-9]\d{9}$/.test(value.trim())) {
    callback(new Error('请输入正确的手机号码'))
    return
  }
  callback()
}

const validateEmail = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value?.trim()) {
    callback(new Error('请输入邮箱'))
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    callback(new Error('请输入正确的邮箱格式'))
    return
  }
  callback()
}

const validateAreaCode = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value?.trim()) {
    callback(new Error('请输入行政地区代码'))
    return
  }
  if (!/^\d{6}$/.test(value.trim())) {
    callback(new Error('行政地区代码必须为6位数字'))
    return
  }
  callback()
}

const validateCreditCode = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value?.trim()) {
    callback(new Error('请输入统一社会信用代码'))
    return
  }
  if (!/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(value.trim())) {
    callback(new Error('请输入正确的18位统一社会信用代码'))
    return
  }
  callback()
}

const rules: FormRules = {
  committeeId: [{ required: true, message: '请选择委员会', trigger: 'change' }],
  unitName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
  unifiedSocialCreditCode: [{ validator: validateCreditCode, trigger: 'blur' }],
  legalRepresentative: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
  address: [{ required: true, message: '请输入通讯地址', trigger: 'blur' }],
  areaCode: [{ validator: validateAreaCode, trigger: 'blur' }],
  leaderName: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  leaderPhone: [{ validator: validatePhone, trigger: 'blur' }],
  leaderEmail: [{ validator: validateEmail, trigger: 'blur' }],
  contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  contactMobile: [{ validator: validatePhone, trigger: 'blur' }],
  contactEmail: [{ validator: validateEmail, trigger: 'blur' }],
  businessLicenseUrl: [{ required: true, message: '请上传营业执照', trigger: 'blur' }]
}

async function handleSubmit() {
  if (submitting.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const res = await submitCompanyMemberApplication(formToCompanyMemberApplyRequest(form))
    if (res.success) {
      ElMessage.success(res.message === 'SUCCESS' ? '申请已提交' : res.message)
      emit('success')
    }
  } catch {
    // 拦截器已提示
  } finally {
    submitting.value = false
  }
}

// 加载委员会列表
async function loadCommittees() {
  committeesLoading.value = true
  try {
    const res = await getCommitteeList()
    if (res.success && res.data) {
      committees.value = res.data
      // 优先从 sessionStorage 读取委员会 ID
      const storedCommitteeId = sessionStorage.getItem('committeeId')
      if (storedCommitteeId) {
        const committeeId = Number(storedCommitteeId)
        // 验证该委员会是否在列表中
        const exists = committees.value.some(c => c.id === committeeId)
        if (exists) {
          form.committeeId = committeeId
        } else if (!form.committeeId && committees.value.length > 0) {
          // 如果不存在或没有预设值，选择第一个
          form.committeeId = committees.value[0].id
        }
      } else if (!form.committeeId && committees.value.length > 0) {
        // 如果没有存储的 ID，默认选中第一个委员会
        form.committeeId = committees.value[0].id
      }
    }
  } catch (error) {
    console.error('加载委员会列表失败:', error)
  } finally {
    committeesLoading.value = false
  }
}

onMounted(() => {
  loadCommittees()
})
</script>

<style scoped>
.company-apply-form {
  max-width: 960px;
}

.form-intro {
  margin: 0 0 20px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.form-section {
  margin-bottom: 28px;
}

.section-title {
  margin: 0 0 16px;
  padding-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.form-actions {
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
</style>
