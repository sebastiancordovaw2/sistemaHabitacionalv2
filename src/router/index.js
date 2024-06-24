
import { createRouter, createWebHistory } from 'vue-router'
import LoginSocios from '../views/LoginSocios.vue'
import LoginDirectiva from '../views/LoginDirectiva.vue'
import Dashboard from '../views/Dashboard.vue'

import listSocio from '../views/control/socios/list.vue'
import insertSocio from '../views/control/socios/insert.vue'
import updateSocio from '../views/control/socios/update.vue'

import listReuniones from '../views/control/reuniones/list.vue'
import insertReuniones from '../views/control/reuniones/insert.vue'
import updateReuniones from '../views/control/reuniones/update.vue'

const routes = [
  {
    path: '/',
    name: 'LoginSocios',
    component: LoginSocios
  },
  {
    path: '/logindirectiva',
    name: 'LoginDirectiva',
    component: LoginDirectiva
  }
  ,
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
  ,
  {
    path: '/dashboard/socios',
    name: 'sociosList',
    component: listSocio
  }
  ,
  {
    path: '/dashboard/socios/insert',
    name: 'sociosInsert',
    component: insertSocio
  }
  ,
  {
    path: '/dashboard/socios/update',
    name: 'sociosUpdate',
    component: updateSocio
  }
  ,
  {
    path: '/dashboard/reuniones',
    name: 'reunionesList',
    component: listReuniones
  },
  {
    path: '/dashboard/reuniones/insert',
    name: 'reunionesInsert',
    component: insertReuniones
  },
  {
    path: '/dashboard/reuniones/update',
    name: 'reunionesUpdate',
    component: updateReuniones
  }
  

]

const router = createRouter({
  history: createWebHistory("#"),
  routes
})

export default router
