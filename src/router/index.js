import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'product', component: () => import('../views/Product.vue') },
      { path: 'version', component: () => import('../views/Version.vue') },
      { path: 'repository', component: () => import('../views/Repository.vue') },
      { path: 'artifact', component: () => import('../views/Artifact.vue') },
      { path: 'cicd', component: () => import('../views/CICD.vue') },
      { path: 'user', component: () => import('../views/User.vue') }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  // 动态导入避免循环依赖
  const { useAuthStore } = await import('../stores/auth')
  const { getActivePinia } = await import('pinia')
  const pinia = getActivePinia()
  if (!pinia) return next()

  const auth = useAuthStore(pinia)

  // 首次访问时尝试通过 cookie 恢复登录状态
  if (!auth.loggedIn && to.meta.requiresAuth) {
    await auth.initAuth()
  }

  if (to.meta.requiresAuth && !auth.loggedIn) {
    next('/login')
  } else if (to.path === '/login' && auth.loggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
