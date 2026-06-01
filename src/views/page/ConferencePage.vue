<template>
  <div class="page-wrap">
    <div class="container">
      <!-- 面包屑导航 -->
      <Breadcrumbs
        groupTitle="会议系统"
        :items="[]"
      />


      <!-- 页面标题 -->
      <h1 class="page-title">会议系统</h1>

      <!-- 标签页和搜索区 -->
      <div class="header-section">
        <el-tabs v-model="activeTab" class="tab-section">
          <el-tab-pane label="注册开放" name="open"></el-tab-pane>
          <el-tab-pane label="活动预热" name="preview"></el-tab-pane>
          <el-tab-pane label="往期回顾" name="past"></el-tab-pane>
          <el-tab-pane label="全部" name="all"></el-tab-pane>
        </el-tabs>

        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入活动关键词"
            class="search-input"
            prefix-icon="el-icon-search"
          />
          <el-button type="primary" class="search-btn">搜索</el-button>
          <el-button class="login-btn">用户登录</el-button>
        </div>
      </div>

      <!-- 会议列表 -->
      <div class="conference-list">
        <el-card v-for="conference in conferenceList" :key="conference.id" class="conference-card">
          <template #header>
            <div class="card-header">
              <el-tag type="success" size="small" class="status-tag">注册开放</el-tag>
              <h3 class="conference-title">{{ conference.title }}</h3>
            </div>
          </template>
          <div class="conference-info">
            <div class="conference-meta">
              <el-icon class="meta-icon"><Calendar /></el-icon>
              <span>{{ conference.date }}</span>
              <el-icon class="meta-icon"><Location /></el-icon>
              <span>{{ conference.location }}</span>
            </div>
            <el-button type="primary" size="small" class="detail-btn" @click="viewDetail(conference.id)">详情</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, Location } from '@element-plus/icons-vue';
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';

const router = useRouter();

// 标签页状态
const activeTab = ref('open');
// 搜索关键词
const searchKeyword = ref('');

// 会议数据
const conferenceList = [
  {
    id: '1',
    title: '第五届CAAI人工智能与技术伦理线上培训班',
    date: '2026年03月01日-06月30日',
    location: '线上',
    status: 'open'
  },
  {
    id: '2',
    title: '第三届中国具身智能大会（CEAI 2026）',
    date: '2026年04月10-12日',
    location: '安徽省合肥市',
    status: 'open'
  },
  {
    id: '3',
    title: '第六届中国人工智能学会社会计算与社会智能交叉学科战略研讨会',
    date: '2026年04月16-18日',
    location: '广东省广州市',
    status: 'open'
  },
  {
    id: '4',
    title: '中国人工智能学会2026年离散智能计算教育研讨会',
    date: '2026年04月17-19日',
    location: '广东省东莞市',
    status: 'open'
  },
  {
    id: '5',
    title: '2026 The International Conference on Mesoscale Biology',
    date: '2026年04月19-21日',
    location: '英国',
    status: 'open'
  },
  {
    id: '6',
    title: '2026认知系统与信息处理专委会年会',
    date: '2026年04月24-26日',
    location: '福建省福州市',
    status: 'open'
  }
];

// 查看详情
const viewDetail = (id: string) => {
  router.push(`/conference/detail/${id}`);
};
</script>

<style scoped>
.page-wrap {
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  margin-bottom: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
  color: #333;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.tab-section {
  flex: 1;
  min-width: 300px;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: 240px;
}

.search-btn {
  background-color: #409EFF;
  border-color: #409EFF;
}

.login-btn {
  border-color: #409EFF;
  color: #409EFF;
}

.conference-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.conference-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s;
}

.conference-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-tag {
  background-color: #67C23A;
  border-color: #67C23A;
}

.conference-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.conference-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.conference-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.meta-icon {
  margin-right: 4px;
  color: #999;
}

.detail-btn {
  background-color: #409EFF;
  border-color: #409EFF;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .tab-section {
    width: 100%;
  }

  .search-section {
    justify-content: center;
  }

  .conference-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .detail-btn {
    align-self: flex-end;
  }
}
</style>
