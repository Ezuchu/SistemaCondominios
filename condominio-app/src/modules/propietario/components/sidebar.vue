<template>
  <!-- Nueva Sidebar para desktop -->
  <nav :class="['sidebar', { collapsed }]">
    <button class="toggle-btn" @click="toggleSidebar">
      <img src="@/assets/flecha-izquierda.png" alt="Toggle Sidebar">
    </button>

    <div class="p-2 text-center">
      <h4 class="text-white">ISLAND WINDS</h4>
    </div>

    <div class="nav flex-column">
      <router-link to="/propietario" class="sidebar-link active text-decoration-none p-3">
        <i class="fas fa-home me-3"></i>
        <span class="hide-on-collapse">Inicio</span>
      </router-link>
      <router-link to="/propietario/pagos" class="sidebar-link text-decoration-none p-3">
        <i class="fas fa-chart-bar me-3"></i>
        <span class="hide-on-collapse">Mis Pagos</span>
      </router-link>
      <router-link to="/propietario/estados-cuenta" class="sidebar-link text-decoration-none p-3">
        <i class="fas fa-users me-3"></i>
        <span class="hide-on-collapse">Estados de Cuenta</span>
      </router-link>
      <router-link to="/propietario/avisos" class="sidebar-link text-decoration-none p-3">
        <i class="fas fa-box me-3"></i>
        <span class="hide-on-collapse">Avisos</span>
      </router-link>
      <router-link to="/propietario/perfil" class="sidebar-link text-decoration-none p-3">
        <i class="fas fa-gear me-3"></i>
        <span class="hide-on-collapse">Mi Perfil</span>
      </router-link>
      <router-link to="/" class="sidebar-link text-danger text-decoration-none p-3">
        <i class="fas fa-sign-out-alt me-3"></i>
        <span class="hide-on-collapse">Cerrar Sesión</span>
      </router-link>
    </div>

    <div class="profile-section mt-auto p-4">
      <div class="d-flex align-items-center">
        <img src="https://randomuser.me/api/portraits/men/25.jpg" style="height:60px" class="rounded-circle" alt="Profile">
        <div class="ms-3 profile-info">
          <h6 class="text-white mb-0">Jorge Nitales </h6>
          <small class="text-muted">Propietario</small>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const collapsed = ref(false)
function toggleSidebar() {
  collapsed.value = !collapsed.value
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';

:root {
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 1000px;
}

body {
  overflow-x: hidden;
}

.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: linear-gradient(135deg, $color-primario 0%, $color-secundario 100%);
  transition: all 0.3s ease;
  color: $color-claro;
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;

  &.collapsed {
    width: var(--sidebar-width-collapsed);
  }
}

@media screen and (max-width: 768px) {
  .logo {
    width: 8rem;
    // height se ajusta automáticamente por aspect-ratio
  }
}

.toggle-btn {
  position: absolute;
  right: -15px;
  top: 20px;
  background: $color-claro;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 100;
  cursor: pointer;
  transition: transform 0.3s ease;
  color: $color-primario;

  &.collapsed {
    transform: rotate(180deg);
  }
}

.logo-text {
  background: linear-gradient(45deg, $color-informativo, $color-secundario);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity 0.3s ease;

  &.collapsed {
    opacity: 0;
  }
}

.sidebar-link {
  color: $color-azul-claro;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 16px;
  white-space: nowrap;
  overflow: hidden;
  font-weight: $peso-h1;
  padding: 10px 18px;

  &:hover {
    color: $color-claro;
    background: rgba($color-claro, 0.1);
    transform: translateX(5px);
  }
  &.active, &.router-link-active {
    color: $color-claro;
    background: rgba($color-claro, 0.1);
  }

  &.collapsed {
    text-align: center;
    padding: 1rem !important;
    margin: 4px 8px;

    i {
      margin: 0 !important;
    }
  }
}

.notification-badge {
  background: $color-peligro;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.7rem;
}

.profile-section {
  border-top: 1px solid rgba($color-claro, 0.1);
}

.main-content {
  margin-left: var(--sidebar-width);
  background-color: $color-fondo;
  min-height: 100vh;
  padding: 20px;
  transition: all 0.3s ease;

  &.collapsed {
    margin-left: var(--sidebar-width-collapsed);
  }
}

.sidebar.collapsed .hide-on-collapse {
  opacity: 0;
  visibility: hidden;
}

.sidebar.collapsed .profile-info {
  opacity: 0;
}

.sidebar.collapsed .sidebar-link {
  text-align: center;
  padding: 1rem !important;
  margin: 4px 8px;
}

.sidebar.collapsed .sidebar-link i {
  margin: 0 !important;
}

.profile-info {
  transition: opacity 0.2s ease;
}
</style>