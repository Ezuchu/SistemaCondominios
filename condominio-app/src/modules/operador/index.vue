<template>
  <div class="operador-layout">
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
        { 'sidebar--mobile-open': showMobileSidebar },
        { 'sidebar--collapsed': sidebarCollapsed }
      ]"
    >
      <!-- Desktop Toggle Button -->
      <button 
        class="sidebar-toggle d-none d-lg-block"
        @click="toggleDesktopSidebar"
        aria-label="Toggle sidebar"
      >
        <i :class="sidebarCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
      </button>

      <!-- Desktop Logo -->
      <div class="sidebar-logo d-none d-lg-flex">
        <div class="logo-container">
          <img src="@/assets/Logo.png" alt="Logo" class="logo-img">
          <div v-if="!sidebarCollapsed" class="logo-info">
            <h5 class="logo-title">ISLANS WINDS</h5>
            <small class="logo-subtitle">Portal Operador</small>
          </div>
        </div>
      </div>

      <!-- User Info -->
      <div class="sidebar-user" v-if="!sidebarCollapsed || showMobileSidebar">
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
              :title="sidebarCollapsed ? 'Dashboard' : ''"
            >
              <i class="bi bi-house-door nav-icon"></i>
              <span v-if="!sidebarCollapsed || showMobileSidebar" class="nav-text">Dashboard</span>
              <div v-if="sidebarCollapsed && !showMobileSidebar" class="nav-tooltip">Dashboard</div>
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'mantenimiento' }]"
              @click="setCurrentView('mantenimiento')"
              :title="sidebarCollapsed ? 'Mantenimiento' : ''"
            >
              <i class="bi bi-tools nav-icon"></i>
              <span v-if="!sidebarCollapsed || showMobileSidebar" class="nav-text">Mantenimiento</span>
              <span v-if="actividadesPendientes > 0 && (!sidebarCollapsed || showMobileSidebar)" class="nav-badge">
                {{ actividadesPendientes }}
              </span>
              <div v-if="sidebarCollapsed && !showMobileSidebar" class="nav-tooltip">
                Mantenimiento
                <span v-if="actividadesPendientes > 0" class="tooltip-badge">{{ actividadesPendientes }}</span>
              </div>
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'calendario' }]"
              @click="setCurrentView('calendario')"
              :title="sidebarCollapsed ? 'Calendario' : ''"
            >
              <i class="bi bi-calendar3 nav-icon"></i>
              <span v-if="!sidebarCollapsed || showMobileSidebar" class="nav-text">Calendario</span>
              <div v-if="sidebarCollapsed && !showMobileSidebar" class="nav-tooltip">Calendario</div>
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="#" 
              :class="['nav-link', { 'nav-link--active': currentView === 'avisos' }]"
              @click="setCurrentView('avisos')"
              :title="sidebarCollapsed ? 'Avisos' : ''"
            >
              <i class="bi bi-megaphone nav-icon"></i>
              <span v-if="!sidebarCollapsed || showMobileSidebar" class="nav-text">Avisos</span>
              <div v-if="sidebarCollapsed && !showMobileSidebar" class="nav-tooltip">Avisos</div>
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
          :title="sidebarCollapsed ? 'Cerrar Sesión' : ''"
        >
          <i class="bi bi-box-arrow-right nav-icon"></i>
          <span v-if="!sidebarCollapsed || showMobileSidebar" class="nav-text">Cerrar Sesión</span>
          <div v-if="sidebarCollapsed && !showMobileSidebar" class="nav-tooltip">Cerrar Sesión</div>
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
    <main class="main-content" :class="{ 'main-content--sidebar-collapsed': sidebarCollapsed }">
      <!-- Dashboard View -->
      <div v-if="currentView === 'dashboard'" class="dashboard">
        <div class="dashboard-header">
          <div class="welcome-section">
            <h2 class="welcome-title">Bienvenido, {{ usuario.nombre }}</h2>
            <p class="welcome-date">
              <i class="bi bi-calendar3 me-2"></i>
              {{ fechaActual }}
            </p>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="summary-cards">
          <tarjeta-resumen 
            titulo="Actividades Pendientes"
            :valor="actividadesPendientes.toString()"
            icono="bi-clock"
            color="warning"
          />
          <tarjeta-resumen 
            titulo="Próximas Actividades"
            :valor="proximasActividades.toString()"
            icono="bi-calendar-event"
            color="info"
          />
          <tarjeta-resumen 
            titulo="Avisos Publicados"
            :valor="avisosPublicados.toString()"
            icono="bi-megaphone"
            color="success"
          />
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-card">
          <div class="card-header">
            <h5 class="card-title">
              <i class="bi bi-lightning me-2"></i>
              Accesos Rápidos
            </h5>
          </div>
          <div class="card-body">
            <div class="quick-actions-grid">
              <button class="quick-action-btn quick-action-btn--primary" @click="setCurrentView('crear-actividad')">
                <i class="bi bi-plus-circle"></i>
                <span>Crear Actividad</span>
              </button>
              <button class="quick-action-btn quick-action-btn--outline" @click="setCurrentView('mantenimiento')">
                <i class="bi bi-list-check"></i>
                <span>Ver Actividades</span>
              </button>
              <button class="quick-action-btn quick-action-btn--outline" @click="setCurrentView('crear-aviso')">
                <i class="bi bi-megaphone"></i>
                <span>Crear Aviso</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="dashboard-bottom">
          <div class="activity-section">
            <actividades-asignadas />
          </div>
        </div>
      </div>

      <!-- Other Views -->
      <mantenimiento v-else-if="currentView === 'mantenimiento'" @back="setCurrentView('dashboard')" />
      <calendario v-else-if="currentView === 'calendario'" @back="setCurrentView('dashboard')" />
      <avisos v-else-if="currentView === 'avisos'" @back="setCurrentView('dashboard')" />
      <crear-actividad v-else-if="currentView === 'crear-actividad'" @back="setCurrentView('dashboard')" @created="onActividadCreated" />
      <crear-aviso v-else-if="currentView === 'crear-aviso'" @back="setCurrentView('dashboard')" @created="onAvisoCreated" />
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
import { ref, computed, nextTick } from 'vue'
import tarjetaResumen from '../propietario/components/tarjetaResumen.vue'
import actividadesAsignadas from './components/actividadesAsignadas.vue'
import mantenimiento from './views/mantenimiento.vue'
import calendario from './views/calendario.vue'
import avisos from './views/avisos.vue'
import crearActividad from './views/crearAtividad.vue'
import crearAviso from './views/crearAviso.vue'

const showMobileSidebar = ref(false)
const sidebarCollapsed = ref(false)
const currentView = ref('dashboard')
const actividadesPendientes = ref(5)
const proximasActividades = ref(3)
const avisosPublicados = ref(12)

// Toast notifications
const toasts = ref([])
let toastId = 0

const usuario = ref({
  nombre: 'Carlos Rodríguez',
  cargo: 'Operador de Mantenimiento'
})

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
}

const toggleDesktopSidebar = async () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  await nextTick()
  window.dispatchEvent(new Event('resize'))
}

const setCurrentView = (view) => {
  currentView.value = view
  showMobileSidebar.value = false
  showToast(`Navegando a ${getViewName(view)}`, 'info')
}

const getViewName = (view) => {
  const names = {
    dashboard: 'Dashboard',
    mantenimiento: 'Mantenimiento',
    calendario: 'Calendario',
    avisos: 'Avisos',
    'crear-actividad': 'Crear Actividad',
    'crear-aviso': 'Crear Aviso'
  }
  return names[view] || view
}

const onActividadCreated = () => {
  actividadesPendientes.value++
  showToast('Actividad creada exitosamente', 'success')
  setCurrentView('mantenimiento')
}

const onAvisoCreated = () => {
  avisosPublicados.value++
  showToast('Aviso publicado exitosamente', 'success')
  setCurrentView('avisos')
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
// Reutilizamos los mismos estilos del módulo de propietario
.operador-layout {
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
    
    &.sidebar--collapsed {
      width: 80px;
      
      .sidebar-user {
        padding: 1rem 0.5rem;
        justify-content: center;
        
        .user-info {
          display: none;
        }
      }
    }
  }
}

.sidebar-toggle {
  position: absolute;
  top: 1rem;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: var(--color-fondo);
  border: 2px solid var(--color-primario);
  border-radius: 50%;
  color: var(--color-primario);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: var(--color-primario);
    color: var(--color-fondo);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
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
  
  .sidebar--collapsed & {
    justify-content: center;
    padding: 0.75rem;
  }
  
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

.nav-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--color-oscuro);
  color: var(--color-fondo);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: var(--color-oscuro);
  }
  
  .tooltip-badge {
    background-color: var(--color-peligro);
    color: var(--color-fondo);
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    border-radius: 8px;
    margin-left: 0.5rem;
  }
}

.nav-item:hover .nav-tooltip {
  opacity: 1;
  visibility: visible;
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
    
    &.main-content--sidebar-collapsed {
      margin-left: 80px;
    }
  }
}

// Dashboard
.dashboard {
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.dashboard-header {
  margin-bottom: 2rem;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.welcome-title {
  font-size: var(--font-size-h2);
  color: var(--color-primario);
  margin: 0;
  font-weight: 600;
}

.welcome-date {
  color: var(--color-oscuro);
  margin: 0;
  opacity: 0.7;
  display: flex;
  align-items: center;
}

// Summary Cards
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

// Quick Actions
.quick-actions-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  .card-header {
    padding: 1.5rem 1.5rem 0;
    border-bottom: none;
  }
  
  .card-title {
    color: var(--color-primario);
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  i {
    font-size: 1.5rem;
    transition: all 0.2s ease;
  }
  
  span {
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  &.quick-action-btn--primary {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    color: var(--color-fondo);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(18, 77, 181, 0.3);
      
      i {
        transform: scale(1.1);
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &.quick-action-btn--outline {
    border-color: var(--color-primario);
    color: var(--color-primario);
    
    &:hover {
      background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
      color: var(--color-fondo);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(18, 77, 181, 0.2);
      
      i {
        transform: scale(1.1);
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

// Dashboard Bottom
.dashboard-bottom {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.activity-section {
  min-height: 400px;
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
