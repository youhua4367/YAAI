import { createRouter, createWebHistory } from 'vue-router'

/**
 * 固定路由：不走 GET /pages 的业务页（会员、登录、内容详情等）。
 *
 * 站点「页面入口」（home / news / about / services / conference 等）在启动时由
 * `useSitePagesStore().registerSiteRoutes(router)` 根据接口返回注册，
 * 见 `src/router/builtinModuleRoutes.ts` 与 `src/stores/sitePages.ts`。
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
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
