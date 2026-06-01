export interface ServiceEntry {
  key: string
  title: string
  description: string
  icon: string
}

export const SERVICE_ENTRIES: ServiceEntry[] = [
  {
    key: 'consulting',
    title: '科技咨询',
    description: '提供人工智能领域的技术咨询和专家解决方案',
    icon: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop'
  },
  {
    key: 'training',
    title: '技术培训',
    description: '开展人工智能前沿技术培训与专业人才培养',
    icon: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop'
  },
  {
    key: 'project',
    title: '项目申报',
    description: '协助企业和科研机构申报国家及省级科技项目',
    icon: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop'
  },
  {
    key: 'transformation',
    title: '成果转化',
    description: '促进人工智能高精尖成果的产业化落地与转化',
    icon: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=60&h=60&fit=crop'
  }
]
