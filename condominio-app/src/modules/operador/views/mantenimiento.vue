<template>
  <div class="mantenimiento-view">
    <!-- Header -->
    <div class="view-header">
      <button class="back-btn d-lg-none" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="view-title">Mis Actividades de Mantenimiento</h2>
        <p class="view-subtitle">Gestiona tus actividades asignadas</p>
      </div>
      <button class="btn btn-primary" @click="$emit('crear')">
        <i class="bi bi-plus-circle me-2"></i>
        Nueva Actividad
      </button>
    </div>

    <!-- Filters Card -->
    <div class="filters-card">
      <div class="filters-header">
        <h6 class="filters-title">
          <i class="bi bi-funnel me-2"></i>
          Filtros
        </h6>
        <button class="filters-toggle d-md-none" @click="toggleFilters">
          <i :class="showFilters ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
        </button>
      </div>
      
      <div class="filters-content" :class="{ 'filters-content--show': showFilters }">
        <div class="filters-grid">
          <!-- Estado -->
          <div class="filter-group">
            <label class="filter-label">Estado</label>
            <div class="select-wrapper">
              <select class="filter-select" v-model="filtros.estado">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en-progreso">En Progreso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
              <i class="bi bi-chevron-down select-arrow"></i>
            </div>
          </div>
          
          <!-- Área -->
          <div class="filter-group">
            <label class="filter-label">Área</label>
            <div class="select-wrapper">
              <select class="filter-select" v-model="filtros.area">
                <option value="">Todas las áreas</option>
                <option value="Ascensores">Ascensores</option>
                <option value="Piscina">Piscina</option>
                <option value="Jardines">Jardines</option>
                <option value="Instalaciones Eléctricas">Instalaciones Eléctricas</option>
                <option value="Plomería">Plomería</option>
              </select>
              <i class="bi bi-chevron-down select-arrow"></i>
            </div>
          </div>
          
          <!-- Prioridad -->
          <div class="filter-group">
            <label class="filter-label">Prioridad</label>
            <div class="select-wrapper">
              <select class="filter-select" v-model="filtros.prioridad">
                <option value="">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <i class="bi bi-chevron-down select-arrow"></i>
            </div>
          </div>
          
          <!-- Acciones -->
          <div class="filter-group filter-group--actions">
            <button class="filter-btn filter-btn--clear" @click="limpiarFiltros">
              <i class="bi bi-arrow-clockwise"></i>
              <span class="d-none d-sm-inline ms-1">Limpiar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary" v-if="actividadesFiltradas.length > 0">
      <p class="results-text">
        <i class="bi bi-info-circle me-2"></i>
        Mostrando {{ actividadesFiltradas.length }} de {{ actividades.length }} actividades
      </p>
    </div>

    <!-- Actividades List -->
    <div class="actividades-card">
      <!-- Mobile Cards View -->
      <div class="actividades-mobile d-md-none">
        <div v-for="actividad in actividadesFiltradas" :key="actividad.id" class="actividad-card-mobile">
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
            <button class="action-btn action-btn--view" @click="verDetalle(actividad)" title="Ver detalle">
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
              <tr v-for="actividad in actividadesFiltradas" :key="actividad.id" class="actividad-row">
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
                    <button class="action-btn action-btn--view" @click="verDetalle(actividad)" title="Ver detalle">
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
    </div>

    <!-- Empty State -->
    <div v-if="actividadesFiltradas.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="bi bi-list-check"></i>
      </div>
      <h4 class="empty-title">No se encontraron actividades</h4>
      <p class="empty-description">
        {{ filtros.estado || filtros.area || filtros.prioridad
           ? 'Intente ajustar los filtros de búsqueda' 
           : 'No hay actividades asignadas en este momento' }}
      </p>
      <button 
        v-if="filtros.estado || filtros.area || filtros.prioridad"
        class="btn btn-primary" 
        @click="limpiarFiltros"
      >
        <i class="bi bi-arrow-clockwise me-2"></i>
        Limpiar Filtros
      </button>
    </div>

    <!-- Modal Detalle Actividad -->
    <modal-detalle-actividad 
      :show="showModalDetalle" 
      :actividad="actividadSeleccionada"
      @close="cerrarModalDetalle"
      @completar="marcarCompletada"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import modalDetalleActividad from '../components/modalDetalleActividad.vue'

defineEmits(['back', 'crear'])

// Estado reactivo
const showFilters = ref(false)
const showModalDetalle = ref(false)
const actividadSeleccionada = ref(null)

const filtros = ref({
  estado: '',
  area: '',
  prioridad: ''
})

// Datos de ejemplo
const actividades = ref([
  {
    id: 1,
    nombre: 'Mantenimiento de Ascensores',
    descripcion: 'Revisión mensual de todos los ascensores del edificio',
    area: 'Ascensores',
    fechaProgramada: '2024-01-20',
    estado: 'pendiente',
    prioridad: 'alta',
    fechaCreacion: '2024-01-15',
    observaciones: 'Revisar especialmente el ascensor #2 que ha presentado ruidos'
  },
  {
    id: 2,
    nombre: 'Limpieza de Piscina',
    descripcion: 'Limpieza semanal y revisión de químicos',
    area: 'Piscina',
    fechaProgramada: '2024-01-18',
    estado: 'en-progreso',
    prioridad: 'media',
    fechaCreacion: '2024-01-10',
    observaciones: 'Verificar niveles de cloro y pH'
  },
  {
    id: 3,
    nombre: 'Revisión Sistema Eléctrico',
    descripcion: 'Inspección de tableros eléctricos principales',
    area: 'Instalaciones Eléctricas',
    fechaProgramada: '2024-01-22',
    estado: 'pendiente',
    prioridad: 'alta',
    fechaCreacion: '2024-01-16',
    observaciones: 'Revisar conexiones y verificar que no haya sobrecalentamiento'
  },
  {
    id: 4,
    nombre: 'Jardinería',
    descripcion: 'Poda y mantenimiento de áreas verdes',
    area: 'Jardines',
    fechaProgramada: '2024-01-19',
    estado: 'completada',
    prioridad: 'baja',
    fechaCreacion: '2024-01-12',
    observaciones: 'Actividad completada satisfactoriamente'
  },
  {
    id: 5,
    nombre: 'Reparación Plomería',
    descripcion: 'Reparar fuga en tubería principal',
    area: 'Plomería',
    fechaProgramada: '2024-01-25',
    estado: 'pendiente',
    prioridad: 'alta',
    fechaCreacion: '2024-01-17',
    observaciones: 'Fuga reportada en sótano nivel -1'
  }
])

// Computed properties
const actividadesFiltradas = computed(() => {
  let resultado = actividades.value

  if (filtros.value.estado) {
    resultado = resultado.filter(actividad => actividad.estado === filtros.value.estado)
  }

  if (filtros.value.area) {
    resultado = resultado.filter(actividad => actividad.area === filtros.value.area)
  }

  if (filtros.value.prioridad) {
    resultado = resultado.filter(actividad => actividad.prioridad === filtros.value.prioridad)
  }

  return resultado
})

// Métodos
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

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
    month: 'short',
    year: 'numeric'
  })
}

const limpiarFiltros = () => {
  filtros.value = {
    estado: '',
    area: '',
    prioridad: ''
  }
  showFilters.value = false
}

const verDetalle = (actividad) => {
  actividadSeleccionada.value = actividad
  showModalDetalle.value = true
}

const cerrarModalDetalle = () => {
  showModalDetalle.value = false
  actividadSeleccionada.value = null
}

const marcarCompletada = (id) => {
  const actividad = actividades.value.find(a => a.id === id)
  if (actividad) {
    actividad.estado = 'completada'
    actividad.observaciones = 'Actividad completada satisfactoriamente'
  }
  cerrarModalDetalle()
  console.log('Actividad marcada como completada:', id)
}
</script>

<style scoped lang="scss">
.mantenimiento-view {
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
}

// Header
.view-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-primario);
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
    transform: translateX(-2px);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.header-content {
  flex: 1;
  min-width: 200px;
}

.view-title {
  color: var(--color-primario);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  
  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
}

.view-subtitle {
  color: var(--color-oscuro);
  opacity: 0.7;
  margin: 0;
  font-size: 0.9rem;
}

// Filters Card (reutilizando estilos del módulo de propietario)
.filters-card {
  background: var(--color-fondo);
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  border: 1px solid rgba(18, 77, 181, 0.1);
  overflow: hidden;
}

.filters-header {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, var(--color-azul-claro), rgba(214, 230, 255, 0.5));
  border-bottom: 1px solid rgba(18, 77, 181, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filters-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.filters-toggle {
  background: var(--color-fondo);
  border: 2px solid var(--color-primario);
  color: var(--color-primario);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--color-primario);
    color: var(--color-fondo);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.filters-content {
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (min-width: 768px) {
    max-height: none;
    padding: 1.5rem;
    overflow: visible;
  }
  
  &.filters-content--show {
    max-height: 400px;
    padding: 1.5rem;
    overflow: visible;
  }
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    align-items: end;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;

  
  &.filter-group--actions {
    @media (min-width: 576px) {
      grid-column: 1 / -1;
      flex-direction: row;
      justify-content: center;
    }
    
    @media (min-width: 768px) {
      grid-column: auto;
      flex-direction: column;
      justify-content: flex-end;
    }
  }
}

.filter-label {
  color: var(--color-oscuro);
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

// Select Wrapper
.select-wrapper {
  position: relative;
}

.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 2px solid rgba(18, 77, 181, 0.2);
  border-radius: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-oscuro);
  background-color: var(--color-fondo);
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 4px rgba(18, 77, 181, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: var(--color-primario);
  }
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primario);
  pointer-events: none;
  transition: transform 0.2s ease;
}

.select-wrapper:hover .select-arrow {
  transform: translateY(-50%) scale(1.1);
}

// Filter Buttons
.filter-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  min-height: 48px;
  
  &.filter-btn--clear {
    background: var(--color-fondo);
    border: 2px solid var(--color-primario);
    color: var(--color-primario);
    
    &:hover {
      background-color: var(--color-primario);
      color: var(--color-fondo);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(18, 77, 181, 0.3);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

// Results Summary
.results-summary {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--color-azul-claro);
  border-radius: 0.75rem;
  border-left: 4px solid var(--color-primario);
}

.results-text {
  margin: 0;
  color: var(--color-primario);
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

// Actividades Card
.actividades-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 2rem;
}

// Mobile Cards
.actividades-mobile {
  padding: 1rem;
}

.actividad-card-mobile {
  background: var(--color-claro);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
    transform: translateX(4px);
  }
  
  &:last-child {
    margin-bottom: 0;
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
  border-radius: 0 0 0.75rem 0.75rem;
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
  padding: 4rem 1rem;
  color: var(--color-oscuro);
}

.empty-icon {
  margin-bottom: 2rem;
  
  i {
    font-size: 5rem;
    opacity: 0.3;
    color: var(--color-primario);
  }
}

.empty-title {
  color: var(--color-oscuro);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-description {
  opacity: 0.7;
  margin-bottom: 2rem;
  font-size: 1rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

// Button Styles
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  &.btn-primary {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    border: 2px solid transparent;
    color: var(--color-fondo);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(18, 77, 181, 0.4);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>
