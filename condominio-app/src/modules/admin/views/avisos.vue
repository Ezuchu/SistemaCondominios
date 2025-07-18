<template>
  <div class="avisos-admin">
    <!-- Header -->
    <div class="view-header">
      <button class="back-btn d-lg-none" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="view-title">Gestión de Avisos</h2>
        <p class="view-subtitle">Administra los avisos y comunicados del condominio</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="bi bi-plus-circle me-2"></i>
        Crear Aviso
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card stat-card--primary">
        <div class="stat-icon">
          <i class="bi bi-megaphone"></i>
        </div>
        <div class="stat-content">
          <h6 class="stat-value">{{ activeAvisos }}</h6>
          <p class="stat-label">Avisos Activos</p>
        </div>
      </div>
      
      <div class="stat-card stat-card--warning">
        <div class="stat-icon">
          <i class="bi bi-clock"></i>
        </div>
        <div class="stat-content">
          <h6 class="stat-value">{{ scheduledAvisos }}</h6>
          <p class="stat-label">Programados</p>
        </div>
      </div>
      
      <div class="stat-card stat-card--danger">
        <div class="stat-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <div class="stat-content">
          <h6 class="stat-value">{{ urgentAvisos }}</h6>
          <p class="stat-label">Urgentes</p>
        </div>
      </div>
      
      <div class="stat-card stat-card--info">
        <div class="stat-icon">
          <i class="bi bi-list"></i>
        </div>
        <div class="stat-content">
          <h6 class="stat-value">{{ totalAvisos }}</h6>
          <p class="stat-label">Total</p>
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
          
          <!-- Categoría -->
          <div class="filter-group">
            <label class="filter-label">Categoría</label>
            <div class="select-wrapper">
              <select class="filter-select" v-model="filtros.categoria">
                <option value="">Todas las categorías</option>
                <option value="general">General</option>
                <option value="urgente">Urgente</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="eventos">Eventos</option>
                <option value="normativa">Normativa</option>
              </select>
              <i class="bi bi-chevron-down select-arrow"></i>
            </div>
          </div>

          <!-- Estado -->
          <div class="filter-group">
            <label class="filter-label">Estado</label>
            <div class="select-wrapper">
              <select class="filter-select" v-model="filtros.estado">
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="programado">Programado</option>
                <option value="inactivo">Inactivo</option>
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
        <div class="view-options d-none d-md-flex">
          <button 
            @click="viewMode = 'grid'" 
            :class="{ active: viewMode === 'grid' }"
            class="view-btn"
          >
            <i class="bi bi-grid"></i>
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="{ active: viewMode === 'list' }"
            class="view-btn"
          >
            <i class="bi bi-list"></i>
          </button>
        </div>
      </div>
      
      <!-- Mobile Cards View -->
      <div class="avisos-mobile d-md-none">
        <div v-for="aviso in avisosFiltrados" :key="aviso.id" class="aviso-card-mobile">
          <div class="aviso-header-mobile">
            <div class="aviso-info">
              <h6 class="aviso-titulo">{{ aviso.titulo }}</h6>
              <small class="aviso-fecha">{{ formatearFecha(aviso.fechaCreacion) }}</small>
            </div>
            <span :class="['categoria-badge', `categoria-badge--${getCategoriaColor(aviso.categoria)}`]">
              {{ getCategoriaLabel(aviso.categoria) }}
            </span>
          </div>
          
          <div class="aviso-details-mobile">
            <div class="detail-row">
              <span class="detail-label">Estado:</span>
              <span :class="['estado-badge', `estado-badge--${getEstadoColor(aviso.estado)}`]">
                {{ getEstadoLabel(aviso.estado) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prioridad:</span>
              <span :class="['prioridad-badge', `prioridad-badge--${getPrioridadColor(aviso.prioridad)}`]">
                {{ getPrioridadLabel(aviso.prioridad) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Autor:</span>
              <span class="detail-value">{{ aviso.autor }}</span>
            </div>
          </div>
          
          <div class="aviso-actions-mobile">
            <button class="action-btn action-btn--view" @click="verDetalle(aviso)" title="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button class="action-btn action-btn--edit" @click="editarAviso(aviso)" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn action-btn--delete" @click="eliminarAviso(aviso.id)" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Desktop Grid View -->
      <div v-if="viewMode === 'grid'" class="avisos-grid d-none d-md-grid">
        <div 
          v-for="aviso in avisosFiltrados" 
          :key="aviso.id"
          class="aviso-card-grid"
          :class="[`priority-${aviso.prioridad}`, `status-${aviso.estado}`]"
        >
          <div class="card-header">
            <div class="category-badge" :class="`category-${aviso.categoria}`">
              {{ getCategoriaLabel(aviso.categoria) }}
            </div>
            <div class="card-actions">
              <button @click="verDetalle(aviso)" class="action-btn action-btn--view">
                <i class="bi bi-eye"></i>
              </button>
              <button @click="editarAviso(aviso)" class="action-btn action-btn--edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="eliminarAviso(aviso.id)" class="action-btn action-btn--delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <h3>{{ aviso.titulo }}</h3>
            <p class="description">{{ truncateText(aviso.descripcion, 100) }}</p>
            
            <div class="card-meta">
              <div class="meta-item">
                <i class="bi bi-calendar"></i>
                <span>{{ formatearFecha(aviso.fechaCreacion) }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-person"></i>
                <span>{{ aviso.autor }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="status-indicator" :class="`status-${aviso.estado}`">
              {{ getEstadoLabel(aviso.estado) }}
            </div>
            <div class="priority-indicator" :class="`priority-${aviso.prioridad}`">
              {{ getPrioridadLabel(aviso.prioridad) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div v-if="viewMode === 'list'" class="avisos-desktop d-none d-md-block">
        <div class="table-responsive">
          <table class="avisos-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Fecha</th>
                <th>Autor</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aviso in avisosFiltrados" :key="aviso.id" class="aviso-row">
                <td>
                  <div class="aviso-cell">
                    <div class="aviso-nombre">{{ aviso.titulo }}</div>
                    <small class="aviso-resumen">{{ truncateText(aviso.descripcion, 50) }}</small>
                  </div>
                </td>
                <td>
                  <span :class="['categoria-badge', `categoria-badge--${getCategoriaColor(aviso.categoria)}`]">
                    {{ getCategoriaLabel(aviso.categoria) }}
                  </span>
                </td>
                <td>
                  <span :class="['estado-badge', `estado-badge--${getEstadoColor(aviso.estado)}`]">
                    {{ getEstadoLabel(aviso.estado) }}
                  </span>
                </td>
                <td>
                  <span :class="['prioridad-badge', `prioridad-badge--${getPrioridadColor(aviso.prioridad)}`]">
                    {{ getPrioridadLabel(aviso.prioridad) }}
                  </span>
                </td>
                <td>{{ formatearFecha(aviso.fechaCreacion) }}</td>
                <td>{{ aviso.autor }}</td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button class="action-btn action-btn--view" @click="verDetalle(aviso)" title="Ver detalle">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn action-btn--edit" @click="editarAviso(aviso)" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn action-btn--delete" @click="eliminarAviso(aviso.id)" title="Eliminar">
                      <i class="bi bi-trash"></i>
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
        {{ filtros.busqueda || filtros.categoria || filtros.estado
           ? 'Intente ajustar los filtros de búsqueda' 
           : 'No hay avisos publicados en este momento' }}
      </p>
      <button 
        v-if="filtros.busqueda || filtros.categoria || filtros.estado"
        class="btn btn-primary" 
        @click="limpiarFiltros"
      >
        <i class="bi bi-arrow-clockwise me-2"></i>
        Limpiar Filtros
      </button>
    </div>

    <!-- Modal Crear/Editar Aviso -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Aviso' : 'Crear Nuevo Aviso' }}</h2>
          <button @click="closeModal" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <form @submit.prevent="guardarAviso" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Título *</label>
              <input 
                v-model="currentAviso.titulo" 
                type="text" 
                required
                placeholder="Título del aviso"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="currentAviso.categoria" required class="form-control">
                <option value="">Seleccionar categoría</option>
                <option value="general">General</option>
                <option value="urgente">Urgente</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="eventos">Eventos</option>
                <option value="normativa">Normativa</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Prioridad *</label>
              <select v-model="currentAviso.prioridad" required class="form-control">
                <option value="">Seleccionar prioridad</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Estado *</label>
              <select v-model="currentAviso.estado" required class="form-control">
                <option value="activo">Activo</option>
                <option value="programado">Programado</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Descripción *</label>
            <textarea 
              v-model="currentAviso.descripcion" 
              required
              rows="4"
              placeholder="Descripción detallada del aviso"
              class="form-control"
            ></textarea>
          </div>
          
          <div class="form-row" v-if="currentAviso.estado === 'programado'">
            <div class="form-group">
              <label>Fecha de publicación</label>
              <input 
                v-model="currentAviso.fechaPublicacion" 
                type="datetime-local"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Fecha de expiración</label>
              <input 
                v-model="currentAviso.fechaExpiracion" 
                type="datetime-local"
                class="form-control"
              >
            </div>
          </div>
          
          <div class="form-group">
            <div class="form-check">
              <input 
                v-model="currentAviso.enviarNotificacion" 
                type="checkbox"
                class="form-check-input"
                id="notificacion"
              >
              <label class="form-check-label" for="notificacion">
                Enviar notificación a todos los propietarios
              </label>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Actualizar' : 'Crear' }} Aviso
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ver Aviso -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content view-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ viewingAviso.titulo }}</h2>
          <button @click="closeViewModal" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="view-content">
          <div class="view-meta">
            <div class="meta-badges">
              <span :class="['categoria-badge', `categoria-badge--${getCategoriaColor(viewingAviso.categoria)}`]">
                {{ getCategoriaLabel(viewingAviso.categoria) }}
              </span>
              <span :class="['estado-badge', `estado-badge--${getEstadoColor(viewingAviso.estado)}`]">
                {{ getEstadoLabel(viewingAviso.estado) }}
              </span>
              <span :class="['prioridad-badge', `prioridad-badge--${getPrioridadColor(viewingAviso.prioridad)}`]">
                {{ getPrioridadLabel(viewingAviso.prioridad) }}
              </span>
            </div>
            
            <div class="meta-info">
              <p><strong>Autor:</strong> {{ viewingAviso.autor }}</p>
              <p><strong>Fecha de creación:</strong> {{ formatearFecha(viewingAviso.fechaCreacion) }}</p>
              <p v-if="viewingAviso.fechaPublicacion">
                <strong>Fecha de publicación:</strong> {{ formatearFecha(viewingAviso.fechaPublicacion) }}
              </p>
              <p v-if="viewingAviso.fechaExpiracion">
                <strong>Fecha de expiración:</strong> {{ formatearFecha(viewingAviso.fechaExpiracion) }}
              </p>
            </div>
          </div>
          
          <div class="view-description">
            <h3>Descripción</h3>
            <p>{{ viewingAviso.descripcion }}</p>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="editarAviso(viewingAviso)" class="btn btn-primary">
            <i class="bi bi-pencil me-2"></i>
            Editar
          </button>
          <button @click="closeViewModal" class="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

defineEmits(['back'])

// Estado reactivo
const showFilters = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const isEditing = ref(false)
const viewMode = ref('list')
const viewingAviso = ref({})

const filtros = ref({
  busqueda: '',
  categoria: '',
  estado: ''
})

const currentAviso = ref({
  id: null,
  titulo: '',
  descripcion: '',
  categoria: '',
  prioridad: '',
  estado: 'activo',
  autor: 'María González',
  fechaCreacion: new Date().toISOString(),
  fechaPublicacion: '',
  fechaExpiracion: '',
  enviarNotificacion: false
})

// Datos de ejemplo
const avisos = ref([
  {
    id: 1,
    titulo: 'Mantenimiento de Ascensores',
    descripcion: 'Se realizará mantenimiento preventivo en todos los ascensores del edificio el próximo sábado de 8:00 AM a 12:00 PM. Durante este período, los ascensores no estarán disponibles.',
    categoria: 'mantenimiento',
    prioridad: 'alta',
    estado: 'activo',
    autor: 'María González',
    fechaCreacion: '2024-01-15T10:00:00',
    fechaPublicacion: '2024-01-15T10:00:00',
    fechaExpiracion: '2024-01-20T23:59:59',
    enviarNotificacion: true
  },
  {
    id: 2,
    titulo: 'Reunión de Propietarios',
    descripcion: 'Se convoca a todos los propietarios a la reunión mensual que se realizará en el salón comunal el próximo viernes a las 7:00 PM.',
    categoria: 'eventos',
    prioridad: 'media',
    estado: 'programado',
    autor: 'María González',
    fechaCreacion: '2024-01-14T15:30:00',
    fechaPublicacion: '2024-01-16T09:00:00',
    fechaExpiracion: '2024-01-25T18:00:00',
    enviarNotificacion: true
  },
  {
    id: 3,
    titulo: 'Nuevas Normas de Convivencia',
    descripcion: 'Se han actualizado las normas de convivencia del condominio. Por favor revisen el documento adjunto y cumplan con las nuevas disposiciones.',
    categoria: 'normativa',
    prioridad: 'media',
    estado: 'activo',
    autor: 'Consejo Administrativo',
    fechaCreacion: '2024-01-13T12:00:00',
    fechaPublicacion: '2024-01-13T12:00:00',
    enviarNotificacion: false
  },
  {
    id: 4,
    titulo: 'Corte de Agua Programado',
    descripcion: 'La empresa de servicios públicos realizará trabajos de mantenimiento que afectarán el suministro de agua el miércoles de 6:00 AM a 2:00 PM.',
    categoria: 'urgente',
    prioridad: 'alta',
    estado: 'activo',
    autor: 'María González',
    fechaCreacion: '2024-01-12T08:00:00',
    fechaPublicacion: '2024-01-12T08:00:00',
    enviarNotificacion: true
  },
  {
    id: 5,
    titulo: 'Celebración Día de la Madre',
    descripcion: 'Invitamos a todas las madres del condominio a participar en la celebración especial que se realizará en el área social.',
    categoria: 'eventos',
    prioridad: 'baja',
    estado: 'inactivo',
    autor: 'Comité Social',
    fechaCreacion: '2024-01-10T16:00:00',
    fechaPublicacion: '2024-01-10T16:00:00',
    fechaExpiracion: '2024-01-11T23:59:59',
    enviarNotificacion: false
  }
])

// Computed properties
const avisosFiltrados = computed(() => {
  let resultado = avisos.value

  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase()
    resultado = resultado.filter(aviso =>
      aviso.titulo.toLowerCase().includes(busqueda) ||
      aviso.descripcion.toLowerCase().includes(busqueda) ||
      aviso.autor.toLowerCase().includes(busqueda)
    )
  }

  if (filtros.value.categoria) {
    resultado = resultado.filter(aviso => aviso.categoria === filtros.value.categoria)
  }

  if (filtros.value.estado) {
    resultado = resultado.filter(aviso => aviso.estado === filtros.value.estado)
  }

  return resultado.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
})

const activeAvisos = computed(() => 
  avisos.value.filter(aviso => aviso.estado === 'activo').length
)

const scheduledAvisos = computed(() => 
  avisos.value.filter(aviso => aviso.estado === 'programado').length
)

const urgentAvisos = computed(() => 
  avisos.value.filter(aviso => aviso.categoria === 'urgente' && aviso.estado === 'activo').length
)

const totalAvisos = computed(() => avisos.value.length)

// Métodos
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const getCategoriaColor = (categoria) => {
  const colores = {
    general: 'info',
    urgente: 'danger',
    mantenimiento: 'warning',
    eventos: 'success',
    normativa: 'primary'
  }
  return colores[categoria] || 'secondary'
}

const getCategoriaLabel = (categoria) => {
  const labels = {
    general: 'General',
    urgente: 'Urgente',
    mantenimiento: 'Mantenimiento',
    eventos: 'Eventos',
    normativa: 'Normativa'
  }
  return labels[categoria] || categoria
}

const getEstadoColor = (estado) => {
  const colores = {
    activo: 'success',
    programado: 'warning',
    inactivo: 'secondary'
  }
  return colores[estado] || 'secondary'
}

const getEstadoLabel = (estado) => {
  const labels = {
    activo: 'Activo',
    programado: 'Programado',
    inactivo: 'Inactivo'
  }
  return labels[estado] || estado
}

const getPrioridadColor = (prioridad) => {
  const colores = {
    alta: 'danger',
    media: 'warning',
    baja: 'success'
  }
  return colores[prioridad] || 'secondary'
}

const getPrioridadLabel = (prioridad) => {
  const labels = {
    alta: 'Alta',
    media: 'Media',
    baja: 'Baja'
  }
  return labels[prioridad] || prioridad
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    categoria: '',
    estado: ''
  }
  showFilters.value = false
}

const openCreateModal = () => {
  isEditing.value = false
  currentAviso.value = {
    id: null,
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: '',
    estado: 'activo',
    autor: 'María González',
    fechaCreacion: new Date().toISOString(),
    fechaPublicacion: '',
    fechaExpiracion: '',
    enviarNotificacion: false
  }
  showModal.value = true
}

const editarAviso = (aviso) => {
  isEditing.value = true
  currentAviso.value = { ...aviso }
  showModal.value = true
  showViewModal.value = false
}

const verDetalle = (aviso) => {
  viewingAviso.value = aviso
  showViewModal.value = true
}

const closeModal = () => {
  showModal.value = false
  currentAviso.value = {}
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingAviso.value = {}
}

const guardarAviso = () => {
  if (isEditing.value) {
    const index = avisos.value.findIndex(a => a.id === currentAviso.value.id)
    if (index !== -1) {
      avisos.value[index] = { ...currentAviso.value }
    }
  } else {
    const newId = Math.max(...avisos.value.map(a => a.id)) + 1
    avisos.value.push({
      ...currentAviso.value,
      id: newId,
      fechaCreacion: new Date().toISOString()
    })
  }
  closeModal()
}

const eliminarAviso = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este aviso?')) {
    avisos.value = avisos.value.filter(aviso => aviso.id !== id)
  }
}

// Lifecycle
onMounted(() => {
  // Los datos ya están inicializados
})
</script>

<style scoped lang="scss">
.avisos-admin {
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
  
  .stat-card--warning & {
    background: linear-gradient(135deg, rgba(255, 168, 1, 0.2), rgba(255, 168, 1, 0.1));
    color: var(--color-naranja);
  }
  
  .stat-card--danger & {
    background: linear-gradient(135deg, rgba(255, 101, 30, 0.2), rgba(255, 101, 30, 0.1));
    color: var(--color-peligro);
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
  
  .stat-card--warning & {
    color: var(--color-naranja);
  }
  
  .stat-card--danger & {
    color: var(--color-peligro);
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

// Filters
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
    grid-template-columns: 2fr 1fr 1fr auto;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avisos-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem;
  border: 2px solid rgba(18, 77, 181, 0.2);
  background: var(--color-fondo);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--color-primario);
  
  &.active,
  &:hover {
    border-color: var(--color-primario);
    background-color: var(--color-primario);
    color: var(--color-fondo);
  }
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

// Desktop Grid
.avisos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.aviso-card-grid {
  border: 2px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  background: var(--color-fondo);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  &.priority-alta {
    border-left: 4px solid var(--color-peligro);
  }
  
  &.priority-media {
    border-left: 4px solid var(--color-naranja);
  }
  
  &.priority-baja {
    border-left: 4px solid var(--color-éxito);
  }
}

.card-header {
  padding: 1rem;
  background: var(--color-claro);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  &.category-general {
    background: rgba(0, 89, 255, 0.1);
    color: var(--color-informativo);
  }
  
  &.category-urgente {
    background: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
  }
  
  &.category-mantenimiento {
    background: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.category-eventos {
    background: rgba(40, 167, 69, 0.1);
    color: var(--color-éxito);
  }
  
  &.category-normativa {
    background: rgba(18, 77, 181, 0.1);
    color: var(--color-primario);
  }
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-oscuro);
  font-size: 1.1rem;
}

.description {
  color: var(--color-oscuro);
  opacity: 0.7;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.9rem;
}

.card-footer {
  padding: 1rem;
  background: var(--color-claro);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator,
.priority-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-activo {
  background: rgba(40, 167, 69, 0.1);
  color: var(--color-éxito);
}

.status-programado {
  background: rgba(255, 168, 1, 0.1);
  color: var(--color-naranja);
}

.status-inactivo {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.priority-alta {
  background: rgba(255, 101, 30, 0.1);
  color: var(--color-peligro);
}

.priority-media {
  background: rgba(255, 168, 1, 0.1);
  color: var(--color-naranja);
}

.priority-baja {
  background: rgba(40, 167, 69, 0.1);
  color: var(--color-éxito);
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

// Badges
.categoria-badge,
.estado-badge,
.prioridad-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 500;
  text-transform: capitalize;
}

.categoria-badge--primary {
  background-color: rgba(18, 77, 181, 0.1);
  color: var(--color-primario);
}

.categoria-badge--warning {
  background-color: rgba(255, 168, 1, 0.1);
  color: var(--color-naranja);
}

.categoria-badge--danger {
  background-color: rgba(255, 101, 30, 0.1);
  color: var(--color-peligro);
}

.categoria-badge--info {
  background-color: var(--color-azul-claro);
  color: var(--color-informativo);
}

.categoria-badge--success {
  background-color: rgba(40, 167, 69, 0.1);
  color: var(--color-éxito);
}

.estado-badge--success {
  background-color: rgba(40, 167, 69, 0.1);
  color: var(--color-éxito);
}

.estado-badge--warning {
  background-color: rgba(255, 168, 1, 0.1);
  color: var(--color-naranja);
}

.estado-badge--secondary {
  background-color: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.prioridad-badge--danger {
  background-color: rgba(255, 101, 30, 0.1);
  color: var(--color-peligro);
}

.prioridad-badge--warning {
  background-color: rgba(255, 168, 1, 0.1);
  color: var(--color-naranja);
}

.prioridad-badge--success {
  background-color: rgba(40, 167, 69, 0.1);
  color: var(--color-éxito);
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
  
  &.action-btn--delete {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
    
    &:hover {
      background-color: var(--color-peligro);
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

// Modales
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--color-fondo);
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  &.view-modal {
    max-width: 800px;
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: var(--color-primario);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-oscuro);
  opacity: 0.7;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s;
  
  &:hover {
    background: var(--color-claro);
    opacity: 1;
  }
}

.modal-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-oscuro);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(18, 77, 181, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 4px rgba(18, 77, 181, 0.1);
  }
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  width: auto;
}

.form-check-label {
  margin-bottom: 0;
  font-weight: normal;
}

.modal-actions {
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
}

// Vista detallada
.view-content {
  padding: 1.5rem;
}

.view-meta {
  margin-bottom: 2rem;
}

.meta-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-info p {
  margin: 0.5rem 0;
  color: var(--color-oscuro);
  opacity: 0.7;
}

.view-description h3 {
  color: var(--color-primario);
  margin-bottom: 1rem;
}

.view-description p {
  line-height: 1.6;
  color: var(--color-oscuro);
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
  border: none;
  
  &.btn-primary {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    color: var(--color-fondo);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(18, 77, 181, 0.4);
    }
  }
  
  &.btn-secondary {
    background: var(--color-claro);
    color: var(--color-oscuro);
    border: 2px solid rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

// Responsive
@media (max-width: 768px) {
  .avisos-admin {
    padding: 1rem;
  }
  
  .view-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .avisos-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>
