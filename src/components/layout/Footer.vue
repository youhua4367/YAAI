<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container footer-grid">
        <div class="footer-section brand-info">
          <h4>云南人工智能学会</h4>
          <p class="desc">
            面向云南人工智能学术交流、技术创新、成果转化、人才培养与社会服务，建设区域性高水平科技社团门户。
          </p>
        </div>

        <div class="footer-section">
          <h4>网站导航</h4>
          <nav class="footer-links">
            <router-link to="/about">关于云智会</router-link>
            <router-link to="/news">新闻动态</router-link>
            <router-link to="/news">新闻动态</router-link>
            <router-link to="/services">会议系统</router-link>
          </nav>
        </div>

        <div class="footer-section">
          <h4>常用服务</h4>
          <nav class="footer-links">
            <router-link to="/services">会员注册</router-link>
            <router-link to="/services">成果奖励</router-link>
            <router-link to="/services">学术基金</router-link>
            <router-link to="/news">资料下载</router-link>
          </nav>
        </div>

        <div class="footer-section contact-info">
          <h4>联系方式</h4>
          <p><span class="label">地址：</span>云南省昆明市示范地址 88 号</p>
          <p><span class="label">电话：</span>0871-6312 8888</p>
          <p><span class="label">邮箱：</span>contact@ynai.org.cn</p>
          <p><span class="label">邮编：</span>650000</p>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>版权所有 © 云南人工智能学会 <span class="sep">|</span> 建议使用现代浏览器访问 <span class="sep">|</span> 备案号：滇ICP备2026000001号</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 容器基准 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页脚主容器 */
.footer {
  background: linear-gradient(180deg, #163354 0%, #0d1f33 100%);
  color: rgba(255, 255, 255, 0.8);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 上半部分布局 */
.footer-top {
  padding: 60px 0 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1.2fr;
  gap: 40px;
}

/* 标题样式 */
.footer h4 {
  margin: 0 0 25px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  position: relative;
}

/* 标题下方的科技蓝装饰线 */
.footer h4::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 30px;
  height: 2px;
  background: #00d4ff;
}

/* 简介文字 */
.desc {
  line-height: 1.8;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  text-align: justify;
}

/* 链接列表 */
.footer-links a {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #00d4ff;
  padding-left: 6px; /* 悬浮时的位移动画 */
}

/* 联系方式详情 */
.contact-info p {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.75);
}

.contact-info .label {
  color: rgba(255, 255, 255, 0.4);
}

/* 页脚版权区域 */
.footer-bottom {
  text-align: center;
  padding: 24px 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.5px;
}

.footer-bottom .sep {
  margin: 0 10px;
  color: rgba(255, 255, 255, 0.1);
}

/* 响应式适配 */
@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer h4 {
    margin-bottom: 15px;
  }
  .footer-top {
    padding: 40px 0 20px;
  }
}
</style>