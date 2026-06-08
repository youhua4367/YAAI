<template>
  <AuthPageLayout>
    <!-- 第一步：注册账号 -->
    <template v-if="!registered">
      <h2 class="auth-card__title">会员注册</h2>
      <MemberRegisterForm @success="handleRegisterSuccess" />
    </template>
    
    <!-- 第二步：选择会员类型和委员会 -->
    <template v-else-if="!memberTypeSelected">
      <h2 class="auth-card__title">选择会员类型和委员会</h2>
      <div class="member-type-selector">
        <p class="selector-title">请选择您要申请的会员类型</p>
        <div class="type-cards">
          <div 
            class="type-card" 
            :class="{ selected: selectedType === 'personal' }"
            @click="selectedType = 'personal'"
          >
            <div class="card-icon">👤</div>
            <h3 class="card-title">个人会员</h3>
            <p class="card-desc">适用于个人申请加入学会</p>
            <p class="card-fee">年费：200元</p>
          </div>
          <div 
            class="type-card" 
            :class="{ selected: selectedType === 'company' }"
            @click="selectedType = 'company'"
          >
            <div class="card-icon">🏢</div>
            <h3 class="card-title">单位会员</h3>
            <p class="card-desc">适用于企业、机构等单位申请</p>
            <p class="card-fee">年费：20000元</p>
          </div>
        </div>
        
        <!-- 委员会选择 -->
        <div class="committee-selection">
          <p class="selector-title">请选择所属委员会</p>
          <el-select 
            v-model="selectedCommitteeId" 
            placeholder="请选择委员会" 
            style="width: 100%" 
            :loading="committeesLoading"
          >
            <el-option
              v-for="committee in committees"
              :key="committee.id"
              :label="committee.name"
              :value="committee.id"
            />
          </el-select>
        </div>
        
        <button 
          class="confirm-type-btn" 
          :disabled="!selectedType || !selectedCommitteeId"
          @click="confirmMemberType"
        >
          确认并继续
        </button>
      </div>
    </template>
    
    <!-- 第三步：注册成功提示 -->
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

    <template v-if="!memberTypeSelected && !registered" #footer>
      <router-link to="/login">已有账号，去登录</router-link>
      <span class="dot">·</span>
      <router-link to="/">返回首页</router-link>
    </template>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthPageLayout from '@/components/auth/AuthPageLayout.vue'
import MemberRegisterForm from '@/components/auth/MemberRegisterForm.vue'
import { APPLY_SUCCESS_CONFIG } from '@/config/apply'
import type { MemberType, CommitteeVO } from '@/types/member'
import { getCommitteeList } from '@/api/member'

const router = useRouter()
const success = APPLY_SUCCESS_CONFIG
const registered = ref(false)
const memberTypeSelected = ref(false)
const selectedType = ref<MemberType>('personal') // 默认个人会员
const selectedCommitteeId = ref<number | null>(null)
const committeesLoading = ref(false)
const committees = ref<CommitteeVO[]>([])

// 注册成功后的回调
function handleRegisterSuccess() {
  registered.value = true
}

// 加载委员会列表
async function loadCommittees() {
  committeesLoading.value = true
  try {
    const res = await getCommitteeList()
    if (res.success && res.data) {
      committees.value = res.data
    }
  } catch (error) {
    console.error('加载委员会列表失败:', error)
    ElMessage.error('加载委员会列表失败')
  } finally {
    committeesLoading.value = false
  }
}

// 确认会员类型并跳转
function confirmMemberType() {
  console.log('selectedType:', selectedType.value)
  console.log('selectedCommitteeId:', selectedCommitteeId.value)
  if (selectedType.value && selectedCommitteeId.value) {
    // 将选中的信息存储到 sessionStorage
    sessionStorage.setItem('memberType', selectedType.value)
    sessionStorage.setItem('committeeId', String(selectedCommitteeId.value))
    
    memberTypeSelected.value = true
    
    // 根据选择的类型跳转到对应的信息填写页面
    const targetPath = selectedType.value === 'personal' 
      ? '/apply/profile/personal' 
      : '/apply/profile/company'
    
    router.push(targetPath)
  } else {
    ElMessage.warning('请选择会员类型和委员会')
  }
}

onMounted(() => {
  loadCommittees()
})
</script>

<style scoped>
.member-type-selector {
  padding: 20px 0;
}

.selector-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

.type-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.type-card {
  padding: 24px;
  border: 2px solid #e8eef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
  text-align: center;
}

.type-card:hover {
  border-color: #0c4da2;
  box-shadow: 0 4px 12px rgba(12, 77, 162, 0.1);
}

.type-card.selected {
  border-color: #0c4da2;
  background: #f0f5ff;
  box-shadow: 0 4px 12px rgba(12, 77, 162, 0.15);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.card-fee {
  font-size: 16px;
  color: #0c4da2;
  font-weight: 600;
  margin: 0;
}

.confirm-type-btn {
  width: 100%;
  padding: 14px;
  background: #0c4da2;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-type-btn:hover:not(:disabled) {
  background: #0a3d82;
}

.confirm-type-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.committee-selection {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .type-cards {
    grid-template-columns: 1fr;
  }
}
</style>
