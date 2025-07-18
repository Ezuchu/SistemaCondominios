<template>
  <div class="avisos-view">
    <!-- Header -->
    <div class="view-header">
      <button class="back-btn d-lg-none" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="view-title">Centro de Avisos</h2>
        <p class="view-subtitle">Gestiona los avisos del condominio</p>
      </div>
      <button class="btn btn-primary" @click="$emit('crear')">
        <i class="bi bi-plus-circle me-2"></i>
        Nuevo Aviso
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card stat-card--primary">
        <div class="stat-icon">
          <i class="bi bi-megaphone"></i>
        </div>
        <div class="stat-content">
          <h6 class="stat-value">{{ avisosPublicados }}</h6>
          <p class="stat-label">Avisos Publicados</p>
        </div>
      </div>
      
      <div class="stat-card stat-card--success">
        <div class="stat-icon">
          <i class="bi bi-eye"></i>
        </div>
        <div class="stat-content">
          <h6 class="stat-value">{{ avisosVistos }}</h6>
          <p class="stat-label">Avisos Vistos</p>
        </div>
      </div>
      
      <div class="stat-card stat-card--info">
        <div class="stat-icon">
          <i class="bi bi-calendar3"></i>
        </div>
        <div class="stat-content">
          <h6 class="stat-value">{{ avisosMesActual }}</h6>
          <p class="stat-label">Este Mes</p>
        </div>
      </div>
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
          <!-- Búsqueda -->
          <div class="filter-group filter-group--search">
            <label class="filter-label">Buscar</label>
            <div class="search-input-wrapper">
              <i class="bi bi-search search-icon"></i>
              <input 
                type="text" 
                class="filter-input filter-input--search" 
                placeholder="Buscar avisos..."
                v-model="filtros.busqueda"
              >
              <button 
                v-if="filtros.busqueda" 
                class="clear-search-btn"
                @click="filtros.busqueda = ''"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
          
          <!-- Tipo -->
          <div class="filter-group">
            <label class="filter-label">Tipo</label>
            <div class="select-wrapper">
              <select class="filter-select" v-model="filtros.tipo">
                <option value="">Todos los tipos</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="asamblea">Asamblea</option>
                <option value="emergencia">Emergencia</option>
                <option value="general">General</option>
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
    <div class="results-summary" v-if="avisosFiltrados.length > 0">
      <p class="results-text">
        <i class="bi bi-info-circle me-2"></i>
        Mostrando {{ avisosFiltrados.length }} de {{ avisos.length }} avisos
      </p>
    </div>

    <!-- Avisos List -->
    <div class="avisos-card">
      <div class="avisos-header">
        <h5 class="avisos-title">
          <i class="bi bi-list me-2"></i>
          Listado de Avisos
        </h5>
      </div>
      
      <!-- Mobile Cards View -->
      <div class="avisos-mobile d-md-none">
        <div v-for="aviso in avisosFiltrados" :key="aviso.id" class="aviso-card-mobile">
          <div class="aviso-header-mobile">
            <div class="aviso-info">
              <h6 class="aviso-titulo">{{ aviso.titulo }}</h6>
              <small class="aviso-fecha">{{ formatearFecha(aviso.fechaPublicacion) }}</small>
            </div>
            <span :class="['tipo-badge', `tipo-badge--${getTipoColor(aviso.tipo)}`]">
              {{ aviso.tipo }}
            </span>
          </div>
          
          <div class="aviso-details-mobile">
            <div class="detail-row">
              <span class="detail-label">Creador:</span>
              <span class="detail-value">{{ aviso.creador }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vistas:</span>
              <span class="detail-value">{{ aviso.vistas }}</span>
            </div>
          </div>
          
          <div class="aviso-actions-mobile">
            <button class="action-btn action-btn--view" @click="verDetalle(aviso)" title="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button class="action-btn action-btn--edit" @click="editarAviso(aviso.id)" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="avisos-desktop d-none d-md-block">
        <div class="table-responsive">
          <table class="avisos-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Fecha Publicación</th>
                <th>Creador</th>
                <th>Vistas</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aviso in avisosFiltrados" :key="aviso.id" class="aviso-row">
                <td>
                  <div class="aviso-cell">
                    <div class="aviso-nombre">{{ aviso.titulo }}</div>
                    <small class="aviso-resumen">{{ aviso.resumen }}</small>
                  </div>
                </td>
                <td>
                  <span :class="['tipo-badge', `tipo-badge--${getTipoColor(aviso.tipo)}`]">
                    {{ aviso.tipo }}
                  </span>
                </td>
                <td>{{ formatearFecha(aviso.fechaPublicacion) }}</td>
                <td>{{ aviso.creador }}</td>
                <td>
                  <span class="vistas-count">
                    <i class="bi bi-eye me-1"></i>
                    {{ aviso.vistas }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button class="action-btn action-btn--view" @click="verDetalle(aviso)" title="Ver detalle">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn action-btn--edit" @click="editarAviso(aviso.id)" title="Editar">
                      <i class="bi bi-pencil"></i>
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
    <div v-if="avisosFiltrados.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="bi bi-megaphone"></i>
      </div>
      <h4 class="empty-title">No se encontraron avisos</h4>
      <p class="empty-description">
        {{ filtros.busqueda || filtros.tipo
           ? 'Intente ajustar los filtros de búsqueda' 
           : 'No hay avisos publicados en este momento' }}
      </p>
      <button 
        v-if="filtros.busqueda || filtros.tipo"
        class="btn btn-primary" 
        @click="limpiarFiltros"
      >
        <i class="bi bi-arrow-clockwise me-2"></i>
        Limpiar Filtros
      </button>
    </div>

    <!-- Modal Detalle Aviso -->
    <modal-detalle-aviso 
      :show="showModalDetalle" 
      :aviso="avisoSeleccionado"
      @close="cerrarModalDetalle"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import modalDetalleAviso from '../components/modalDetalleAviso.vue'

defineEmits(['back', 'crear'])

// Estado reactivo
const showFilters = ref(false)
const showModalDetalle = ref(false)
const avisoSeleccionado = ref(null)

const filtros = ref({
  busqueda: '',
  tipo: ''
})

// Datos de ejemplo
const avisos = ref([
  {
    id: 1,
    titulo: 'Mantenimiento de Ascensores',
    resumen: 'Se realizará mantenimiento preventivo en todos los ascensores',
    tipo: 'mantenimiento',
    fechaPublicacion: '2024-01-15',
    creador: 'Carlos Rodríguez',
    vistas: 45,
    contenido: `
      <p>Estimados propietarios,</p>
      <p>Les informamos que el próximo <strong>martes 16 de enero de 2024</strong> se realizará el mantenimiento preventivo de todos los ascensores del edificio.</p>
      <h6>Detalles del mantenimiento:</h6>
      <ul>
        <li>Horario: 8:00 AM - 12:00 PM</li>
        <li>Ascensores afectados: Todos</li>
        <li>Empresa: TecnoElevadores C.A.</li>
      </ul>
      <p>Durante este período, los ascensores no estarán disponibles.</p>
    `
  },
  {
    id: 2,
    titulo: 'Asamblea Extraordinaria',
    resumen: 'Convocatoria a asamblea extraordinaria para tratar temas importantes',
    tipo: 'asamblea',
    fechaPublicacion: '2024-01-20',
    creador: 'Carlos Rodríguez',
    vistas: 32,
    contenido: `
      <p>Estimados propietarios,</p>
      <p>Por medio de la presente se convoca a <strong>Asamblea Extraordinaria</strong> para el día <strong>sábado 27 de enero de 2024</strong>.</p>
      <h6>Orden del día:</h6>
      <ul>
        <li>Aprobación de presupuesto extraordinario</li>
        <li>Renovación del sistema de seguridad</li>
        <li>Mejoras en áreas comunes</li>
      </ul>
    `
  },
  {
    id: 3,
    titulo: 'Corte de Agua Programado',
    resumen: 'Se suspenderá el servicio de agua por trabajos de mantenimiento',
    tipo: 'emergencia',
    fechaPublicacion: '2024-01-10',
    creador: 'Carlos Rodríguez',
    vistas: 78,
    contenido: `
      <p>Estimados residentes,</p>
      <p>Debido a trabajos de mantenimiento en la red principal de agua potable, se suspenderá el servicio.</p>
      <h6>Detalles:</h6>
      <ul>
        <li>Fecha: Miércoles 17 de enero de 2024</li>
        <li>Horario: 6:00 AM - 2:00 PM</li>
        <li>Áreas afectadas: Todo el edificio</li>
      </ul>
    `
  },
  {
    id: 4,
    titulo: 'Nuevas Normas de Convivencia',
    resumen: 'Se han actualizado las normas de convivencia del condominio',
    tipo: 'general',
    fechaPublicacion: '2024-01-12',
    creador: 'Carlos Rodríguez',
    vistas: 23,
    contenido: `
      <p>Estimados propietarios,</p>
      <p>Se han actualizado las normas de convivencia del condominio para mejorar la calidad de vida de todos los residentes.</p>
      <h6>Principales cambios:</h6>
      <ul>
        <li>Horarios de silencio: 10:00 PM - 7:00 AM</li>
        <li>Uso de áreas comunes</li>
        <li>Normas para mascotas</li>
      </ul>
    `
  }
])

// Computed properties
const avisosFiltrados = computed(() => {
  let resultado = avisos.value

  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase()
    resultado = resultado.filter(aviso =>
      aviso.titulo.toLowerCase().includes(busqueda) ||
      aviso.resumen.toLowerCase().includes(busqueda) ||
      aviso.creador.toLowerCase().includes(busqueda)
    )
  }

  if (filtros.value.tipo) {
    resultado = resultado.filter(aviso => aviso.tipo === filtros.value.tipo)
  }

  return resultado
})

const avisosPublicados = computed(() => avisos.value.length)
const avisosVistos = computed(() => avisos.value.reduce((total, aviso) => total + aviso.vistas, 0))
const avisosMesActual = computed(() => {
  const mesActual = new Date().getMonth()
  return avisos.value.filter(aviso => {
    const fechaAviso = new Date(aviso.fechaPublicacion)
    return fechaAviso.getMonth() === mesActual
  }).length
})

// Métodos
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const getTipoColor = (tipo) => {
  const colores = {
    mantenimiento: 'warning',
    asamblea: 'primary',
    emergencia: 'danger',
    general: 'info'
  }
  return colores[tipo] || 'secondary'
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
    busqueda: '',
    tipo: ''
  }
  showFilters.value = false
}

const verDetalle = (aviso) => {
  avisoSeleccionado.value = aviso
  showModalDetalle.value = true
}

const cerrarModalDetalle = () => {
  showModalDetalle.value = false
  avisoSeleccionado.value = null
}

const editarAviso = (id) => {
  console.log('Editar aviso:', id)
  // Aquí se podría navegar a una vista de edición
}
</script>

<style scoped lang="scss">
.avisos-view {
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

// Stats Cards
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  i {
    font-size: 1.5rem;
  }
  
  .stat-card--primary & {
    background: linear-gradient(135deg, rgba(18, 77, 181, 0.2), rgba(18, 77, 181, 0.1));
    color: var(--color-primario);
  }
  
  .stat-card--success & {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(40, 167, 69, 0.1));
    color: var(--color-éxito);
  }
  
  .stat-card--info & {
    background: linear-gradient(135deg, var(--color-azul-claro), rgba(0, 89, 255, 0.1));
    color: var(--color-informativo);
  }
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  
  .stat-card--primary & {
    color: var(--color-primario);
  }
  
  .stat-card--success & {
    color: var(--color-éxito);
  }
  
  .stat-card--info & {
    color: var(--color-informativo);
  }
}

.stat-label {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.9rem;
  margin: 0;
}

// Filters (reutilizando estilos anteriores)
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
    grid-template-columns: 2fr 1fr auto;
  }
  
  @media (min-width: 768px) {
    align-items: end;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.filter-group--search {
    @media (min-width: 576px) {
      grid-column: 1;
    }
  }
  
  &.filter-group--actions {
    @media (min-width: 576px) {
      flex-direction: row;
      justify-content: flex-end;
    }
    
    @media (min-width: 768px) {
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

// Search Input
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-primario);
  opacity: 0.6;
  z-index: 1;
}

.filter-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(18, 77, 181, 0.2);
  border-radius: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-oscuro);
  background-color: var(--color-fondo);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 4px rgba(18, 77, 181, 0.1);
  }
  
  &.filter-input--search {
    padding-left: 2.75rem;
    padding-right: 2.75rem;
  }
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  background: var(--color-primario);
  border: none;
  color: var(--color-fondo);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-peligro);
  }
}

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
  }
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primario);
  pointer-events: none;
}

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
  min-height: 48px;
  
  &.filter-btn--clear {
    background: var(--color-fondo);
    border: 2px solid var(--color-primario);
    color: var(--color-primario);
    
    &:hover {
      background-color: var(--color-primario);
      color: var(--color-fondo);
    }
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

// Avisos Card
.avisos-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 2rem;
}

.avisos-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.avisos-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

// Mobile Cards
.avisos-mobile {
  padding: 1rem;
}

.aviso-card-mobile {
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

.aviso-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.aviso-info {
  flex: 1;
  min-width: 0;
}

.aviso-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-oscuro);
  margin: 0 0 0.25rem 0;
}

.aviso-fecha {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.8rem;
}

.aviso-details-mobile {
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
}

.aviso-actions-mobile {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

// Desktop Table
.avisos-desktop {
  overflow-x: auto;
}

.table-responsive {
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
}

.avisos-table {
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

.aviso-row {
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
  }
}

.aviso-cell {
  .aviso-nombre {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .aviso-resumen {
    opacity: 0.7;
    font-size: 0.8rem;
  }
}

.vistas-count {
  color: var(--color-primario);
  font-weight: 500;
  display: flex;
  align-items: center;
}

// Tipo Badge
.tipo-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 500;
  text-transform: capitalize;
  
  &.tipo-badge--primary {
    background-color: rgba(18, 77, 181, 0.1);
    color: var(--color-primario);
  }
  
  &.tipo-badge--warning {
    background-color: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.tipo-badge--danger {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
  }
  
  &.tipo-badge--info {
    background-color: var(--color-azul-claro);
    color: var(--color-informativo);
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
  
  &.action-btn--edit {
    background-color: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
    
    &:hover {
      background-color: var(--color-naranja);
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
