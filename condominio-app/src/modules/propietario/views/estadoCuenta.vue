<template>
  <div class="estado-cuenta-view">
    <!-- Header -->
    <div class="view-header">
      <button class="back-btn d-lg-none" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="view-title">Estados de Cuenta</h2>
        <p class="view-subtitle">Consulte y descargue sus estados de cuenta</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-card">
      <div class="filters-header">
        <h6 class="filters-title">
          <i class="bi bi-funnel me-2"></i>
          Filtros
        </h6>
        <button class="filters-toggle d-md-none" @click="showFilters = !showFilters">
          <i :class="showFilters ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
        </button>
      </div>
      
      <div class="filters-content" :class="{ 'filters-content--show': showFilters }">
        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">Año</label>
            <select class="filter-select" v-model="filtros.año">
              <option value="">Todos los años</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Mes</label>
            <select class="filter-select" v-model="filtros.mes">
              <option value="">Todos los meses</option>
              <option v-for="(mes, index) in meses" :key="index" :value="index + 1">
                {{ mes }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Estado</label>
            <select class="filter-select" v-model="filtros.estado">
              <option value="">Todos</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
          
          <div class="filter-group filter-actions">
            <button class="btn btn-primary" @click="aplicarFiltros">
              <i class="bi bi-search me-2"></i>
              Filtrar
            </button>
            <button class="btn btn-outline" @click="limpiarFiltros">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen Cards - Mobile First -->
    <div class="summary-section">
      <div class="summary-cards">
        <div class="summary-card summary-card--success">
          <div class="summary-icon">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="summary-content">
            <h6 class="summary-value">{{ estadosPagados }}</h6>
            <p class="summary-label">Pagados</p>
          </div>
        </div>
        
        <div class="summary-card summary-card--warning">
          <div class="summary-icon">
            <i class="bi bi-clock"></i>
          </div>
          <div class="summary-content">
            <h6 class="summary-value">{{ estadosPendientes }}</h6>
            <p class="summary-label">Pendientes</p>
          </div>
        </div>
        
        <div class="summary-card summary-card--danger">
          <div class="summary-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <div class="summary-content">
            <h6 class="summary-value">{{ estadosVencidos }}</h6>
            <p class="summary-label">Vencidos</p>
          </div>
        </div>
        
        <div class="summary-card summary-card--primary">
          <div class="summary-icon">
            <i class="bi bi-currency-dollar"></i>
          </div>
          <div class="summary-content">
            <h6 class="summary-value">{{ formatearMoneda(totalDeuda) }}</h6>
            <p class="summary-label">Total Deuda</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Estados List -->
    <div class="estados-card">
      <div class="estados-header">
        <h5 class="estados-title">
          <i class="bi bi-file-earmark-text me-2"></i>
          Historial de Estados
        </h5>
        <button class="btn btn-outline btn-sm" @click="descargarTodos">
          <i class="bi bi-download me-2"></i>
          <span class="d-none d-sm-inline">Descargar Todos</span>
        </button>
      </div>
      
      <!-- Mobile Cards View -->
      <div class="estados-mobile d-md-none">
        <div v-for="estado in estadosFiltrados" :key="estado.id" class="estado-card-mobile">
          <div class="estado-header-mobile">
            <div class="estado-periodo">
              <h6 class="periodo-title">{{ estado.periodo }}</h6>
              <small class="periodo-concepto">{{ estado.concepto }}</small>
            </div>
            <span :class="['estado-badge', `estado-badge--${getEstadoColor(estado.estado)}`]">
              {{ estado.estado }}
            </span>
          </div>
          
          <div class="estado-details-mobile">
            <div class="detail-row">
              <span class="detail-label">Monto:</span>
              <span class="detail-value">{{ formatearMoneda(estado.monto) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Emisión:</span>
              <span class="detail-value">{{ formatearFecha(estado.fechaEmision) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vencimiento:</span>
              <span class="detail-value" :class="{ 'text-danger': esVencido(estado.fechaVencimiento) }">
                {{ formatearFecha(estado.fechaVencimiento) }}
              </span>
            </div>
          </div>
          
          <div class="estado-actions-mobile">
            <button class="action-btn action-btn--view" @click="verDetalle(estado.id)" title="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button class="action-btn action-btn--download" @click="descargarPDF(estado.id)" title="Descargar PDF">
              <i class="bi bi-download"></i>
            </button>
            <button 
              v-if="estado.estado === 'pendiente'"
              class="action-btn action-btn--pay" 
              @click="pagarEstado(estado.id)" 
              title="Pagar ahora"
            >
              <i class="bi bi-credit-card"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="estados-desktop d-none d-md-block">
        <div class="table-responsive">
          <table class="estados-table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Fecha Emisión</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha Vencimiento</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="estado in estadosFiltrados" :key="estado.id" class="estado-row">
                <td>
                  <div class="periodo-cell">
                    <div class="periodo-title">{{ estado.periodo }}</div>
                    <small class="periodo-concepto">{{ estado.concepto }}</small>
                  </div>
                </td>
                <td>{{ formatearFecha(estado.fechaEmision) }}</td>
                <td>
                  <span class="monto-value">{{ formatearMoneda(estado.monto) }}</span>
                </td>
                <td>
                  <span :class="['estado-badge', `estado-badge--${getEstadoColor(estado.estado)}`]">
                    {{ estado.estado }}
                  </span>
                </td>
                <td>
                  <span :class="{ 'text-danger': esVencido(estado.fechaVencimiento) }">
                    {{ formatearFecha(estado.fechaVencimiento) }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button class="action-btn action-btn--view" @click="verDetalle(estado.id)" title="Ver detalle">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn action-btn--download" @click="descargarPDF(estado.id)" title="Descargar PDF">
                      <i class="bi bi-download"></i>
                    </button>
                    <button 
                      v-if="estado.estado === 'pendiente'"
                      class="action-btn action-btn--pay" 
                      @click="pagarEstado(estado.id)" 
                      title="Pagar ahora"
                    >
                      <i class="bi bi-credit-card"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="estadosFiltrados.length === 0" class="empty-state">
      <i class="bi bi-file-earmark-x"></i>
      <h4>No se encontraron estados de cuenta</h4>
      <p>Intente ajustar los filtros de búsqueda</p>
      <button class="btn btn-primary" @click="limpiarFiltros">
        <i class="bi bi-arrow-clockwise me-2"></i>
        Limpiar Filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineEmits(['back'])

const showFilters = ref(false)

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const filtros = ref({
  año: '',
  mes: '',
  estado: ''
})

const estados = ref([
  {
    id: 1,
    periodo: 'Enero 2024',
    concepto: 'Cuota de Mantenimiento',
    fechaEmision: '2024-01-01',
    fechaVencimiento: '2024-01-15',
    monto: 400,
    estado: 'pagado'
  },
  {
    id: 2,
    periodo: 'Febrero 2024',
    concepto: 'Cuota de Mantenimiento',
    fechaEmision: '2024-02-01',
    fechaVencimiento: '2024-02-15',
    monto: 400,
    estado: 'pendiente'
  },
  {
    id: 3,
    periodo: 'Marzo 2024',
    concepto: 'Cuota de Mantenimiento',
    fechaEmision: '2024-03-01',
    fechaVencimiento: '2024-03-15',
    monto: 400,
    estado: 'vencido'
  },
  {
    id: 4,
    periodo: 'Abril 2024',
    concepto: 'Cuota Extraordinaria',
    fechaEmision: '2024-04-01',
    fechaVencimiento: '2024-04-15',
    monto: 200,
    estado: 'pagado'
  }
])

const estadosFiltrados = computed(() => {
  let resultado = estados.value

  if (filtros.value.año) {
    resultado = resultado.filter(estado => 
      estado.fechaEmision.includes(filtros.value.año)
    )
  }

  if (filtros.value.mes) {
    resultado = resultado.filter(estado => {
      const fecha = new Date(estado.fechaEmision)
      return fecha.getMonth() + 1 === parseInt(filtros.value.mes)
    })
  }

  if (filtros.value.estado) {
    resultado = resultado.filter(estado => estado.estado === filtros.value.estado)
  }

  return resultado
})

const estadosPagados = computed(() => 
  estados.value.filter(e => e.estado === 'pagado').length
)

const estadosPendientes = computed(() => 
  estados.value.filter(e => e.estado === 'pendiente').length
)

const estadosVencidos = computed(() => 
  estados.value.filter(e => e.estado === 'vencido').length
)

const totalDeuda = computed(() => 
  estados.value
    .filter(e => e.estado !== 'pagado')
    .reduce((total, estado) => total + estado.monto, 0)
)

const getEstadoColor = (estado) => {
  const colores = {
    pagado: 'success',
    pendiente: 'warning',
    vencido: 'danger'
  }
  return colores[estado] || 'secondary'
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES')
}

const formatearMoneda = (monto) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(monto)
}

const esVencido = (fechaVencimiento) => {
  return new Date(fechaVencimiento) < new Date()
}

const aplicarFiltros = () => {
  showFilters.value = false
  console.log('Filtros aplicados')
}

const limpiarFiltros = () => {
  filtros.value = {
    año: '',
    mes: '',
    estado: ''
  }
  showFilters.value = false
}

const verDetalle = (id) => {
  console.log('Ver detalle del estado:', id)
}

const descargarPDF = (id) => {
  console.log('Descargar PDF del estado:', id)
}

const descargarTodos = () => {
  console.log('Descargar todos los estados')
}

const pagarEstado = (id) => {
  console.log('Pagar estado:', id)
}
</script>

<style scoped lang="scss">
.estado-cuenta-view {
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
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-primario);
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
  }
}

.header-content {
  flex: 1;
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

// Filters
.filters-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.filters-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
}

.filters-toggle {
  background: none;
  border: none;
  color: var(--color-primario);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
  }
}

.filters-content {
  padding: 0 1.5rem;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    max-height: none;
    padding: 1.5rem;
  }
  
  &.filters-content--show {
    max-height: 300px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  
  &.filter-actions {
    flex-direction: row;
    align-items: end;
    gap: 0.5rem;
    
    @media (min-width: 768px) {
      justify-content: flex-end;
    }
  }
}

.filter-label {
  color: var(--color-oscuro);
  font-weight: 500;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-oscuro);
  background-color: var(--color-fondo);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 3px rgba(18, 77, 181, 0.1);
  }
}

// Summary Section
.summary-section {
  margin-bottom: 2rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.summary-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  i {
    font-size: 1.2rem;
  }
  
  .summary-card--success & {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(40, 167, 69, 0.1));
    color: var(--color-éxito);
  }
  
  .summary-card--warning & {
    background: linear-gradient(135deg, rgba(255, 168, 1, 0.2), rgba(255, 168, 1, 0.1));
    color: var(--color-naranja);
  }
  
  .summary-card--danger & {
    background: linear-gradient(135deg, rgba(255, 101, 30, 0.2), rgba(255, 101, 30, 0.1));
    color: var(--color-peligro);
  }
  
  .summary-card--primary & {
    background: linear-gradient(135deg, rgba(18, 77, 181, 0.2), rgba(18, 77, 181, 0.1));
    color: var(--color-primario);
  }
}

.summary-content {
  flex: 1;
  min-width: 0;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  
  .summary-card--success & {
    color: var(--color-éxito);
  }
  
  .summary-card--warning & {
    color: var(--color-naranja);
  }
  
  .summary-card--danger & {
    color: var(--color-peligro);
  }
  
  .summary-card--primary & {
    color: var(--color-primario);
  }
}

.summary-label {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.8rem;
  margin: 0;
}

// Estados Card
.estados-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.estados-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.estados-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

// Mobile Cards
.estados-mobile {
  padding: 1rem;
}

.estado-card-mobile {
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

.estado-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.estado-periodo {
  flex: 1;
  min-width: 0;
}

.periodo-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-oscuro);
  margin: 0 0 0.25rem 0;
}

.periodo-concepto {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.8rem;
}

.estado-details-mobile {
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

.estado-actions-mobile {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

// Desktop Table
.estados-desktop {
  overflow-x: auto;
}

.table-responsive {
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
}

.estados-table {
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

.estado-row {
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
  }
}

.periodo-cell {
  .periodo-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .periodo-concepto {
    opacity: 0.7;
    font-size: 0.8rem;
  }
}

.monto-value {
  font-weight: 600;
  color: var(--color-primario);
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
  
  &.estado-badge--danger {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
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
  
  &.action-btn--download {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--color-éxito);
    
    &:hover {
      background-color: var(--color-éxito);
      color: var(--color-fondo);
    }
  }
  
  &.action-btn--pay {
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
  padding: 3rem 1rem;
  color: var(--color-oscuro);
  
  i {
    font-size: 4rem;
    opacity: 0.3;
    margin-bottom: 1rem;
    display: block;
  }
  
  h4 {
    color: var(--color-oscuro);
    margin-bottom: 0.5rem;
  }
  
  p {
    opacity: 0.7;
    margin-bottom: 1.5rem;
  }
}

// Buttons
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
  
  &.btn-primary {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    border: 2px solid transparent;
    color: var(--color-fondo);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(18, 77, 181, 0.3);
    }
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

.text-danger {
  color: var(--color-peligro) !important;
}

</style>
