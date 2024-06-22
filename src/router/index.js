
import { createRouter, createWebHistory } from 'vue-router'
import LoginSocios from '../views/LoginSocios.vue'

const routes = [
  {
    path: '/',
    name: 'LoginSocios',
    component: LoginSocios
  }
]

const router = createRouter({
  history: createWebHistory("#"),
  routes
})

export default router
