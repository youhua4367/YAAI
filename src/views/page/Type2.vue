<template>
  <article class="article-page">
    <figure v-if="article.coverImage" class="article-page__cover">
      <img :src="article.coverImage" :alt="article.title" loading="lazy" />
    </figure>

    <div class="article-page__inner">
      <header class="article-page__head">
        <h1 class="article-page__title">{{ article.title }}</h1>
        
        <p v-if="article.summary" class="article-page__summary">
          <span class="summary-tag">摘要</span>
          {{ article.summary }}
        </p>

        <div class="article-page__meta">
          <div class="meta-item">
            <span class="meta-label">作者</span>
            <span class="meta-val author-badge">{{ article.author }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">发布于</span>
            <span class="meta-val">{{ article.publishTime }}</span>
          </div>
        </div>
      </header>

      <div class="article-page__divider"></div>

      <div class="article-page__body rich-text" v-html="article.content"></div>
    </div>
  </article>
</template>

<script setup lang="ts">
const article = {
  title: '云南省人工智能学会简介',
  summary:
    '云南省人工智能学会是云南省从事人工智能相关研究、开发、应用与推广的科技工作者自愿组成的学术性、非营利性社会组织。',
  author: '云南省人工智能学会秘书处',
  publishTime: '2026-01-15 10:00',
  coverImage:
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=514&fit=crop',
  content: `
    <p>云南省人工智能学会（Yunnan Association for Artificial Intelligence，简称 YNAI）成立于人工智能产业蓬勃发展的关键时期，旨在团结全省 AI 领域专家学者与产业力量，推动学术繁荣、技术突破与成果转化。</p>

    <h2>学会宗旨</h2>
    <p>坚持面向世界科技前沿、面向经济主战场、面向国家重大需求、面向人民生命健康，搭建政产学研用协同平台，服务会员成长，促进云南省人工智能事业高质量发展。</p>

    <h2>主要职能</h2>
    <ul>
      <li>组织开展学术研讨、技术交流与科普活动；</li>
      <li>开展人工智能领域科技咨询、评估与培训；</li>
      <li>推动科研成果转化与产业应用示范；</li>
      <li>反映会员诉求，维护会员合法权益；</li>
      <li>承接政府委托，参与行业标准与政策研究。</li>
    </ul>

    <h2>发展愿景</h2>
    <p>立足云南、面向全国，将学会建设成为在西南地区具有重要影响力的人工智能学术高地与技术服务枢纽，为云南打造面向南亚东南亚的人工智能开放合作窗口提供有力支撑。</p>

    <p class="highlight-text">欢迎全省高校、科研院所、企事业单位及各界人士关注并加入云南省人工智能学会，携手共建智能云南。</p>
  `
}
</script>

<style scoped>
/* 核心设计系统：注入符合现代科技/学术风的色调 */
.article-page {
  --primary: #0a56c6;
  --primary-light: rgba(10, 86, 198, 0.05);
  --primary-gradient: linear-gradient(135deg, #0a56c6 0%, #2575fc 100%);
  --text-main: #0f172a;
  --text-body: #334155;
  --text-muted: #64748b;
  --radius-lg: 16px;
  --radius-md: 8px;
  
  max-width: 820px;
  margin: 0 auto;
  padding: 24px 20px 60px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 封面图：增加科技感的微弱投影与悬停平滑缩放 */
.article-page__cover {
  margin: 0 0 36px;
  width: 100%;
  aspect-ratio: 21 / 9;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: #f1f5f9;
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08);
}

.article-page__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.article-page__cover:hover img {
  transform: scale(1.02);
}

/* 标题排版：调整字重与行高，更具呼吸感 */
.article-page__title {
  margin: 0 0 24px;
  font-size: clamp(26px, 4.5vw, 36px);
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.35;
  letter-spacing: -0.01em;
}

/* 摘要：重新设计成一个高质感的精致卡片 */
.article-page__summary {
  position: relative;
  margin: 0 0 28px;
  padding: 20px 24px;
  font-size: 15.5px;
  line-height: 1.7;
  color: #475569;
  background: linear-gradient(to right, var(--primary-light), rgba(248, 250, 252, 0.5));
  border-radius: var(--radius-md);
  border-left: 4px solid var(--primary);
}

.summary-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary);
  background: rgba(10, 86, 198, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* Meta 元信息：去掉了枯燥的小圆点，采用扁平化组合，作者加了显眼的轻胶囊背景 */
.article-page__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.meta-label {
  color: var(--text-muted);
  margin-right: 8px;
}

.meta-val {
  color: var(--text-main);
  font-weight: 500;
}

.author-badge {
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--primary);
}

/* 分割线：改为更加精致的渐变细线 */
.article-page__divider {
  height: 1px;
  background: linear-gradient(to right, var(--primary), rgba(241, 245, 249, 0.8) 40%, rgba(241, 245, 249, 0));
  margin: 36px 0;
  opacity: 0.6;
}

/* 正文排版：重点优化可读性 */
.article-page__body {
  font-size: 16.5px;
  line-height: 1.9;
  color: var(--text-body);
}

.article-page__body :deep(p) {
  margin: 0 0 1.5em;
  text-align: justify;
}

/* H2 标题：升级左侧装饰条为渐变样式，增加下边框，让内容区块划分更明显 */
.article-page__body :deep(h2) {
  margin: 2em 0 1em;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.article-page__body :deep(h2::before) {
  content: '';
  width: 4px;
  height: 18px;
  background: var(--primary-gradient);
  margin-right: 12px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* 列表样式：改用符合科技感的现代小圆点 */
.article-page__body :deep(ul) {
  margin: 0 0 1.5em;
  padding-left: 1.25em;
  list-style: none; /* 去除默认圆点 */
}

.article-page__body :deep(li) {
  position: relative;
  margin-bottom: 0.75em;
  padding-left: 1.25em;
}

.article-page__body :deep(li::before) {
  content: "";
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.7;
}

/* 结尾强调文本（通过富文本注入的 class 样式支撑） */
.article-page__body :deep(.highlight-text) {
  margin-top: 2.5em;
  padding: 20px;
  background: #f8fafc;
  border-radius: var(--radius-md);
  border: 1px dashed #cbd5e1;
  text-align: center;
  font-weight: 500;
  color: var(--text-main);
}

/* 移动端响应式优化 */
@media (max-width: 768px) {
  .article-page {
    padding: 16px 16px 40px;
  }
  
  .article-page__cover {
    margin-bottom: 24px;
    border-radius: var(--radius-md);
  }
  
  .article-page__meta {
    flex-direction: row; /* 保持横向平铺，避免垂直堆叠拉长页面 */
    gap: 16px;
  }
  
  .article-page__divider {
    margin: 24px 0;
  }
}
</style>