<template>
  <div class="calendario-view">
    <!-- Header -->
    <div class="view-header">
      <button class="back-btn d-lg-none" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="view-title">Calendario de Mantenimiento</h2>
        <p class="view-subtitle">Vista de actividades programadas</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline btn-sm" @click="cambiarVista('mensual')" :class="{ active: vistaActual === 'mensual' }">
          <i class="bi bi-calendar3 me-2"></i>
          Mensual
        </button>
        <button class="btn btn-outline btn-sm" @click="cambiarVista('semanal')" :class="{ active: vistaActual === 'semanal' }">
          <i class="bi bi-calendar-week me-2"></i>
          Semanal
        </button>
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
          
          <!-- Estado -->
          <div class="filter-group">
            <label class="filter-label">Estado</label>
            <div class="select-wrapper">
              <select class="filter-select" v-model="filtros.estado">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en-progreso">En Progreso</option>
                <option value="completada">Completada</option>
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

    <!-- Calendar Navigation -->
    <div class="calendar-nav">
      <button class="nav-btn" @click="navegarMes(-1)">
        <i class="bi bi-chevron-left"></i>
      </button>
      <h4 class="calendar-title">{{ tituloCalendario }}</h4>
      <button class="nav-btn" @click="navegarMes(1)">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-container">
      <!-- Vista Mensual -->
      <div v-if="vistaActual === 'mensual'" class="calendar-monthly">
        <div class="calendar-header">
          <div v-for="dia in diasSemana" :key="dia" class="day-header">
            {{ dia }}
          </div>
        </div>
        <div class="calendar-grid">
          <div 
            v-for="dia in diasMes" 
            :key="`${dia.fecha}-${dia.mes}`"
            :class="['calendar-day', {
              'calendar-day--other-month': dia.otroMes,
              'calendar-day--today': esHoy(dia.fecha),
              'calendar-day--has-events': tieneEventos(dia.fecha)
            }]"
            @click="seleccionarDia(dia)"
          >
            <span class="day-number">{{ dia.numero }}</span>
            <div class="day-events">
              <div 
                v-for="evento in getEventosDia(dia.fecha)" 
                :key="evento.id"
                :class="['event-dot', `event-dot--${getEstadoColor(evento.estado)}`]"
                @click.stop="verDetalleEvento(evento)"
                :title="evento.nombre"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Semanal -->
      <div v-else class="calendar-weekly">
        <div class="week-header">
          <div class="time-column"></div>
          <div v-for="dia in diasSemanaActual" :key="dia.fecha" class="week-day-header">
            <div class="day-name">{{ dia.nombre }}</div>
            <div class="day-date" :class="{ 'day-date--today': esHoy(dia.fecha) }">
              {{ dia.numero }}
            </div>
          </div>
        </div>
        <div class="week-grid">
          <div class="time-slots">
            <div v-for="hora in horasDelDia" :key="hora" class="time-slot">
              {{ hora }}:00
            </div>
          </div>
          <div v-for="dia in diasSemanaActual" :key="dia.fecha" class="week-day-column">
            <div v-for="hora in horasDelDia" :key="hora" class="hour-slot">
              <div 
                v-for="evento in getEventosHora(dia.fecha, hora)" 
                :key="evento.id"
                :class="['week-event', `week-event--${getEstadoColor(evento.estado)}`]"
                @click="verDetalleEvento(evento)"
              >
                <div class="event-time">{{ evento.hora }}</div>
                <div class="event-title">{{ evento.nombre }}</div>
                <div class="event-area">{{ evento.area }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <modal-detalle-actividad 
      :show="showModalDetalle" 
      :actividad="eventoSeleccionado"
      @close="cerrarModalDetalle"
      @completar="marcarCompletada"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import modalDetalleActividad from '../components/modalDetalleActividad.vue'

defineEmits(['back'])

// Estado reactivo
const showFilters = ref(false)
const vistaActual = ref('mensual')
const fechaActual = ref(new Date())
const showModalDetalle = ref(false)
const eventoSeleccionado = ref(null)

const filtros = ref({
  area: '',
  estado: ''
})

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const horasDelDia = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 - 19:00

// Datos de ejemplo
const eventos = ref([
  {
    id: 1,
    nombre: 'Mantenimiento Ascensores',
    descripcion: 'Revisión mensual de todos los ascensores',
    area: 'Ascensores',
    fecha: '2024-01-20',
    hora: '09:00',
    estado: 'pendiente',
    prioridad: 'alta'
  },
  {
    id: 2,
    nombre: 'Limpieza Piscina',
    descripcion: 'Limpieza semanal y revisión de químicos',
    area: 'Piscina',
    fecha: '2024-01-18',
    hora: '10:00',
    estado: 'en-progreso',
    prioridad: 'media'
  },
  {
    id: 3,
    nombre: 'Revisión Eléctrica',
    descripcion: 'Inspección de tableros eléctricos',
    area: 'Instalaciones Eléctricas',
    fecha: '2024-01-22',
    hora: '14:00',
    estado: 'pendiente',
    prioridad: 'alta'
  },
  {
    id: 4,
    nombre: 'Jardinería',
    descripcion: 'Poda y mantenimiento de áreas verdes',
    area: 'Jardines',
    fecha: '2024-01-19',
    hora: '08:00',
    estado: 'completada',
    prioridad: 'baja'
  }
])

// Computed properties
const tituloCalendario = computed(() => {
  const opciones = { year: 'numeric', month: 'long' }
  return fechaActual.value.toLocaleDateString('es-ES', opciones)
})

const diasMes = computed(() => {
  const año = fechaActual.value.getFullYear()
  const mes = fechaActual.value.getMonth()
  
  const primerDia = new Date(año, mes, 1)
  const ultimoDia = new Date(año, mes + 1, 0)
  const diasEnMes = ultimoDia.getDate()
  
  const primerDiaSemana = primerDia.getDay()
  const dias = []
  
  // Días del mes anterior
  const mesAnterior = new Date(año, mes - 1, 0)
  for (let i = primerDiaSemana - 1; i >= 0; i--) {
    dias.push({
      numero: mesAnterior.getDate() - i,
      fecha: new Date(año, mes - 1, mesAnterior.getDate() - i).toISOString().split('T')[0],
      otroMes: true,
      mes: mes - 1
    })
  }
  
  // Días del mes actual
  for (let dia = 1; dia <= diasEnMes; dia++) {
    dias.push({
      numero: dia,
      fecha: new Date(año, mes, dia).toISOString().split('T')[0],
      otroMes: false,
      mes: mes
    })
  }
  
  // Días del mes siguiente para completar la grilla
  const diasRestantes = 42 - dias.length
  for (let dia = 1; dia <= diasRestantes; dia++) {
    dias.push({
      numero: dia,
      fecha: new Date(año, mes + 1, dia).toISOString().split('T')[0],
      otroMes: true,
      mes: mes + 1
    })
  }
  
  return dias
})

const diasSemanaActual = computed(() => {
  const hoy = new Date()
  const inicioSemana = new Date(hoy)
  inicioSemana.setDate(hoy.getDate() - hoy.getDay())
  
  const dias = []
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(inicioSemana)
    fecha.setDate(inicioSemana.getDate() + i)
    dias.push({
      nombre: diasSemana[i],
      numero: fecha.getDate(),
      fecha: fecha.toISOString().split('T')[0]
    })
  }
  
  return dias
})

const eventosFiltrados = computed(() => {
  let resultado = eventos.value
  
  if (filtros.value.area) {
    resultado = resultado.filter(evento => evento.area === filtros.value.area)
  }
  
  if (filtros.value.estado) {
    resultado = resultado.filter(evento => evento.estado === filtros.value.estado)
  }
  
  return resultado
})

// Métodos
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const cambiarVista = (vista) => {
  vistaActual.value = vista
}

const navegarMes = (direccion) => {
  const nuevaFecha = new Date(fechaActual.value)
  nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion)
  fechaActual.value = nuevaFecha
}

const esHoy = (fecha) => {
  const hoy = new Date().toISOString().split('T')[0]
  return fecha === hoy
}

const tieneEventos = (fecha) => {
  return eventosFiltrados.value.some(evento => evento.fecha === fecha)
}

const getEventosDia = (fecha) => {
  return eventosFiltrados.value.filter(evento => evento.fecha === fecha)
}

const getEventosHora = (fecha, hora) => {
  return eventosFiltrados.value.filter(evento => {
    if (evento.fecha !== fecha) return false
    const eventoHora = parseInt(evento.hora.split(':')[0])
    return eventoHora === hora
  })
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

const limpiarFiltros = () => {
  filtros.value = {
    area: '',
    estado: ''
  }
  showFilters.value = false
}

const seleccionarDia = (dia) => {
  if (dia.otroMes) return
  console.log('Día seleccionado:', dia.fecha)
}

const verDetalleEvento = (evento) => {
  eventoSeleccionado.value = {
    ...evento,
    fechaProgramada: evento.fecha,
    fechaCreacion: evento.fecha
  }
  showModalDetalle.value = true
}

const cerrarModalDetalle = () => {
  showModalDetalle.value = false
  eventoSeleccionado.value = null
}

const marcarCompletada = (id) => {
  const evento = eventos.value.find(e => e.id === id)
  if (evento) {
    evento.estado = 'completada'
  }
  cerrarModalDetalle()
}
</script>

<style scoped lang="scss">
.calendario-view {
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

.header-actions {
  display: flex;
  gap: 0.5rem;
}

// Filters (reutilizando estilos)
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
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    align-items: end;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
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

// Calendar Navigation
.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-btn {
  background: var(--color-azul-claro);
  border: none;
  color: var(--color-primario);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-primario);
    color: var(--color-fondo);
    transform: scale(1.1);
  }
}

.calendar-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  text-transform: capitalize;
}

// Calendar Container
.calendar-container {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

// Monthly View
.calendar-monthly {
  padding: 1rem;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1rem;
}

.day-header {
  padding: 1rem 0.5rem;
  text-align: center;
  font-weight: 600;
  color: var(--color-primario);
  background-color: var(--color-azul-claro);
  font-size: 0.9rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}

.calendar-day {
  background-color: var(--color-fondo);
  min-height: 80px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: var(--color-azul-claro);
  }
  
  &.calendar-day--other-month {
    opacity: 0.3;
    
    &:hover {
      opacity: 0.6;
    }
  }
  
  &.calendar-day--today {
    background-color: var(--color-azul-claro);
    
    .day-number {
      background-color: var(--color-primario);
      color: var(--color-fondo);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  &.calendar-day--has-events {
    border-left: 3px solid var(--color-primario);
  }
}

.day-number {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-oscuro);
}

.day-events {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
  
  &.event-dot--warning {
    background-color: var(--color-naranja);
  }
  
  &.event-dot--info {
    background-color: var(--color-informativo);
  }
  
  &.event-dot--success {
    background-color: var(--color-éxito);
  }
  
  &.event-dot--danger {
    background-color: var(--color-peligro);
  }
}

// Weekly View
.calendar-weekly {
  overflow-x: auto;
}

.week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.time-column {
  background-color: var(--color-claro);
}

.week-day-header {
  padding: 1rem;
  text-align: center;
  background-color: var(--color-azul-claro);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.day-name {
  font-weight: 600;
  color: var(--color-primario);
  font-size: 0.9rem;
}

.day-date {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-oscuro);
  margin-top: 0.25rem;
  
  &.day-date--today {
    color: var(--color-primario);
  }
}

.week-grid {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  min-height: 600px;
}

.time-slots {
  background-color: var(--color-claro);
  border-right: 2px solid rgba(0, 0, 0, 0.1);
}

.time-slot {
  height: 50px;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 0.8rem;
  color: var(--color-oscuro);
  display: flex;
  align-items: center;
  justify-content: center;
}

.week-day-column {
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.hour-slot {
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.week-event {
  position: absolute;
  left: 2px;
  right: 2px;
  top: 2px;
  bottom: 2px;
  border-radius: 0.25rem;
  padding: 0.25rem;
  cursor: pointer;
  font-size: 0.8rem;
  overflow: hidden;
  
  &.week-event--warning {
    background-color: rgba(255, 168, 1, 0.2);
    border-left: 3px solid var(--color-naranja);
  }
  
  &.week-event--info {
    background-color: var(--color-azul-claro);
    border-left: 3px solid var(--color-informativo);
  }
  
  &.week-event--success {
    background-color: rgba(40, 167, 69, 0.2);
    border-left: 3px solid var(--color-éxito);
  }
  
  &.week-event--danger {
    background-color: rgba(255, 101, 30, 0.2);
    border-left: 3px solid var(--color-peligro);
  }
}

.event-time {
  font-weight: 600;
  font-size: 0.7rem;
  opacity: 0.8;
}

.event-title {
  font-weight: 600;
  font-size: 0.8rem;
  line-height: 1.2;
  margin: 0.1rem 0;
}

.event-area {
  font-size: 0.7rem;
  opacity: 0.7;
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
    
    &.active {
      background-color: var(--color-primario);
      color: var(--color-fondo);
    }
  }
}
</style>
