import { createRouter, createWebHistory } from 'vue-router'
import RedTourismView from '@/views/RedTourismView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RedTourismView
    }
  ]
})

export default router
