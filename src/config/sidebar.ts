export const sidebarGroups: Record<string, {
  title: string
  items: { name: string; path: string }[]
}> = {
  about: {
    title: '关于我们',
    items: [
      { name: '学会简介', path: '/about/introduction' },
      { name: '学会章程', path: '/about/charter' },
      { name: '条例与制度', path: '/about/regulations' },
      { name: '主要领导', path: '/about/leaders' },
      { name: '分支机构', path: '/about/branches' },
      { name: '地方学会', path: '/about/local' },
    ]
  },
  // 子项由 SidebarLayout 根据 GET /news-categories?status=true 动态填充
  news: {
    title: '新闻动态',
    items: []
  }
}
