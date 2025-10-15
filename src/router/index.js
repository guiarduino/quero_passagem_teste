import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Bus from '@/pages/Bus.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/onibus',
    name: 'Onibus',
    component: Bus
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
