<template>
  <div class="p-4">
    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div class="d-flex align-items-center">
        <button class="btn btn-outline-secondary me-3 d-lg-none" @click="$emit('back')">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h2 class="h3 mb-0">Centro de Avisos</h2>
          <p class="text-muted mb-0">Manténgase informado sobre el condominio</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Buscar avisos..."
                v-model="filtros.busqueda"
              >
            </div>
          </div>
          <div class="col-12 col-md-3">
            <select class="form-select" v-model="filtros.tipo">
              <option value="">Todos los tipos</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="asamblea">Asamblea</option>
              <option value="emergencia">Emergencia</option>
              <option value="general">General</option>
            </select>
          </div>
          <div class="col-12 col-md-3">
            <select class="form-select" v-model="filtros.estado">
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="vencido">Vencidos</option>
            </select>
          </div>
          <div class="col-12 col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="limpiarFiltros">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Avisos List -->
    <div class="row g-4">
      <div v-for="aviso in avisosFiltrados" :key="aviso.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-header border-0 bg-transparent">
            <div class="d-flex justify-content-between align-items-start">
              <span :class="['badge', `bg-${getTipoColor(aviso.tipo)}`]">
                {{ aviso.tipo }}
              </span>
              <small class="text-muted">{{ formatearFecha(aviso.fecha) }}</small>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ aviso.titulo }}</h5>
            <p class="card-text text-muted">{{ aviso.resumen }}</p>
            <div class="d-flex align-items-center text-muted small mb-3">
              <i class="bi bi-person me-1"></i>
              {{ aviso.autor }}
            </div>
          </div>
          <div class="card-footer border-0 bg-transparent">
            <button 
              class="btn btn-primary btn-sm w-100"
              @click="verDetalle(aviso.id)"
            >
              <i class="bi bi-eye me-2"></i>
              Ver Detalle
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="avisosFiltrados.length === 0" class="text-center py-5">
      <i class="bi bi-inbox text-muted" style="font-size: 4rem;"></i>
      <h4 class="text-muted mt-3">No se encontraron avisos</h4>
      <p class="text-muted">Intente ajustar los filtros de búsqueda</p>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPaginas > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
          <button class="page-link" @click="cambiarPagina(paginaActual - 1)">
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>
        <li 
          v-for="pagina in totalPaginas" 
          :key="pagina"
          class="page-item" 
          :class="{ active: pagina === paginaActual }"
        >
          <button class="page-link" @click="cambiarPagina(pagina)">
            {{ pagina }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
          <button class="page-link" @click="cambiarPagina(paginaActual + 1)">
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineEmits(['back'])

const paginaActual = ref(1)
const avisosPorPagina = 9

const filtros = ref({
  busqueda: '',
  tipo: '',
  estado: ''
})

const avisos = ref([
  {
    id: 1,
    titulo: 'Mantenimiento de Ascensores',
    resumen: 'Se realizará mantenimiento preventivo en todos los ascensores del edificio.',
    tipo: 'mantenimiento',
    fecha: '2024-01-15',
    autor: 'Administración',
    estado: 'activo'
  },
  {
    id: 2,
    titulo: 'Asamblea Extraordinaria',
    resumen: 'Convocatoria a asamblea extraordinaria para tratar temas importantes.',
    tipo: 'asamblea',
    fecha: '2024-01-20',
    autor: 'Junta Directiva',
    estado: 'activo'
  },
  {
    id: 3,
    titulo: 'Corte de Agua Programado',
    resumen: 'Se suspenderá el servicio de agua por trabajos de mantenimiento.',
    tipo: 'emergencia',
    fecha: '2024-01-10',
    autor: 'Administración',
    estado: 'vencido'
  }
])

const avisosFiltrados = computed(() => {
  let resultado = avisos.value

  if (filtros.value.busqueda) {
    resultado = resultado.filter(aviso => 
      aviso.titulo.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      aviso.resumen.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    )
  }

  if (filtros.value.tipo) {
    resultado = resultado.filter(aviso => aviso.tipo === filtros.value.tipo)
  }

  if (filtros.value.estado) {
    resultado = resultado.filter(aviso => aviso.estado === filtros.value.estado)
  }

  const inicio = (paginaActual.value - 1) * avisosPorPagina
  return resultado.slice(inicio, inicio + avisosPorPagina)
})

const totalPaginas = computed(() => {
  return Math.ceil(avisos.value.length / avisosPorPagina)
})

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
    tipo: '',
    estado: ''
  }
  paginaActual.value = 1
}

const cambiarPagina = (pagina) => {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
  }
}

const verDetalle = (id) => {
  console.log('Ver detalle del aviso:', id)
  // Implementar navegación al detalle
}
</script>
