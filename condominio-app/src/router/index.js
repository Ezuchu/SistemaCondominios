import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../modules/auth/views/LoginView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../modules/admin/index.vue') 
  },
  {
    path: '/propietario',
    name: 'propietario',
    component: () => import('../modules/propietario/index.vue'),
    children: [
      { path: 'pagos', component: () => import('../modules/propietario/views/pagos.vue') },
      { path: 'estados-cuenta', component: () => import('../modules/propietario/views/estadoCuenta.vue') },
      { path: 'avisos', component: () => import('../modules/propietario/views/avisos.vue') },
      { path: 'avisos/:id', component: () => import('../modules/propietario/views/avisosDetalle.vue') },
      { path: 'perfil', component: () => import('../modules/propietario/views/perfil.vue') },
    ]
  },
  {
    path: '/operador',
    name: 'operador',
    component: () => import('../modules/operador/index.vue')
  }
];
    
const router = createRouter({
  history: createWebHistory('/'), 
  routes
});

export default router;