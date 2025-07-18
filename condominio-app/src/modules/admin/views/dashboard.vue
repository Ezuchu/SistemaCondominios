<template>
  <div class="dashboard">
    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon pending">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="kpi-content">
          <h3>Cuentas por Cobrar</h3>
          <p class="kpi-value">{{ kpis.cuentasPendientes }}</p>
          <span class="kpi-label">Pendientes</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon maintenance">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="kpi-content">
          <h3>Próximas Actividades</h3>
          <p class="kpi-value">{{ kpis.proximasActividades }}</p>
          <span class="kpi-label">Esta semana</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon properties">
          <i class="fas fa-building"></i>
        </div>
        <div class="kpi-content">
          <h3>Total Propiedades</h3>
          <p class="kpi-value">{{ kpis.totalPropiedades }}</p>
          <span class="kpi-label">Registradas</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon payments">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="kpi-content">
          <h3>Últimos Pagos</h3>
          <p class="kpi-value">${{ kpis.ultimosPagos.toLocaleString() }}</p>
          <span class="kpi-label">Este mes</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2>Acciones Rápidas</h2>
      <div class="actions-grid">
        <button class="action-btn" @click="navigateTo('usuarios')">
          <i class="fas fa-user-plus"></i>
          <span>Agregar Usuario</span>
        </button>
        <button class="action-btn" @click="navigateTo('propiedades')">
          <i class="fas fa-plus-square"></i>
          <span>Nueva Propiedad</span>
        </button>
        <button class="action-btn" @click="navigateTo('finanzas')">
          <i class="fas fa-file-invoice-dollar"></i>
          <span>Generar Cuenta</span>
        </button>
        <button class="action-btn" @click="navigateTo('mantenimiento')">
          <i class="fas fa-calendar-plus"></i>
          <span>Programar Mantenimiento</span>
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <h2>Actividad Reciente</h2>
      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon" :class="activity.type">
            <i :class="activity.icon"></i>
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.description }}</p>
            <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      kpis: {
        cuentasPendientes: 15,
        proximasActividades: 8,
        totalPropiedades: 124,
        ultimosPagos: 45600
      },
      recentActivities: [
        {
          id: 1,
          type: 'payment',
          icon: 'fas fa-money-bill',
          description: 'Pago registrado - Apartamento 301',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 2,
          type: 'user',
          icon: 'fas fa-user-plus',
          description: 'Nuevo usuario registrado - Juan Pérez',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 3,
          type: 'maintenance',
          icon: 'fas fa-tools',
          description: 'Mantenimiento completado - Piscina',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          id: 4,
          type: 'notice',
          icon: 'fas fa-bullhorn',
          description: 'Nuevo aviso publicado - Reunión de consorcio',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      ]
    }
  },
  methods: {
    navigateTo(section) {
      this.$emit('navigate', section)
    },
    formatTime(timestamp) {
      const now = new Date()
      const diff = now - timestamp
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor(diff / (1000 * 60))
      
      if (hours > 0) {
        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
      } else {
        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.kpi-icon.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.kpi-icon.maintenance {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.kpi-icon.properties {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.kpi-icon.payments {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.kpi-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.kpi-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
}

.kpi-label {
  font-size: 0.75rem;
  color: #64748b;
}

.quick-actions, .recent-activity {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.quick-actions h2, .recent-activity h2 {
  margin: 0 0 1.5rem 0;
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.action-btn i {
  font-size: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #e2e8f0;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.activity-icon.payment {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.activity-icon.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.activity-icon.maintenance {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.activity-icon.notice {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  color: #1a202c;
  font-weight: 500;
}

.activity-time {
  font-size: 0.75rem;
  color: #64748b;
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-btn {
    padding: 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
