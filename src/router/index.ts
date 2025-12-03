import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/red-tourism',
      name: 'red-tourism',
      component: () => import('@/views/RedTourismView.vue')
    },
    {
      path: '/chapter/:id',
      name: 'chapter',
      component: () => import('@/views/ChapterView.vue')
    }
  ]
})

export default router