<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="/src/assets/Logo.png" alt="Logo" class="logo">
        <h2>Admin Panel</h2>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li>
            <button 
              @click="currentView = 'dashboard'" 
              :class="{ active: currentView === 'dashboard' }"
              class="nav-button"
            >
              <i class="fas fa-tachometer-alt"></i>
              Dashboard
            </button>
          </li>
          <li>
            <button 
              @click="currentView = 'usuarios'" 
              :class="{ active: currentView === 'usuarios' }"
              class="nav-button"
            >
              <i class="fas fa-users"></i>
              Usuarios
            </button>
          </li>
          <li>
            <button 
              @click="currentView = 'propiedades'" 
              :class="{ active: currentView === 'propiedades' }"
              class="nav-button"
            >
              <i class="fas fa-building"></i>
              Propiedades
            </button>
          </li>
          <li>
            <button 
              @click="currentView = 'finanzas'" 
              :class="{ active: currentView === 'finanzas' }"
              class="nav-button"
            >
              <i class="fas fa-dollar-sign"></i>
              Finanzas
            </button>
          </li>
          <li>
            <button 
              @click="currentView = 'mantenimiento'" 
              :class="{ active: currentView === 'mantenimiento' }"
              class="nav-button"
            >
              <i class="fas fa-tools"></i>
              Mantenimiento
            </button>
          </li>
          <li>
            <button 
              @click="currentView = 'avisos'" 
              :class="{ active: currentView === 'avisos' }"
              class="nav-button"
            >
              <i class="fas fa-bullhorn"></i>
              Avisos
            </button>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <header class="main-header">
        <h1>{{ getViewTitle() }}</h1>
        <div class="user-info">
          <span>Administrador</span>
          <div class="user-avatar">
            <i class="fas fa-user-shield"></i>
          </div>
        </div>
      </header>

      <div class="content-area">
        <!-- Dashboard -->
        <DashboardView v-if="currentView === 'dashboard'" />
        
        <!-- Usuarios -->
        <UsuariosView v-if="currentView === 'usuarios'" />
        
        <!-- Propiedades -->
        <PropiedadesView v-if="currentView === 'propiedades'" />
        
        <!-- Finanzas -->
        <FinanzasView v-if="currentView === 'finanzas'" />
        
        <!-- Mantenimiento -->
        <MantenimientoView v-if="currentView === 'mantenimiento'" />
        
        <!-- Avisos -->
        <AvisosView v-if="currentView === 'avisos'" />
      </div>
    </div>
  </div>
</template>

<script>
import DashboardView from './views/dashboard.vue'
import UsuariosView from './views/usuarios.vue'
import PropiedadesView from './views/propiedades.vue'
import FinanzasView from './views/finanzas.vue'
import MantenimientoView from './views/mantenimiento.vue'
import AvisosView from './views/avisos.vue'

export default {
  name: 'AdminModule',
  components: {
    DashboardView,
    UsuariosView,
    PropiedadesView,
    FinanzasView,
    MantenimientoView,
    AvisosView
  },
  data() {
    return {
      currentView: 'dashboard'
    }
  },
  methods: {
    getViewTitle() {
      const titles = {
        dashboard: 'Dashboard',
        usuarios: 'Gestión de Usuarios',
        propiedades: 'Gestión de Propiedades',
        finanzas: 'Gestión Financiera',
        mantenimiento: 'Gestión de Mantenimiento',
        avisos: 'Centro de Avisos'
      }
      return titles[this.currentView] || 'Dashboard'
    },
    logout() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background: #f8fafc;
}

.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  border-radius: 50%;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 0.5rem;
}

.nav-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
}

.nav-button:hover {
  background: rgba(255,255,255,0.1);
  padding-left: 2rem;
}

.nav-button.active {
  background: rgba(255,255,255,0.2);
  border-right: 4px solid white;
}

.nav-button i {
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.logout-btn {
  width: 100%;
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.2);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.main-header h1 {
  margin: 0;
  color: #1a202c;
  font-size: 1.875rem;
  font-weight: 700;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .sidebar-nav {
    display: none;
  }
  
  .main-content {
    flex: 1;
  }
}
</style>
