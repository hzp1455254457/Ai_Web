import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue').catch((err) => {
      console.error('Failed to load Home component:', err)
      throw err
    }),
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat.vue').catch((err) => {
      console.error('Failed to load Chat component:', err)
      throw err
    }),
  },
  {
    path: '/vision',
    name: 'Vision',
    component: () => import('@/views/Vision.vue').catch((err) => {
      console.error('Failed to load Vision component:', err)
      throw err
    }),
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('@/views/Resume.vue').catch((err) => {
      console.error('Failed to load Resume component:', err)
      throw err
    }),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
