<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="bi bi-speedometer2"></i>
          Dashboard Administrativo
        </h1>
        <p class="page-subtitle">Panel de control y estadísticas generales</p>
      </div>
      <div class="header-actions">
        <button class="btn-refresh" @click="refreshData">
          <i class="bi bi-arrow-clockwise"></i>
          <span class="btn-text">Actualizar</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-card--users">
        <div class="stat-icon">
          <i class="bi bi-people"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalUsers }}</div>
          <div class="stat-label">Total Usuarios</div>
          <div class="stat-change positive">
            <i class="bi bi-arrow-up"></i>
            +5% este mes
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--properties">
        <div class="stat-icon">
          <i class="bi bi-building"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalProperties }}</div>
          <div class="stat-label">Propiedades</div>
          <div class="stat-change neutral">
            <i class="bi bi-dash"></i>
            Sin cambios
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--payments">
        <div class="stat-icon">
          <i class="bi bi-cash-stack"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${{ formatCurrency(stats.monthlyRevenue) }}</div>
          <div class="stat-label">Ingresos del Mes</div>
          <div class="stat-change positive">
            <i class="bi bi-arrow-up"></i>
            +12% vs mes anterior
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--maintenance">
        <div class="stat-icon">
          <i class="bi bi-tools"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingMaintenance }}</div>
          <div class="stat-label">Mantenimientos Pendientes</div>
          <div class="stat-change negative">
            <i class="bi bi-arrow-down"></i>
            -3 esta semana
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Tables Row -->
    <div class="content-grid">
      <!-- Revenue Chart -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="bi bi-bar-chart"></i>
            Ingresos Mensuales
          </h3>
          <div class="card-actions">
            <select v-model="chartPeriod" class="period-select">
              <option value="6">Últimos 6 meses</option>
              <option value="12">Último año</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 80%"></div>
              <div class="bar" style="height: 45%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 70%"></div>
              <div class="bar" style="height: 85%"></div>
            </div>
            <div class="chart-labels">
              <span>Ene</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="activity-card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="bi bi-clock-history"></i>
            Actividades Recientes
          </h3>
          <button class="btn-link" @click="viewAllActivities">
            Ver todas
          </button>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-description">{{ activity.description }}</div>
              <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3 class="section-title">
        <i class="bi bi-lightning"></i>
        Acciones Rápidas
      </h3>
      <div class="actions-grid">
        <button @click="navigateTo('usuarios')" class="action-btn action-btn--users">
          <div class="action-icon">
            <i class="bi bi-person-plus"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Agregar Usuario</div>
            <div class="action-description">Crear nuevo usuario del sistema</div>
          </div>
        </button>

        <button @click="navigateTo('propiedades')" class="action-btn action-btn--properties">
          <div class="action-icon">
            <i class="bi bi-building-add"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Nueva Propiedad</div>
            <div class="action-description">Registrar nueva propiedad</div>
          </div>
        </button>

        <button @click="navigateTo('finanzas')" class="action-btn action-btn--finance">
          <div class="action-icon">
            <i class="bi bi-file-earmark-plus"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Generar Factura</div>
            <div class="action-description">Crear nueva cuenta por cobrar</div>
          </div>
        </button>

        <button @click="navigateTo('mantenimiento')" class="action-btn action-btn--maintenance">
          <div class="action-icon">
            <i class="bi bi-calendar-plus"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Programar Mantenimiento</div>
            <div class="action-description">Agendar nueva actividad</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['navigate'])

const chartPeriod = ref('6')

const stats = ref({
  totalUsers: 156,
  totalProperties: 89,
  monthlyRevenue: 245000,
  pendingMaintenance: 12
})

const recentActivities = ref([
  {
    id: 1,
    type: 'user',
    icon: 'bi bi-person-plus',
    title: 'Nuevo usuario registrado',
    description: 'María González se registró como propietaria',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    type: 'payment',
    icon: 'bi bi-cash',
    title: 'Pago recibido',
    description: 'Cuota de condominio - Apto 301-A',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 3,
    type: 'maintenance',
    icon: 'bi bi-tools',
    title: 'Mantenimiento completado',
    description: 'Limpieza de piscina finalizada',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
  },
  {
    id: 4,
    type: 'notice',
    icon: 'bi bi-megaphone',
    title: 'Nuevo aviso publicado',
    description: 'Reunión de propietarios - Enero 2024',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6)
  }
])

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES').format(amount)
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `Hace ${minutes} minutos`
  } else if (hours < 24) {
    return `Hace ${hours} horas`
  } else {
    return `Hace ${days} días`
  }
}

const navigateTo = (view) => {
  emit('navigate', view)
}

const refreshData = () => {
  // Simulate data refresh
  console.log('Actualizando datos...')
}

const viewAllActivities = () => {
  // Navigate to maintenance section to view all activities
  emit('navigate', 'mantenimiento')
}

onMounted(() => {
  // Initialize dashboard data
})
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 2rem;
  background: var(--color-claro);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Header
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-primario);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  i {
    font-size: 1.75rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    i {
      font-size: 1.25rem;
    }
  }
}

.page-subtitle {
  color: var(--color-oscuro);
  opacity: 0.7;
  margin: 0;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
}

.header-actions {
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.btn-refresh {
  background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  color: var(--color-fondo);
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  min-width: fit-content;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(18, 77, 181, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 1rem;
    box-shadow: 0 4px 16px rgba(18, 77, 181, 0.2);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(18, 77, 181, 0.3);
    }
  }
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: center;
    padding: 1.125rem 2rem;
    font-size: 1.05rem;
    
    .btn-text {
      display: inline;
    }
  }
  
  @media (max-width: 480px) {
    .btn-text {
      display: none;
    }
    
    i {
      font-size: 1.25rem;
    }
    
    padding: 1rem;
    width: auto;
    min-width: 60px;
    height: 60px;
    border-radius: 50%;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 100;
    box-shadow: 0 8px 24px rgba(18, 77, 181, 0.4);
  }
}

// Stats Grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.stat-card {
  background: var(--color-fondo);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 1.25rem;
  }
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--color-fondo);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 1.75rem;
    border-radius: 1rem;
  }
  
  .stat-card--users & {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  }
  
  .stat-card--properties & {
    background: linear-gradient(135deg, var(--color-éxito), #4caf50);
  }
  
  .stat-card--payments & {
    background: linear-gradient(135deg, var(--color-naranja), #ff9800);
  }
  
  .stat-card--maintenance & {
    background: linear-gradient(135deg, var(--color-informativo), #2196f3);
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-oscuro);
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2rem;
  }
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-oscuro);
  opacity: 0.7;
  font-weight: 500;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.stat-change {
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  &.positive {
    color: var(--color-éxito);
  }
  
  &.negative {
    color: var(--color-peligro);
  }
  
  &.neutral {
    color: var(--color-oscuro);
    opacity: 0.6;
  }
}

// Content Grid
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.chart-card,
.activity-card {
  background: var(--color-fondo);
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  @media (max-width: 768px) {
    border-radius: 1.25rem;
  }
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
}

.card-title {
  color: var(--color-primario);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
}

.period-select {
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  background: var(--color-claro);
  font-size: 0.85rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.625rem;
  }
}

.btn-link {
  background: none;
  border: none;
  color: var(--color-primario);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
}

// Chart
.chart-container {
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    height: 180px;
  }
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 160px;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    height: 140px;
    gap: 0.75rem;
  }
}

.bar {
  flex: 1;
  background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  border-radius: 4px 4px 0 0;
  min-height: 20px;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  padding: 0 1rem;
  font-size: 0.8rem;
  color: var(--color-oscuro);
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
}

// Activities
.activity-list {
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    max-height: 350px;
  }
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: var(--color-claro);
  }
  
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.125rem;
    gap: 1.25rem;
  }
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-fondo);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.125rem;
  }
  
  &.user {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  }
  
  &.payment {
    background: linear-gradient(135deg, var(--color-éxito), #4caf50);
  }
  
  &.maintenance {
    background: linear-gradient(135deg, var(--color-naranja), #ff9800);
  }
  
  &.notice {
    background: linear-gradient(135deg, var(--color-informativo), #2196f3);
  }
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-weight: 600;
  color: var(--color-oscuro);
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
}

.activity-description {
  font-size: 0.85rem;
  color: var(--color-oscuro);
  opacity: 0.7;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
}

.activity-time {
  font-size: 0.75rem;
  color: var(--color-oscuro);
  opacity: 0.5;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
}

// Quick Actions
.quick-actions {
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    margin-bottom: 6rem; // Space for floating refresh button
  }
}

.section-title {
  color: var(--color-primario);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.action-btn {
  background: var(--color-fondo);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 1.25rem;
    gap: 1.25rem;
  }
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--color-fondo);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    border-radius: 1rem;
  }
  
  .action-btn--users & {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  }
  
  .action-btn--properties & {
    background: linear-gradient(135deg, var(--color-éxito), #4caf50);
  }
  
  .action-btn--finance & {
    background: linear-gradient(135deg, var(--color-naranja), #ff9800);
  }
  
  .action-btn--maintenance & {
    background: linear-gradient(135deg, var(--color-informativo), #2196f3);
  }
}

.action-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  color: var(--color-oscuro);
  margin-bottom: 0.25rem;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
}

.action-description {
  font-size: 0.85rem;
  color: var(--color-oscuro);
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
}
</style>
