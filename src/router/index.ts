import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/Index.vue')
    },
    {
      path: '/services',
      name: 'Services',
      component: () => import('@/views/services/Index.vue')
    },
    {
      path: '/conference',
      name: 'Conference',
      component: () => import('@/views/conference/Index.vue'),
      children: [
        {
          path: 'past',
          name: 'ConferencePast',
          component: () => import('@/views/conference/Index.vue')
        },
        {
          path: 'submit',
          name: 'ConferenceSubmit',
          component: () => import('@/views/conference/Index.vue')
        },
        {
          path: 'guide',
          name: 'ConferenceGuide',
          component: () => import('@/views/conference/Index.vue')
        },
        {
          path: 'detail/:id',
          name: 'ConferenceDetail',
          component: () => import('@/views/conference/Index.vue')
        }
      ]
    },

    // 关于我们模块
    {
      path: '/about',
      component: () => import('@/components/layout/SidebarLayout.vue'),
      props: { groupKey: 'about' },
      children: [
        { path: 'introduction', name: 'AboutIntroduction', component: () => import('@/views/about/Introduction.vue') },
        { path: 'charter', name: 'AboutCharter', component: () => import('@/views/about/Charter.vue') },
        { path: 'regulations', name: 'AboutRegulations', component: () => import('@/views/about/Regulations.vue') },
        { path: 'leaders', name: 'AboutLeaders', component: () => import('@/views/about/Leaders.vue') },
        { path: 'branches', name: 'AboutBranches', component: () => import('@/views/about/Branches.vue') },
        { path: 'local', name: 'AboutLocal', component: () => import('@/views/about/Local.vue') }
      ]
    },
    // 新闻动态模块（侧栏菜单来自 /newsCategory；列表为 /news/c/:categoryId）
    {
      path: '/news',
      component: () => import('@/components/layout/SidebarLayout.vue'),
      props: { groupKey: 'news' },
      children: [
        { path: '', name: 'NewsIndex', component: () => import('@/views/news/NewsRedirect.vue') },
        {
          path: 'c/:categoryId(\\d+)',
          name: 'NewsCategoryList',
          component: () => import('@/views/news/CategoryList.vue')
        },
        { path: 'politics', redirect: '/news' },
        { path: 'tech', redirect: '/news' },
        { path: 'association', redirect: '/news' },
        { path: 'notice', redirect: '/news' },
        { path: 'events', redirect: '/news' },
        { path: 'event', redirect: '/news' }
      ]
    },
    {
      path: '/news/article/:id',
      redirect: (to) => {
        const raw = to.params.id
        const id = Array.isArray(raw) ? raw[0] : raw
        return { path: `/content/${id ?? ''}` }
      }
    },
    {
      path: '/content/:id',
      name: 'ContentDetail',
      component: () => import('@/components/common/ContentDetail.vue')
    },
    {
      path: '/apply',
      redirect: '/apply/step1'
    },
    {
      path: '/apply/:step',
      name: 'Apply',
      component: () => import('@/views/apply/Index.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue')
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: () => import('@/views/user/Index.vue')
    }
  ]
});

export default router;
