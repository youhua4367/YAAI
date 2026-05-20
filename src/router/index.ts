import { createRouter, createWebHistory } from 'vue-router'

/**
 * 固定路由：不走 GET /pages 的业务页（会员、登录、会议、服务等）。
 *
 * 站点「页面入口」（home / news / about / 后台 custom 页）在启动时由
 * `useSitePagesStore().registerSiteRoutes(router)` 根据接口返回的 code 注册，
 * 见 `src/router/builtinModuleRoutes.ts` 与 `src/stores/sitePages.ts`。
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
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
})

export default router
