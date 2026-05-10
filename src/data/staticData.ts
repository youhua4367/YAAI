export interface StaticContent {
  title: string;
  subtitle: string;
  englishName?: string;
  content: string[];
}

export const staticData: Record<string, StaticContent> = {
  // 关于我们 - 学会简介
  'about-introduction': {
    title: '学会简介',
    subtitle: '云南人工智能学会',
    englishName: 'Yunnan Artificial Intelligence Association',
    content: [
      '云南人工智能学会（Yunnan Artificial Intelligence Association，YNAI）是由云南省内从事人工智能研究、开发、应用的科技工作者和单位自愿组成的学术性、非营利性社会组织。',
      '学会成立于2026年，旨在推动人工智能技术在云南的发展与应用，促进学术交流与合作，为云南经济社会发展提供科技支撑。',
      '学会的主要任务包括：组织学术交流活动、开展科普宣传、推动产学研合作、培养专业人才等。',
      '目前拥有多个专业委员会和工作委员会，覆盖了智能科学与技术领域。学会活动的学术领域是智能科学技术，活动地域是云南省全境。',
      '学会自主创办人工智能技术研讨会、云南智能产业高峰论坛等系列化学术活动，为智能科学技术工作者提供了一个展示、交流、融合科研成果的平台，有效地促进了智能科学技术的发展。',
      '学会主办有内部刊物《云南人工智能学会通讯》，定期发布行业动态和学术成果。'
    ]
  },
  
  // 关于我们 - 学会章程
  'about-charter': {
    title: '学会章程',
    subtitle: '云南人工智能学会',
    englishName: 'Yunnan Artificial Intelligence Association',
    content: [
      '第一章 总则',
      '第一条 本学会名称为云南人工智能学会（Yunnan Artificial Intelligence Association，YNAI）。',
      '第二条 本学会是由云南省内从事人工智能研究、开发、应用的科技工作者和单位自愿组成的学术性、非营利性社会组织。',
      '第三条 本学会的宗旨是：团结和组织全省人工智能领域的科技工作者，促进人工智能技术的研究、开发和应用，推动人工智能学科的发展，为云南经济社会发展服务。',
      '第四条 本学会接受云南省科学技术协会的业务指导和云南省民政厅的监督管理。',
      '第五条 本学会的住所设在昆明市。',
      '',
      '第二章 业务范围',
      '第六条 本学会的业务范围：',
      '（一）组织开展人工智能领域的学术交流活动；',
      '（二）开展人工智能科普宣传和教育活动；',
      '（三）推动人工智能技术的产学研合作；',
      '（四）培养和推荐人工智能专业人才；',
      '（五）为政府和企业提供人工智能技术咨询服务；',
      '（六）编辑出版人工智能相关的学术刊物和资料；',
      '（七）开展国际学术交流与合作。'
    ]
  },
  
  // 学术资源 - CAAI AIR
  'academic-air': {
    title: 'CAAI AIR',
    subtitle: 'Artificial Intelligence Review',
    englishName: '人工智能评论',
    content: [
      'CAAI AIR（Artificial Intelligence Review）是中国人工智能学会主办的国际期刊，涵盖人工智能领域的综述和评论文章。',
      '主要刊发人工智能各分支领域的综述文章、技术评论和发展趋势分析。',
      '出版周期：双月刊',
      '收录情况：SCI、EI Compendex、Scopus等',
      '开放获取：是'
    ]
  },
  
  // 学术资源 - 智能系统学报
  'academic-journal': {
    title: '智能系统学报',
    subtitle: 'Journal of Intelligent Systems',
    englishName: '智能系统学报',
    content: [
      '《智能系统学报》是中国人工智能学会主办的学术期刊，主要刊登人工智能领域的原创性研究成果。',
      '该期刊为中文核心期刊，被多个国际数据库收录，包括EI、Scopus等。',
      '主要栏目：人工智能基础理论、机器学习、计算机视觉、自然语言处理、智能系统与应用等。',
      '出版周期：双月刊',
      '影响因子：2.8（2025年）'
    ]
  },
  
  // 学术资源 - 学会通讯
  'academic-newsletter': {
    title: '学会通讯',
    subtitle: 'Newsletter',
    englishName: 'YNAI Newsletter',
    content: [
      '《中国人工智能学会通讯》是中国人工智能学会主办的内部刊物，创刊于2011年，主要刊发学会工作动态、学术活动信息和会员交流内容。',
      '主编：戴琼海（CAAI理事长，中国工程院院士）',
      '出版周期：月刊',
      '主要栏目：学会动态、学术活动、会员风采、产业动态、国际交流等。',
      '订阅方式：学会会员免费获取，非会员可通过学会官网订阅。'
    ]
  },
  
  // 学术资源 - CAAI TRIT
  'academic-trit': {
    title: 'CAAI TRIT',
    subtitle: '智能交通学报',
    englishName: 'Transactions on Intelligent Transportation',
    content: [
      'CAAI TRIT（Transactions on Intelligent Transportation）是中国人工智能学会主办的国际期刊，专注于智能交通领域的研究。',
      '主要刊发智能交通系统、自动驾驶、交通大数据、车联网等领域的高质量学术论文。',
      '出版周期：季刊',
      '收录情况：EI Compendex、Scopus、DOAJ等',
      '开放获取：是'
    ]
  }
};