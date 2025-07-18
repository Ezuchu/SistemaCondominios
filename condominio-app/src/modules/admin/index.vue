<template>
  <div class="admin-layout">
    <!-- Mobile Header -->
    <nav class="mobile-header d-lg-none">
      <div class="mobile-header-content">
        <div class="mobile-logo">
          <img src="@/assets/Logo.png" alt="Logo" class="logo-img">
          <span class="logo-text">ISLANS WINDS</span>
        </div>
        <button 
          class="mobile-toggle-btn" 
          @click="toggleMobileSidebar"
          aria-label="Toggle navigation"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside 
      :class="[
        'sidebar',
        { 'sidebar--mobile-open': showMobileSidebar }
      ]"
    >
      <!-- Desktop Logo -->
      <div class="sidebar-logo d-none d-lg-flex">
        <div class="logo-container">
          <img src="@/assets/Logo.png" alt="Logo" class="logo-img">
          <div class="logo-info">
            <h5 class="logo-title">ISLANS WINDS</h5>
            <small class="logo-subtitle">Portal Administrador</small>
          </div>
        </div>
      </div>

      <!-- User Info -->
      <div class="sidebar-user">
        <div class="user-avatar">
          <i class="bi bi-person-gear"></i>
        </div>
        <div class="user-info">
          <h6 class="user-name">{{ usuario.nombre }}</h6>
          <small class="user-detail">{{ usuario.cargo }}</small>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'dashboard' }]"
              @click="setCurrentView('dashboard')"
            >
              <i class="bi bi-house-door nav-icon"></i>
              <span class="nav-text">Dashboard</span>
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'usuarios' }]"
              @click="setCurrentView('usuarios')"
            >
              <i class="bi bi-people nav-icon"></i>
              <span class="nav-text">Usuarios</span>
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'propiedades' }]"
              @click="setCurrentView('propiedades')"
            >
              <i class="bi bi-building nav-icon"></i>
              <span class="nav-text">Propiedades</span>
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'finanzas' }]"
              @click="setCurrentView('finanzas')"
            >
              <i class="bi bi-cash-stack nav-icon"></i>
              <span class="nav-text">Finanzas</span>
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'mantenimiento' }]"
              @click="setCurrentView('mantenimiento')"
            >
              <i class="bi bi-tools nav-icon"></i>
              <span class="nav-text">Mantenimiento</span>
              <span v-if="mantenimientoPendiente > 0" class="nav-badge">
                {{ mantenimientoPendiente }}
              </span>
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'avisos' }]"
              @click="setCurrentView('avisos')"
            >
              <i class="bi bi-megaphone nav-icon"></i>
              <span class="nav-text">Avisos</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Logout -->
      <div class="sidebar-footer">
        <a 
          href="#" 
          class="nav-link nav-link--logout" 
          @click="logout"
        >
          <i class="bi bi-box-arrow-right nav-icon"></i>
          <span class="nav-text">Cerrar Sesión</span>
        </a>
      </div>
    </aside>

    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="showMobileSidebar" 
      class="sidebar-overlay d-lg-none"
      @click="toggleMobileSidebar"
    ></div>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Dashboard View -->
      <div v-if="currentView === 'dashboard'" class="dashboard">
        <dashboard />
      </div>

      <!-- Other Views -->
      <usuarios v-else-if="currentView === 'usuarios'" @back="setCurrentView('dashboard')" />
      <propiedades v-else-if="currentView === 'propiedades'" @back="setCurrentView('dashboard')" />
      <finanzas v-else-if="currentView === 'finanzas'" @back="setCurrentView('dashboard')" />
      <mantenimiento v-else-if="currentView === 'mantenimiento'" @back="setCurrentView('dashboard')" />
      <avisos v-else-if="currentView === 'avisos'" @back="setCurrentView('dashboard')" />
    </main>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="['toast', `toast--${toast.type}`, { 'toast--show': toast.show }]"
      >
        <div class="toast-content">
          <i :class="getToastIcon(toast.type)"></i>
          <span>{{ toast.message }}</span>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import dashboard from './views/dashboard.vue'
import usuarios from './views/usuarios.vue'
import propiedades from './views/propiedades.vue'
import finanzas from './views/finanzas.vue'
import mantenimiento from './views/mantenimiento.vue'
import avisos from './views/avisos.vue'

const showMobileSidebar = ref(false)
const currentView = ref('dashboard')
const mantenimientoPendiente = ref(3)

// Toast notifications
const toasts = ref([])
let toastId = 0

const usuario = ref({
  nombre: 'María González',
  cargo: 'Administrador del Sistema'
})

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
}

const setCurrentView = (view) => {
  currentView.value = view
  showMobileSidebar.value = false
  showToast(`Navegando a ${getViewName(view)}`, 'info')
}

const getViewName = (view) => {
  const names = {
    dashboard: 'Dashboard',
    usuarios: 'Usuarios',
    propiedades: 'Propiedades',
    finanzas: 'Finanzas',
    mantenimiento: 'Mantenimiento',
    avisos: 'Avisos'
  }
  return names[view] || view
}

// Toast functions
const showToast = (message, type = 'info') => {
  const toast = {
    id: ++toastId,
    message,
    type,
    show: false
  }
  
  toasts.value.push(toast)
  
  nextTick(() => {
    toast.show = true
  })
  
  setTimeout(() => {
    removeToast(toast.id)
  }, 3000)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value[index].show = false
    setTimeout(() => {
      toasts.value.splice(index, 1)
    }, 300)
  }
}

const getToastIcon = (type) => {
  const icons = {
    success: 'bi-check-circle',
    error: 'bi-exclamation-circle',
    warning: 'bi-exclamation-triangle',
    info: 'bi-info-circle'
  }
  return icons[type] || 'bi-info-circle'
}

const logout = () => {
  showToast('Cerrando sesión...', 'info')
  setTimeout(() => {
    console.log('Logout')
  }, 1000)
}
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-fondo);
}

// Mobile Header
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--color-primario);
  z-index: 1040;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .mobile-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 1rem;
  }
  
  .mobile-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .logo-img {
      height: 32px;
      width: auto;
    }
    
    .logo-text {
      color: var(--color-fondo);
      font-weight: 600;
      font-size: 1.1rem;
    }
  }
  
  .mobile-toggle-btn {
    background: none;
    border: none;
    color: var(--color-fondo);
    font-size: 1.5rem;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

// Sidebar
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, var(--color-primario) 0%, var(--color-secundario) 100%);
  color: var(--color-fondo);
  z-index: 1050;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 991.98px) {
    transform: translateX(-100%);
    
    &.sidebar--mobile-open {
      transform: translateX(0);
    }
  }
  
  @media (min-width: 992px) {
    position: fixed;
    z-index: 1030;
  }
}

.sidebar-logo {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .logo-img {
    height: 40px;
    width: auto;
    flex-shrink: 0;
  }
  
  .logo-info {
    min-width: 0;
  }
  
  .logo-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-fondo);
  }
  
  .logo-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
  }
}

.sidebar-user {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  
  .user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    
    i {
      font-size: 1.2rem;
    }
  }
  
  .user-info {
    min-width: 0;
    transition: all 0.3s ease;
  }
  
  .user-name {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-fondo);
  }
  
  .user-detail {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0.25rem 0.5rem;
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-fondo);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
    text-decoration: none;
    color: var(--color-fondo);
    transform: translateX(4px);
  }
  
  &.nav-link--active {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1));
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background-color: var(--color-amarillo);
      border-radius: 0 2px 2px 0;
    }
  }
  
  &.nav-link--logout {
    color: rgba(255, 255, 255, 0.8);
    
    &:hover {
      color: var(--color-amarillo);
      background: linear-gradient(135deg, rgba(255, 168, 1, 0.15), rgba(255, 168, 1, 0.05));
    }
  }
}

.nav-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.nav-text {
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.nav-badge {
  background: linear-gradient(135deg, var(--color-peligro), var(--color-naranja));
  color: var(--color-fondo);
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  margin-left: auto;
  min-width: 18px;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sidebar-footer {
  padding: 1rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  backdrop-filter: blur(2px);
}

// Main Content
.main-content {
  flex: 1;
  background-color: var(--color-claro);
  min-height: 100vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 991.98px) {
    margin-top: 60px;
    margin-left: 0;
  }
  
  @media (min-width: 992px) {
    margin-left: 280px;
  }
}

// Dashboard
.dashboard {
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Toast Notifications
.toast-container {
  position: fixed;
  top: 80px;
  right: 1rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    left: 1rem;
    right: 1rem;
  }
}

.toast {
  background: var(--color-fondo);
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 300px;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid;
  
  @media (max-width: 768px) {
    min-width: auto;
  }
  
  &.toast--show {
    transform: translateX(0);
    opacity: 1;
  }
  
  &.toast--success {
    border-left-color: var(--color-éxito);
    
    .toast-content i {
      color: var(--color-éxito);
    }
  }
  
  &.toast--error {
    border-left-color: var(--color-peligro);
    
    .toast-content i {
      color: var(--color-peligro);
    }
  }
  
  &.toast--warning {
    border-left-color: var(--color-naranja);
    
    .toast-content i {
      color: var(--color-naranja);
    }
  }
  
  &.toast--info {
    border-left-color: var(--color-informativo);
    
    .toast-content i {
      color: var(--color-informativo);
    }
  }
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  
  i {
    font-size: 1.1rem;
  }
  
  span {
    font-size: 0.9rem;
    color: var(--color-oscuro);
  }
}

.toast-close {
  background: none;
  border: none;
  color: var(--color-oscuro);
  opacity: 0.5;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
