<template>
  <div class="local-associations">
    <h2 class="page-title">{{ title }}</h2>
    <div class="associations-container">
      <div class="association-column">
        <h3 class="column-title">{{ column1Title }}</h3>
        <ul class="association-list">
          <li v-for="(association, index) in column1Data" :key="index">
            {{ association }}
          </li>
        </ul>
      </div>
      <div class="association-column">
        <h3 class="column-title">{{ column2Title }}</h3>
        <ul class="association-list">
          <li v-for="(association, index) in column2Data" :key="index">
            {{ association }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '地方学会'
  },
  column1Title: {
    type: String,
    default: '省、自治区、直辖市学会'
  },
  column2Title: {
    type: String,
    default: '省会、计划单列市学会'
  },
  column1Data: {
    type: Array as () => string[],
    required: true
  },
  column2Data: {
    type: Array as () => string[],
    required: true
  }
});
</script>

<style scoped>
.local-associations {
  line-height: 1.6;
  color: #333;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #17345f;
  margin: 0 0 32px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.associations-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.association-column {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.column-title {
  font-size: 18px;
  font-weight: 500;
  color: #17345f;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.association-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.association-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.association-list li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .associations-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .page-title {
    font-size: 20px;
    margin-bottom: 24px;
  }
  
  .association-column {
    padding: 16px;
  }
  
  .column-title {
    font-size: 16px;
  }
}
</style>
