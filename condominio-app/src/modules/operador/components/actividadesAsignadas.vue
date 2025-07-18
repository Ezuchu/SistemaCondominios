<template>
  <div class="actividades-asignadas-card">
    <div class="card-header">
      <h5 class="card-title">
        <i class="bi bi-list-check me-2"></i>
        Actividades Asignadas
      </h5>
      <button class="btn btn-outline btn-sm" @click="$emit('verTodas')">
        <i class="bi bi-eye me-2"></i>
        <span class="d-none d-sm-inline">Ver Todas</span>
      </button>
    </div>
    
    <div class="card-body">
      <!-- Mobile Cards View -->
      <div class="actividades-mobile d-md-none">
        <div v-for="actividad in actividadesRecientes" :key="actividad.id" class="actividad-card-mobile">
          <div class="actividad-header-mobile">
            <div class="actividad-info">
              <h6 class="actividad-titulo">{{ actividad.nombre }}</h6>
              <small class="actividad-area">{{ actividad.area }}</small>
            </div>
            <span :class="['estado-badge', `estado-badge--${getEstadoColor(actividad.estado)}`]">
              {{ actividad.estado }}
            </span>
          </div>
          
          <div class="actividad-details-mobile">
            <div class="detail-row">
              <span class="detail-label">Fecha:</span>
              <span class="detail-value">{{ formatearFecha(actividad.fechaProgramada) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prioridad:</span>
              <span :class="['detail-value', `prioridad--${actividad.prioridad}`]">
                {{ actividad.prioridad }}
              </span>
            </div>
          </div>
          
          <div class="actividad-actions-mobile">
            <button class="action-btn action-btn--view" @click="verDetalle(actividad.id)" title="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button 
              v-if="actividad.estado === 'pendiente'"
              class="action-btn action-btn--complete" 
              @click="marcarCompletada(actividad.id)" 
              title="Marcar como completada"
            >
              <i class="bi bi-check-circle"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="actividades-desktop d-none d-md-block">
        <div class="table-responsive">
          <table class="actividades-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Área</th>
                <th>Fecha Programada</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="actividad in actividadesRecientes" :key="actividad.id" class="actividad-row">
                <td>
                  <div class="actividad-cell">
                    <div class="actividad-nombre">{{ actividad.nombre }}</div>
                    <small class="actividad-descripcion">{{ actividad.descripcion }}</small>
                  </div>
                </td>
                <td>{{ actividad.area }}</td>
                <td>{{ formatearFecha(actividad.fechaProgramada) }}</td>
                <td>
                  <span :class="['estado-badge', `estado-badge--${getEstadoColor(actividad.estado)}`]">
                    {{ actividad.estado }}
                  </span>
                </td>
                <td>
                  <span :class="['prioridad-badge', `prioridad-badge--${actividad.prioridad}`]">
                    {{ actividad.prioridad }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button class="action-btn action-btn--view" @click="verDetalle(actividad.id)" title="Ver detalle">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      v-if="actividad.estado === 'pendiente'"
                      class="action-btn action-btn--complete" 
                      @click="marcarCompletada(actividad.id)" 
                      title="Marcar como completada"
                    >
                      <i class="bi bi-check-circle"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="actividadesRecientes.length === 0" class="empty-state">
        <i class="bi bi-list-check"></i>
        <h6>No hay actividades asignadas</h6>
        <p>Las nuevas actividades aparecerán aquí</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['verTodas'])

const actividadesRecientes = ref([
  {
    id: 1,
    nombre: 'Mantenimiento de Ascensores',
    descripcion: 'Revisión mensual de todos los ascensores',
    area: 'Ascensores',
    fechaProgramada: '2024-01-20',
    estado: 'pendiente',
    prioridad: 'alta'
  },
  {
    id: 2,
    nombre: 'Limpieza de Piscina',
    descripcion: 'Limpieza semanal y revisión de químicos',
    area: 'Piscina',
    fechaProgramada: '2024-01-18',
    estado: 'en-progreso',
    prioridad: 'media'
  },
  {
    id: 3,
    nombre: 'Revisión Sistema Eléctrico',
    descripcion: 'Inspección de tableros eléctricos',
    area: 'Instalaciones Eléctricas',
    fechaProgramada: '2024-01-22',
    estado: 'pendiente',
    prioridad: 'alta'
  },
  {
    id: 4,
    nombre: 'Jardinería',
    descripción: 'Poda y mantenimiento de áreas verdes',
    area: 'Jardines',
    fechaProgramada: '2024-01-19',
    estado: 'completada',
    prioridad: 'baja'
  }
])

const getEstadoColor = (estado) => {
  const colores = {
    pendiente: 'warning',
    'en-progreso': 'info',
    completada: 'success',
    cancelada: 'danger'
  }
  return colores[estado] || 'secondary'
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

const verDetalle = (id) => {
  console.log('Ver detalle de actividad:', id)
}

const marcarCompletada = (id) => {
  const actividad = actividadesRecientes.value.find(a => a.id === id)
  if (actividad) {
    actividad.estado = 'completada'
  }
  console.log('Actividad marcada como completada:', id)
}
</script>

<style scoped lang="scss">
.actividades-asignadas-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.card-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.card-body {
  padding: 1.5rem;
}

// Mobile Cards
.actividades-mobile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.actividad-card-mobile {
  background: var(--color-claro);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
    transform: translateX(4px);
  }
}

.actividad-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.actividad-info {
  flex: 1;
  min-width: 0;
}

.actividad-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-oscuro);
  margin: 0 0 0.25rem 0;
}

.actividad-area {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.8rem;
}

.actividad-details-mobile {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.detail-label {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.9rem;
}

.detail-value {
  color: var(--color-oscuro);
  font-weight: 500;
  font-size: 0.9rem;
  
  &.prioridad--alta {
    color: var(--color-peligro);
  }
  
  &.prioridad--media {
    color: var(--color-naranja);
  }
  
  &.prioridad--baja {
    color: var(--color-éxito);
  }
}

.actividad-actions-mobile {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

// Desktop Table
.actividades-desktop {
  overflow-x: auto;
}

.table-responsive {
  border-radius: 0.5rem;
  overflow: hidden;
}

.actividades-table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    background-color: var(--color-claro);
    color: var(--color-primario);
    font-weight: 600;
    padding: 1rem;
    text-align: left;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
  }
  
  td {
    padding: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    color: var(--color-oscuro);
    font-size: 0.9rem;
  }
}

.actividad-row {
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
  }
}

.actividad-cell {
  .actividad-nombre {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .actividad-descripcion {
    opacity: 0.7;
    font-size: 0.8rem;
  }
}

// Estado Badge
.estado-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 500;
  text-transform: capitalize;
  
  &.estado-badge--success {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--color-éxito);
  }
  
  &.estado-badge--warning {
    background-color: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.estado-badge--info {
    background-color: var(--color-azul-claro);
    color: var(--color-informativo);
  }
  
  &.estado-badge--danger {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
  }
}

// Prioridad Badge
.prioridad-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 500;
  text-transform: capitalize;
  
  &.prioridad-badge--alta {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
  }
  
  &.prioridad-badge--media {
    background-color: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.prioridad-badge--baja {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--color-éxito);
  }
}

// Action Buttons
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &.action-btn--view {
    background-color: var(--color-azul-claro);
    color: var(--color-primario);
    
    &:hover {
      background-color: var(--color-primario);
      color: var(--color-fondo);
    }
  }
  
  &.action-btn--complete {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--color-éxito);
    
    &:hover {
      background-color: var(--color-éxito);
      color: var(--color-fondo);
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
}

// Empty State
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--color-oscuro);
  
  i {
    font-size: 3rem;
    opacity: 0.3;
    margin-bottom: 1rem;
    display: block;
  }
  
  h6 {
    margin-bottom: 0.5rem;
  }
  
  p {
    opacity: 0.7;
    margin: 0;
  }
}

// Button Styles
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  &.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
  
  &.btn-outline {
    background: none;
    border: 2px solid var(--color-primario);
    color: var(--color-primario);
    
    &:hover {
      background-color: var(--color-primario);
      color: var(--color-fondo);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>
