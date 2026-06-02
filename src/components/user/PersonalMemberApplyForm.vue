<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="top"
    class="personal-apply-form"
    @submit.prevent
  >
    <p class="form-intro">
      请如实填写以下信息并提交个人会员申请，带 * 号为必填项。
    </p>

    <section class="form-section">
      <h4 class="section-title">基本信息</h4>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择" style="width: 100%">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="证件类型" prop="idCardType">
            <el-select v-model="form.idCardType" placeholder="请选择" style="width: 100%">
              <el-option label="身份证" value="身份证" />
              <el-option label="护照" value="护照" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="证件号码" prop="idCardNumber">
            <el-input v-model="form.idCardNumber" placeholder="请输入证件号码" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="出生日期" prop="birthDate">
            <el-date-picker
              v-model="form.birthDate"
              type="date"
              placeholder="请选择"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="国籍" prop="country">
            <el-input v-model="form.country" placeholder="请输入国籍" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="籍贯" prop="nativePlace">
            <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="民族" prop="nationality">
            <el-input v-model="form.nationality" placeholder="请输入民族" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="政治面貌" prop="politicalOutlook">
            <el-input v-model="form.politicalOutlook" placeholder="请输入政治面貌" />
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <section class="form-section">
      <h4 class="section-title">联系方式</h4>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="通讯地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入通讯地址" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="手机号码" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="固定电话" prop="landlinePhone">
            <el-input v-model="form.landlinePhone" placeholder="请输入固定电话" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="邮政编码" prop="postalCode">
            <el-input v-model="form.postalCode" placeholder="请输入邮政编码" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="行政地区代码" prop="areaCode">
            <el-input v-model="form.areaCode" placeholder="6 位行政区划代码" maxlength="6" />
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <section class="form-section">
      <h4 class="section-title">工作信息</h4>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          <el-form-item label="职称/身份" prop="jobTitle">
            <el-input v-model="form.jobTitle" placeholder="请输入职称或身份" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="所属行业" prop="industry">
            <el-input v-model="form.industry" placeholder="请输入所属行业" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="工作单位" prop="workUnit">
            <el-input v-model="form.workUnit" placeholder="请输入工作单位" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="工作部门" prop="workDepartment">
            <el-input v-model="form.workDepartment" placeholder="请输入工作部门" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="职务" prop="position">
            <el-input v-model="form.position" placeholder="请输入职务" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="最高学历" prop="highestEducation">
            <el-input v-model="form.highestEducation" placeholder="请输入最高学历" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="专业" prop="major">
            <el-input v-model="form.major" placeholder="请输入专业" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工作内容" prop="workContent">
            <el-input v-model="form.workContent" type="textarea" :rows="3" placeholder="请输入工作内容" />
          </el-form-item>
        </el-col>
      </el-row>
    </section>

    <section class="form-section">
      <div class="section-head">
        <h4 class="section-title">教育经历</h4>
        <el-button type="primary" link @click="addEducation">+ 添加</el-button>
      </div>
      <div
        v-for="(edu, index) in form.educationExperiences"
        :key="`edu-${index}`"
        class="repeat-block"
      >
        <div class="repeat-block__head">
          <span>教育经历 {{ index + 1 }}</span>
          <el-button
            v-if="form.educationExperiences.length > 1"
            type="danger"
            link
            @click="removeEducation(index)"
          >
            删除
          </el-button>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <el-form-item
              :label="`学历`"
              :prop="`educationExperiences.${index}.degree`"
              :rules="[{ required: true, message: '请输入学历', trigger: 'blur' }]"
            >
              <el-input v-model="edu.degree" placeholder="如：本科、硕士" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item
              :label="`学校`"
              :prop="`educationExperiences.${index}.school`"
              :rules="[{ required: true, message: '请输入学校', trigger: 'blur' }]"
            >
              <el-input v-model="edu.school" placeholder="请输入学校" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item
              :label="`专业`"
              :prop="`educationExperiences.${index}.major`"
              :rules="[{ required: true, message: '请输入专业', trigger: 'blur' }]"
            >
              <el-input v-model="edu.major" placeholder="请输入专业" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="edu.startDate"
                type="date"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="edu.endDate"
                type="date"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </section>

    <section class="form-section">
      <div class="section-head">
        <h4 class="section-title">工作经历</h4>
        <el-button type="primary" link @click="addWork">+ 添加</el-button>
      </div>
      <div
        v-for="(work, index) in form.workExperiences"
        :key="`work-${index}`"
        class="repeat-block"
      >
        <div class="repeat-block__head">
          <span>工作经历 {{ index + 1 }}</span>
          <el-button
            v-if="form.workExperiences.length > 1"
            type="danger"
            link
            @click="removeWork(index)"
          >
            删除
          </el-button>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item
              :label="`单位`"
              :prop="`workExperiences.${index}.company`"
              :rules="[{ required: true, message: '请输入单位', trigger: 'blur' }]"
            >
              <el-input v-model="work.company" placeholder="请输入单位名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item
              :label="`部门`"
              :prop="`workExperiences.${index}.department`"
              :rules="[{ required: true, message: '请输入部门', trigger: 'blur' }]"
            >
              <el-input v-model="work.department" placeholder="请输入部门" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item
              :label="`职务/职称`"
              :prop="`workExperiences.${index}.jobTitle`"
              :rules="[{ required: true, message: '请输入职务或职称', trigger: 'blur' }]"
            >
              <el-input v-model="work.jobTitle" placeholder="请输入职务或职称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item
              :label="`状态`"
              :prop="`workExperiences.${index}.status`"
              :rules="[{ required: true, message: '请选择状态', trigger: 'change' }]"
            >
              <el-select v-model="work.status" placeholder="请选择" style="width: 100%">
                <el-option label="在职" value="在职" />
                <el-option label="离职" value="离职" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="work.startDate"
                type="date"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="work.endDate"
                type="date"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作内容">
              <el-input v-model="work.workContent" type="textarea" :rows="2" placeholder="工作内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </section>

    <section class="form-section">
      <h4 class="section-title">学术与其他</h4>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="研究方向" prop="researchDirection">
            <el-input v-model="form.researchDirection" placeholder="请输入研究方向" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="论文著作" prop="publication">
            <el-input v-model="form.publication" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="荣誉奖励" prop="honors">
            <el-input v-model="form.honors" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目经历" prop="projectExperience">
            <el-input v-model="form.projectExperience" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="推荐人" prop="recommender">
            <el-input v-model="form.recommender" placeholder="可选" />
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
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { submitSingleMemberApplication } from '@/api/member'
import type { MemberSingleVO } from '@/types/userCenter'
import {
  createEmptyEducation,
  createEmptyPersonalMemberApplyForm,
  createEmptyWorkExperience,
  formToSingleMemberApplyRequest,
  memberSingleToApplyForm,
  type PersonalMemberApplyFormModel
} from '@/utils/singleMemberApplyForm'

const props = defineProps<{
  memberId: number
  initialData?: MemberSingleVO | null
  initialEducation?: Parameters<typeof memberSingleToApplyForm>[1]
  initialWork?: Parameters<typeof memberSingleToApplyForm>[2]
}>()

const emit = defineEmits<{ success: [] }>()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const form = reactive<PersonalMemberApplyFormModel>(createEmptyPersonalMemberApplyForm())

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

const validateAreaCode = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value?.trim()) {
    callback(new Error('请输入行政地区代码'))
    return
  }
  if (!/^\d{6}$/.test(value.trim())) {
    callback(new Error('行政地区代码必须为 6 位数字'))
    return
  }
  callback()
}

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  idCardType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  idCardNumber: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
  birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  country: [{ required: true, message: '请输入国籍', trigger: 'blur' }],
  nativePlace: [{ required: true, message: '请输入籍贯', trigger: 'blur' }],
  nationality: [{ required: true, message: '请输入民族', trigger: 'blur' }],
  politicalOutlook: [{ required: true, message: '请输入政治面貌', trigger: 'blur' }],
  address: [{ required: true, message: '请输入通讯地址', trigger: 'blur' }],
  contactPhone: [{ validator: validatePhone, trigger: 'blur' }],
  jobTitle: [{ required: true, message: '请输入职称/身份', trigger: 'blur' }],
  workUnit: [{ required: true, message: '请输入工作单位', trigger: 'blur' }],
  workDepartment: [{ required: true, message: '请输入工作部门', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
  highestEducation: [{ required: true, message: '请输入最高学历', trigger: 'blur' }],
  researchDirection: [{ required: true, message: '请输入研究方向', trigger: 'blur' }],
  areaCode: [{ validator: validateAreaCode, trigger: 'blur' }]
}

watch(
  () => [props.initialData, props.initialEducation, props.initialWork] as const,
  () => {
    Object.assign(
      form,
      memberSingleToApplyForm(props.initialData, props.initialEducation, props.initialWork)
    )
  },
  { immediate: true, deep: true }
)

function addEducation() {
  form.educationExperiences.push(createEmptyEducation())
}

function removeEducation(index: number) {
  form.educationExperiences.splice(index, 1)
}

function addWork() {
  form.workExperiences.push(createEmptyWorkExperience())
}

function removeWork(index: number) {
  form.workExperiences.splice(index, 1)
}

async function handleSubmit() {
  if (!props.memberId || submitting.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const res = await submitSingleMemberApplication(formToSingleMemberApplyRequest(form))
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
</script>

<style scoped>
.personal-apply-form {
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

.form-intro code {
  font-size: 12px;
  color: #475569;
}

.form-section {
  margin-bottom: 28px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  margin: 0 0 16px;
  padding-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
}

.section-head .section-title {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.repeat-block {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e8eef5;
  border-radius: 8px;
}

.repeat-block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.form-actions {
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
</style>
