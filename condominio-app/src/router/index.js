import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../modules/auth/views/LandingView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../modules/admin/index.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/propietario',
    name: 'propietario',
    component: () => import('../modules/propietario/index.vue'),
    meta: { requiresAuth: true, role: 'propietario' },
    children: [
      { path: 'pagos', component: () => import('../modules/propietario/views/pagos.vue') },
      { path: 'estados-cuenta', component: () => import('../modules/propietario/views/estadoCuenta.vue') },
      { path: 'avisos', component: () => import('../modules/propietario/views/avisos.vue') },
      { path: 'perfil', component: () => import('../modules/propietario/views/perfil.vue') },
    ]
  },
  {
    path: '/operador',
    name: 'operador',
    component: () => import('../modules/operador/index.vue'),
    meta: { requiresAuth: true, role: 'operador' }
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router