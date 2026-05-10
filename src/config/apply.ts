export const APPLY_STEPS = ['入会须知', '注册账号', '填写资料', '提交成功'] as const

export const APPLY_LAYOUT = {
  logoAbbr: 'AI',
  siteName: '云南人工智能学会',
  headerPrompt: '已有账号，',
  loginText: '去登录',
  userCenterText: '进入用户中心',
  loginPath: '/login',
  userCenterPath: '/user',
  footerTips: '建议使用360浏览器（极速模式）、Firefox浏览器、Chrome浏览器登录系统！为确保最佳浏览效果，建议最佳分辨率为1920*1080',
  footerCopyright:
    'Copyright © 2026 版权所有：云南人工智能学会 备案编号：滇ICP备XXXXXXXX号-1 技术支持：云南人工智能学会 邮箱：member@ynai.cn'
} as const

export const APPLY_NOTICE = {
  title: '云南人工智能学会会费管理办法',
  date: '（2025年3月16日第九次会员代表大会审议通过）',
  sections: [
    {
      heading: '',
      paragraphs: [
        '为做好云南人工智能学会会费的收缴、使用与管理工作，根据《中国科学技术协会全国学会组织通则》和《云南人工智能学会章程》，参考《中国人工智能学会关于发展会员暨提高服务工作水平的基本方案》（2007年12月28日会员代表大会讨论通过），并结合学会的实际情况和长远发展目标，特制定本办法。'
      ]
    },
    {
      heading: '一、会员分类',
      paragraphs: [
        '本会会员有个人会员与单位会员两种类别。',
        '个人会员根据其在专业工作和学会活动中的实际贡献和所发挥的作用来确定其级别，具体可分为学生会员、普通会员、高级会员、外籍会员等。',
        '单位会员可以是本会业务领域内的普通高等学校、科研机构、企事业单位。'
      ]
    },
    {
      heading: '二、会费标准',
      paragraphs: [
        '（一）个人会员缴纳标准：普通会员、高级会员、外籍会员等280元/年，学生会员50元/届；',
        '（二）除学生会员外，各级会员均可申请为个人终身会员，终身会员会费2800元；',
        '（三）单位会员缴纳标准：普通单位会员10000元/年，理事单位会员50000元/年，常务理事单位会员100000元/年。'
      ]
    },
    {
      heading: '三、收缴管理',
      paragraphs: [
        '（一）按期缴纳会费是会员应尽的义务和责任，会费是保证学会开展各项活动的主要经费来源之一；',
        '（二）对于逾期未缴纳会费，经书面催缴后仍不缴纳的会员，可视情况中止其会员资格；',
        '（三）学会统一负责收取会费，并开具《全国性社会团体会费统一票据》。除会费以外，其他收入不得使用该票据。会费收缴方式包括银行转账、在线支付、现场缴纳等。'
      ]
    }
  ],
  nextText: '同意并继续'
} as const

export const APPLY_ACCOUNT_CONFIG = {
  fields: [
    { key: 'username', label: '用户名', placeholder: '请输入用户名', maxlength: 20 },
    { key: 'phone', label: '注册手机号', placeholder: '请输入手机号', maxlength: 11 },
    { key: 'email', label: '注册邮箱', placeholder: '请输入邮箱' },
    { key: 'code', label: '验证码', placeholder: '请输入验证码' },
    { key: 'password', label: '密码', placeholder: '8-32位，必须包含字母和数字', type: 'password' },
    { key: 'confirmPassword', label: '确认密码', placeholder: '请再次输入密码', type: 'password' }
  ],
  agreementPrefix: '我已阅读并同意',
  agreementText: '《入会须知》',
  agreementPath: '/about/charter',
  prevText: '上一步',
  submitText: '立即注册',
  submittingText: '提交中...',
  policyTitle: '/ 条例法规 /',
  contactTitle: '/ 联系方式 /',
  policyLinks: [
    { text: '学会章程', to: '/about/charter' },
    { text: '会费管理办法', to: '/about/regulations' }
  ],
  contacts: ['电话：0871-65123456、0871-65123457', '地址：云南省昆明市呈贡区大学城云南大学呈贡校区信息学院', '邮编：650500', '邮箱：member@ynai.cn'],
  validation: {
    passwordRequired: '请输入密码',
    passwordRule: '密码需为8-32位且包含字母和数字',
    passwordMismatch: '两次输入的密码不一致',
    agreementRequired: '请先阅读并同意入会须知',
    usernameRequired: '请输入用户名',
    usernameLength: '用户名长度需在4-20个字符',
    usernamePattern: '用户名仅支持字母、数字、下划线',
    phoneRequired: '请输入手机号',
    phonePattern: '请输入有效手机号',
    emailRequired: '请输入邮箱',
    emailPattern: '请输入有效邮箱',
    codeRequired: '请输入验证码',
    confirmPasswordRequired: '请确认密码'
  }
} as const

export const APPLY_MEMBER_SELECTION_CONFIG = {
  searchPlaceholder: '查找您想加入的机构',
  searchText: '搜索',
  memberTypeLabel: '选择会员类型',
  memberTypes: [
    { value: 'personal', label: '个人会员' },
    { value: 'organization', label: '单位会员' }
  ],
  memberCategoryLabel: '会员类别',
  memberCategories: [
    { value: '', label: '请选择' },
    { value: 'student', label: '学生会员' },
    { value: 'regular', label: '普通会员' },
    { value: 'senior', label: '高级会员' },
    { value: 'fellow', label: '会士' }
  ],
  generalOrgTitle: '总会',
  generalOrg: { value: 'ynai', label: '云南人工智能学会' },
  committeeTitle: '专业委员会',
  collapseIcons: {
    expanded: '▼',
    collapsed: '▶'
  },
  prevText: '上一步',
  nextText: '下一步'
} as const

export const COMMITTEES = [
  { id: 'robot', name: '智能机器人专业委员会' },
  { id: 'ml', name: '机器学习专业委员会' },
  { id: 'cv', name: '机器视觉与图像专业委员会' },
  { id: 'edge', name: '边缘智能计算专业委员会' },
  { id: 'education', name: '智能教育技术专业委员会' },
  { id: 'medical', name: '智能医疗专业委员会' },
  { id: 'knowledge', name: '知识工程与分布智能专业委员会' },
  { id: 'information', name: '智能信息网络专业委员会' },
  { id: 'bio', name: '生物信息学与人工生命专业委员会' },
  { id: 'basic', name: '人工智能基础专业委员会' },
  { id: 'neural', name: '神经网络与计算智能专业委员会' },
  { id: 'creative', name: '智能创意与数字艺术专业委员会' }
] as const

export const RESEARCH_AREAS = [
  { id: 'ml', name: '机器学习与数据挖掘' },
  { id: 'cv', name: '计算机视觉' },
  { id: 'nlp', name: '自然语言处理' },
  { id: 'robot', name: '智能机器人' },
  { id: 'knowledge', name: '知识图谱' },
  { id: 'edge', name: '边缘计算' },
  { id: 'auto', name: '自动驾驶' },
  { id: 'medical', name: '智能医疗' },
  { id: 'education', name: '智能教育' },
  { id: 'finance', name: '智能金融' },
  { id: 'security', name: '智能安全' },
  { id: 'chip', name: '智能芯片' }
] as const

export const GENDER_OPTIONS = [
  { value: '', label: '请选择' },
  { value: 'male', label: '男' },
  { value: 'female', label: '女' }
] as const

export const WORK_STATUS_OPTIONS = [
  { value: '', label: '请选择' },
  { value: '在职', label: '在职' },
  { value: '离职', label: '离职' }
] as const

export const SINGLE_MEMBER_FORM_CONFIG = {
  titles: {
    basic: '基本信息',
    contact: '联系方式',
    work: '工作信息',
    education: '教育经历',
    workExperience: '工作经历',
    academic: '学术信息'
  },
  sections: [
    {
      titleKey: 'basic',
      fields: [
        { key: 'name', label: '姓名', type: 'input', required: true, placeholder: '请输入姓名' },
        { key: 'gender', label: '性别', type: 'select', required: true, options: GENDER_OPTIONS },
        { key: 'idCardType', label: '证件类型', type: 'select', required: true, options: [
          { value: '', label: '请选择' },
          { value: 'idcard', label: '身份证' },
          { value: 'passport', label: '护照' },
          { value: 'other', label: '其他' }
        ]},
        { key: 'idCardNumber', label: '证件号码', type: 'input', required: true, placeholder: '请输入证件号码' },
        { key: 'birthDate', label: '出生日期', type: 'date', required: true },
        { key: 'country', label: '国籍', type: 'input', required: true, placeholder: '请输入国籍' },
        { key: 'nativePlace', label: '籍贯', type: 'input', required: true, placeholder: '请输入籍贯' },
        { key: 'nationality', label: '民族', type: 'input', required: true, placeholder: '请输入民族' },
        { key: 'politicalOutlook', label: '政治面貌', type: 'input', required: true, placeholder: '请输入政治面貌' }
      ]
    },
    {
      titleKey: 'contact',
      fields: [
        { key: 'address', label: '通讯地址', type: 'input', required: true, placeholder: '请输入通讯地址' },
        { key: 'postalCode', label: '邮政编码', type: 'input', required: false, placeholder: '请输入邮政编码' },
        { key: 'contactPhone', label: '联系电话', type: 'input', required: true, placeholder: '请输入联系电话' },
        { key: 'landlinePhone', label: '固定电话', type: 'input', required: false, placeholder: '请输入固定电话' }
      ]
    },
    {
      titleKey: 'work',
      fields: [
        { key: 'jobTitle', label: '职称', type: 'input', required: true, placeholder: '请输入职称' },
        { key: 'industry', label: '行业', type: 'input', required: false, placeholder: '请输入行业' },
        { key: 'workUnit', label: '工作单位', type: 'input', required: true, placeholder: '请输入工作单位' },
        { key: 'workDepartment', label: '部门', type: 'input', required: true, placeholder: '请输入部门' },
        { key: 'position', label: '职位', type: 'input', required: true, placeholder: '请输入职位' },
        { key: 'workContent', label: '工作内容', type: 'textarea', required: false, placeholder: '请输入工作内容' }
      ]
    },
    {
      titleKey: 'education',
      fields: [
        { key: 'degree', label: '学位', type: 'input', required: true, placeholder: '如：学士、硕士、博士' },
        { key: 'school', label: '学校', type: 'input', required: true, placeholder: '请输入学校名称' },
        { key: 'major', label: '专业', type: 'input', required: true, placeholder: '请输入专业' },
        { key: 'startDate', label: '开始日期', type: 'date', required: false },
        { key: 'endDate', label: '结束日期', type: 'date', required: false }
      ],
      addText: '添加教育经历'
    },
    {
      titleKey: 'workExperience',
      fields: [
        { key: 'company', label: '公司/单位', type: 'input', required: true, placeholder: '请输入公司或单位名称' },
        { key: 'department', label: '部门', type: 'input', required: true, placeholder: '请输入部门' },
        { key: 'jobTitle', label: '职称/职务', type: 'input', required: true, placeholder: '请输入职称或职务' },
        { key: 'workContent', label: '工作内容', type: 'textarea', required: false, placeholder: '请输入工作内容' },
        { key: 'status', label: '状态', type: 'select', required: true, options: WORK_STATUS_OPTIONS },
        { key: 'startDate', label: '开始日期', type: 'date', required: false },
        { key: 'endDate', label: '结束日期', type: 'date', required: false }
      ],
      addText: '添加工作经历'
    },
    {
      titleKey: 'academic',
      fields: [
        { key: 'highestEducation', label: '最高学历', type: 'input', required: true, placeholder: '请输入最高学历' },
        { key: 'major', label: '专业', type: 'input', required: false, placeholder: '请输入专业' },
        { key: 'researchDirection', label: '研究方向', type: 'textarea', required: true, placeholder: '请输入研究方向', fullWidth: true },
        { key: 'publication', label: '代表性学术成果/论文', type: 'textarea', required: false, placeholder: '请输入代表性学术成果或论文', fullWidth: true },
        { key: 'honors', label: '获得荣誉', type: 'textarea', required: false, placeholder: '请输入获得的荣誉', fullWidth: true },
        { key: 'projectExperience', label: '项目经验', type: 'textarea', required: false, placeholder: '请输入参与的项目', fullWidth: true }
      ]
    }
  ],
  prevText: '上一步',
  submitText: '提交申请'
} as const

export const COMPANY_MEMBER_FORM_CONFIG = {
  titles: {
    basic: '单位基本信息',
    intro: '单位介绍',
    contact: '单位联系方式',
    leader: '负责人信息',
    contactPerson: '联系人信息',
    other: '其他信息'
  },
  sections: [
    {
      titleKey: 'basic',
      fields: [
        { key: 'unitName', label: '单位名称', type: 'input', required: true, placeholder: '请输入单位名称' },
        { key: 'unitCategory', label: '单位类别', type: 'input', required: false, placeholder: '请输入单位类别' },
        { key: 'industry', label: '所属行业', type: 'input', required: false, placeholder: '请输入所属行业' },
        { key: 'unifiedSocialCreditCode', label: '统一社会信用代码', type: 'input', required: true, placeholder: '请输入统一社会信用代码' },
        { key: 'legalRepresentative', label: '法定代表人', type: 'input', required: false, placeholder: '请输入法定代表人' },
        { key: 'establishedDate', label: '成立日期', type: 'date', required: false },
        { key: 'registeredCapital', label: '注册资本', type: 'number', required: false, placeholder: '请输入注册资本' },
        { key: 'financingRound', label: '融资轮次', type: 'input', required: false, placeholder: '请输入融资轮次' },
        { key: 'totalEmployees', label: '员工总数', type: 'number', required: false, placeholder: '请输入员工总数' },
        { key: 'businessScope', label: '业务领域', type: 'textarea', required: true, placeholder: '请输入业务范围', fullWidth: true }
      ]
    },
    {
      titleKey: 'intro',
      fields: [
        { key: 'unitIntro', label: '单位简介', type: 'textarea', required: false, placeholder: '请输入单位简介', fullWidth: true },
        { key: 'aiIndustryIntro', label: '人工智能行业介绍', type: 'textarea', required: false, placeholder: '请输入在人工智能行业的相关情况', fullWidth: true }
      ]
    },
    {
      titleKey: 'contact',
      fields: [
        { key: 'areaCode', label: '地区编码', type: 'input', required: true, placeholder: '请输入地区编码' },
        { key: 'address', label: '通讯地址', type: 'input', required: true, placeholder: '请输入通讯地址' },
        { key: 'postalCode', label: '邮政编码', type: 'input', required: false, placeholder: '请输入邮政编码' },
        { key: 'website', label: '单位网站', type: 'input', required: false, placeholder: '请输入单位网站' }
      ]
    },
    {
      titleKey: 'leader',
      fields: [
        { key: 'leaderName', label: '负责人姓名', type: 'input', required: false, placeholder: '请输入负责人姓名' },
        { key: 'leaderTitle', label: '负责人职务', type: 'input', required: false, placeholder: '请输入负责人职务' },
        { key: 'leaderPhone', label: '负责人电话', type: 'input', required: false, placeholder: '请输入负责人电话' },
        { key: 'leaderEmail', label: '负责人邮箱', type: 'input', required: false, placeholder: '请输入负责人邮箱' }
      ]
    },
    {
      titleKey: 'contactPerson',
      fields: [
        { key: 'contactName', label: '联系人姓名', type: 'input', required: true, placeholder: '请输入联系人姓名' },
        { key: 'contactGender', label: '联系人性别', type: 'select', required: false, options: GENDER_OPTIONS },
        { key: 'contactJobTitle', label: '联系人职务', type: 'input', required: false, placeholder: '请输入联系人职务' },
        { key: 'contactTitle', label: '联系人职称', type: 'input', required: false, placeholder: '请输入联系人职称' },
        { key: 'contactMobile', label: '联系人手机', type: 'input', required: true, placeholder: '请输入联系人手机' },
        { key: 'contactEmail', label: '联系人邮箱', type: 'input', required: true, placeholder: '请输入联系人邮箱' },
        { key: 'contactDept', label: '联系人部门', type: 'input', required: false, placeholder: '请输入联系人部门' },
        { key: 'contactOfficePhone', label: '联系人办公电话', type: 'input', required: false, placeholder: '请输入联系人办公电话' },
        { key: 'contactFax', label: '联系人传真', type: 'input', required: false, placeholder: '请输入联系人传真' }
      ]
    },
    {
      titleKey: 'other',
      fields: [
        { key: 'otherSocieties', label: '加入的其他学会/协会', type: 'input', required: false, placeholder: '请输入加入的其他学会或协会' },
        { key: 'suggestions', label: '建议与意见', type: 'textarea', required: false, placeholder: '请输入对学会的建议与意见', fullWidth: true }
      ]
    }
  ],
  prevText: '上一步',
  submitText: '提交申请'
} as const

export const APPLY_SUCCESS_CONFIG = {
  iconText: '✓',
  title: '申请提交成功',
  message: '您的会员申请已提交成功，请耐心等待审核。',
  hint: '审核结果将通过短信和邮件通知您，请注意查收。',
  actions: [
    { text: '返回首页', to: '/', type: 'primary' },
    { text: '去登录', to: '/login', type: 'default' }
  ]
} as const
