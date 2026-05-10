<template>
  <div class="page-wrap">
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
    </div>

    <div class="container">
      <Breadcrumbs
        groupTitle="服务矩阵"
        :items="[]"
      />

      <div class="service-hero">
        <div class="service-banner">
          <div class="banner-content">
            <span class="banner-badge">Official Services</span>
            <h2>服务矩阵</h2>
            <p>云南人工智能学会为会员和社会提供全方位的专业支撑，构建“学术+技术+产业”的生态服务体系。</p>
            <div class="service-tags">
              <span>会员服务</span>
              <span>成果奖励</span>
              <span>学术基金</span>
              <span>出版物</span>
              <span>算力平台</span>
              <span>品牌项目</span>
            </div>
          </div>
          <div class="banner-deco"></div>
        </div>

        <div class="card service-highlight">
          <div class="card-header">
            <span class="header-decorator"></span>
            <h3>重点项目</h3>
          </div>
          <ul class="highlight-list">
            <li><i class="dot"></i> 会员注册与管理服务</li>
            <li><i class="dot"></i> 科技成果鉴定与奖励</li>
            <li><i class="dot"></i> 学术基金申请与管理</li>
            <li><i class="dot"></i> 学会出版物在线订阅</li>
            <li><i class="dot"></i> 智算资源申请与使用</li>
            <li><i class="dot"></i> 学会品牌活动参与</li>
          </ul>
        </div>
      </div>

      <div class="service-sections">
        <div class="service-block card" v-for="i in 1" :key="i">
           <div class="block-top">
             <div class="icon-box"><i class="icon-member"></i></div>
             <h3>会员服务</h3>
           </div>
           <p>为个人及单位会员提供注册、权益保障及资源对接，促进全省AI人才跨界交流。</p>
           <div class="service-links">
             <router-link to="/services">个人会员注册</router-link>
             <router-link to="/services">单位会员注册</router-link>
             <router-link to="/services">会籍查询</router-link>
             <router-link to="/services">单位会员名录</router-link>
           </div>
        </div>

        <div class="service-block card">
           <div class="block-top">
             <div class="icon-box"><i class="icon-award"></i></div>
             <h3>成果奖励</h3>
           </div>
           <p>组织权威科技成果鉴定，开展学会奖评选，激励行业创新并加速成果向新质生产力转化。</p>
           <div class="service-links">
             <router-link to="/services">成果鉴定服务</router-link>
             <router-link to="/services">学会奖提名</router-link>
             <router-link to="/services">激励计划提名</router-link>
           </div>
        </div>

        <div class="service-block card">
           <div class="block-top">
             <div class="icon-box"><i class="icon-fund"></i></div>
             <h3>学术基金</h3>
           </div>
           <p>联合行业头部企业设立专项科研基金，资助边缘智能、算力调度等前沿课题研究。</p>
           <div class="service-links">
             <router-link to="/services">昇腾科研基金</router-link>
             <router-link to="/services">边缘智能基金</router-link>
             <router-link to="/services">青年科研基金</router-link>
           </div>
        </div>

        <div class="service-block card">
           <div class="block-top">
             <div class="icon-box"><i class="icon-book"></i></div>
             <h3>学会出版物</h3>
           </div>
           <p>定期发布《学会通讯》、年度AI发展报告及行业白皮书，沉淀权威学术见解。</p>
           <div class="service-links">
             <router-link to="/article">学会通讯</router-link>
             <router-link to="/article">AI Research</router-link>
             <router-link to="/article">系列白皮书</router-link>
           </div>
        </div>

        <div class="service-block card">
           <div class="block-top">
             <div class="icon-box"><i class="icon-cpu"></i></div>
             <h3>算力平台</h3>
           </div>
           <p>依托省内智算中心，为高校和创业团队提供普惠算力支持及场景验证环境。</p>
           <div class="service-links">
             <router-link to="/services">高校算力支持</router-link>
             <router-link to="/services">场景验证平台</router-link>
             <router-link to="/services">数据服务专区</router-link>
           </div>
        </div>

        <div class="service-block card">
           <div class="block-top">
             <div class="icon-box"><i class="icon-star"></i></div>
             <h3>品牌项目</h3>
           </div>
           <p>打造云智讲堂、青年论坛等IP，开展高水平学术竞赛，普及AI前沿知识。</p>
           <div class="service-links">
             <router-link to="/services">云智讲堂</router-link>
             <router-link to="/services">青年论坛</router-link>
             <router-link to="/services">科普活动</router-link>
           </div>
        </div>
      </div>

      <div class="site-note-card">
        <i class="icon-info"></i>
        <p>如有各项服务相关的具体申请流程、资质要求等问题，请垂询学会秘书处：<span>0871-6312 8888</span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 延续基础变量 */
.page-wrap {
  --primary: #0c4da2;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --bg-subtle: #f8fafc;
  background-color: #f6f8fb;
  padding: 30px 0 80px;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* 背景装饰 */
.bg-decoration .blob {
  position: absolute; width: 400px; height: 400px;
  filter: blur(80px); opacity: 0.15; z-index: 0;
}
.blob-1 { background: var(--primary); top: -100px; right: -50px; }

/* Hero Section */
.service-hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  margin-bottom: 32px;
}

.service-banner {
  position: relative;
  background: linear-gradient(135deg, #0c4da2 0%, #1e3a8a 100%);
  border-radius: 20px;
  padding: 40px;
  color: white;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(12, 77, 162, 0.15);
}

.banner-content { position: relative; z-index: 2; }
.banner-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  font-size: 12px;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.service-banner h2 { font-size: 36px; font-weight: 800; margin-bottom: 16px; }
.service-banner p { font-size: 16px; line-height: 1.6; opacity: 0.9; max-width: 80%; margin-bottom: 24px; }

.service-tags span {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 13px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.banner-deco {
  position: absolute; right: -50px; bottom: -50px;
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
}

/* Highlight Card */
.service-highlight {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #eef2f6;
  box-shadow: 0 10px 25px rgba(0,0,0,0.02);
}

.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.header-decorator { width: 4px; height: 18px; background: var(--primary); border-radius: 2px; }
.service-highlight h3 { font-size: 20px; color: var(--text-main); margin: 0; }

.highlight-list { list-style: none; padding: 0; }
.highlight-list li {
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  color: var(--text-main);
  font-size: 15px;
  display: flex; align-items: center; gap: 10px;
}
.dot { width: 5px; height: 5px; background: var(--primary); border-radius: 50%; opacity: 0.5; }

/* Service Sections */
.service-sections {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.service-block {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
}

.service-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.06);
  border-color: #d1d5db;
}

.block-top { display: flex; align-items: center; gap: 15px; margin-bottom: 16px; }
.icon-box {
  width: 44px; height: 44px;
  background: var(--primary-bg);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}

.service-block h3 { font-size: 22px; color: var(--text-main); margin: 0; }
.service-block p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 24px; min-height: 45px; }

.service-links { display: flex; flex-wrap: wrap; gap: 10px; }
.service-links a {
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-main);
  text-decoration: none;
  transition: all 0.2s;
}

.service-links a:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Note Section */
.site-note-card {
  margin-top: 40px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  display: flex; align-items: center; gap: 12px;
  border: 1px dashed #cbd5e1;
}
.site-note-card p { margin: 0; color: var(--text-muted); font-size: 14px; }
.site-note-card span { color: var(--primary); font-weight: 700; }

@media (max-width: 1024px) {
  .service-hero { grid-template-columns: 1fr; }
  .service-sections { grid-template-columns: 1fr; }
}
</style>