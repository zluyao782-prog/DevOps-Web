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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
