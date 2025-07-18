<template>
    <div class="avisos-view">
        <!-- Header -->
        <div class="view-header">
            <button class="back-btn d-lg-none" @click="$emit('back')">
                <i class="bi bi-arrow-left"></i>
            </button>
            <div class="header-content">
                <h2 class="view-title">Centro de Avisos</h2>
                <p class="view-subtitle">Manténgase informado sobre el condominio</p>
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
                    
                    <!-- Estado -->
                    <div class="filter-group">
                        <label class="filter-label">Estado</label>
                        <div class="select-wrapper">
                            <select class="filter-select" v-model="filtros.estado">
                                <option value="">Todos los estados</option>
                                <option value="activo">Activos</option>
                                <option value="vencido">Vencidos</option>
                            </select>
                            <i class="bi bi-chevron-down select-arrow"></i>
                        </div>
                    </div>
                    
                    <!-- Acciones -->
                    <div class="filter-group filter-group--actions ">
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

        <!-- Avisos Grid -->
        <div class="avisos-grid" v-if="avisosFiltrados.length > 0">
            <div 
                v-for="aviso in avisosFiltrados" 
                :key="aviso.id" 
                class="aviso-card"
                @click="verDetalle(aviso)"
            >
                <div class="aviso-header">
                    <span :class="['aviso-badge', `aviso-badge--${getTipoColor(aviso.tipo)}`]">
                        <i :class="getTipoIcon(aviso.tipo)" class="me-1"></i>
                        {{ aviso.tipo }}
                    </span>
                    <small class="aviso-fecha">{{ formatearFecha(aviso.fecha) }}</small>
                </div>
                
                <div class="aviso-content">
                    <h5 class="aviso-titulo">{{ aviso.titulo }}</h5>
                    <p class="aviso-resumen">{{ aviso.resumen }}</p>
                </div>
                
                <div class="aviso-footer">
                    <div class="aviso-autor">
                        <i class="bi bi-person me-1"></i>
                        {{ aviso.autor }}
                    </div>
                    <button class="aviso-btn">
                        <i class="bi bi-eye me-1"></i>
                        Ver más
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
            <div class="empty-icon">
                <i class="bi bi-inbox"></i>
            </div>
            <h4 class="empty-title">No se encontraron avisos</h4>
            <p class="empty-description">
                {{ filtros.busqueda || filtros.tipo || filtros.estado 
                   ? 'Intente ajustar los filtros de búsqueda' 
                   : 'No hay avisos disponibles en este momento' }}
            </p>
            <button 
                v-if="filtros.busqueda || filtros.tipo || filtros.estado"
                class="btn btn-primary" 
                @click="limpiarFiltros"
            >
                <i class="bi bi-arrow-clockwise me-2"></i>
                Limpiar Filtros
            </button>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPaginas > 1" class="pagination-nav">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                    <button class="page-link" @click="cambiarPagina(paginaActual - 1)">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                </li>
                <li 
                    v-for="pagina in paginasVisibles" 
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

        <!-- Modal Aviso Detalle -->
        <modal-aviso-detalle 
            :show="showModalDetalle" 
            :aviso="avisoSeleccionado"
            @close="cerrarModalDetalle" 
        />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import modalAvisoDetalle from '../components/modalAvisoDetalle.vue'

defineEmits(['back'])

// Estado reactivo
const showFilters = ref(false)
const paginaActual = ref(1)
const avisosPorPagina = 9
const showModalDetalle = ref(false)
const avisoSeleccionado = ref(null)

const filtros = ref({
    busqueda: '',
    tipo: '',
    estado: ''
})

// Datos de ejemplo
const avisos = ref([
    {
        id: 1,
        titulo: 'Mantenimiento de Ascensores',
        resumen: 'Se realizará mantenimiento preventivo en todos los ascensores del edificio el próximo martes.',
        tipo: 'mantenimiento',
        fecha: '2024-01-15',
        autor: 'Administración',
        estado: 'activo',
        contenido: `
            <p>Estimados propietarios,</p>
            <p>Les informamos que el próximo <strong>martes 16 de enero de 2024</strong> se realizará el mantenimiento preventivo de todos los ascensores del edificio.</p>
            <h6>Detalles del mantenimiento:</h6>
            <ul>
                <li>Horario: 8:00 AM - 12:00 PM</li>
                <li>Ascensores afectados: Todos</li>
                <li>Empresa: TecnoElevadores C.A.</li>
            </ul>
            <p>Durante este período, los ascensores no estarán disponibles. Recomendamos planificar sus actividades considerando el uso de las escaleras.</p>
            <p>Agradecemos su comprensión.</p>
        `
    },
    {
        id: 2,
        titulo: 'Asamblea Extraordinaria',
        resumen: 'Convocatoria a asamblea extraordinaria para tratar temas importantes del condominio.',
        tipo: 'asamblea',
        fecha: '2024-01-20',
        autor: 'Junta Directiva',
        estado: 'activo',
        contenido: `
            <p>Estimados propietarios,</p>
            <p>Por medio de la presente se convoca a <strong>Asamblea Extraordinaria</strong> para el día <strong>sábado 27 de enero de 2024</strong>.</p>
            <h6>Orden del día:</h6>
            <ul>
                <li>Aprobación de presupuesto extraordinario</li>
                <li>Renovación del sistema de seguridad</li>
                <li>Mejoras en áreas comunes</li>
                <li>Varios</li>
            </ul>
            <p><strong>Fecha:</strong> Sábado 27 de enero de 2024<br>
            <strong>Hora:</strong> 10:00 AM<br>
            <strong>Lugar:</strong> Salón de eventos del edificio</p>
        `
    },
    {
        id: 3,
        titulo: 'Corte de Agua Programado',
        resumen: 'Se suspenderá el servicio de agua por trabajos de mantenimiento en la red principal.',
        tipo: 'emergencia',
        fecha: '2024-01-10',
        autor: 'Administración',
        estado: 'vencido',
        contenido: `
            <p>Estimados residentes,</p>
            <p>Debido a trabajos de mantenimiento en la red principal de agua potable, se suspenderá el servicio el día <strong>miércoles 17 de enero</strong>.</p>
            <h6>Detalles:</h6>
            <ul>
                <li>Fecha: Miércoles 17 de enero de 2024</li>
                <li>Horario: 6:00 AM - 2:00 PM</li>
                <li>Áreas afectadas: Todo el edificio</li>
            </ul>
            <p>Recomendamos almacenar agua suficiente para el período indicado.</p>
        `
    },
    {
        id: 4,
        titulo: 'Nuevas Normas de Convivencia',
        resumen: 'Se han actualizado las normas de convivencia del condominio. Favor revisar los cambios.',
        tipo: 'general',
        fecha: '2024-01-12',
        autor: 'Junta Directiva',
        estado: 'activo',
        contenido: `
            <p>Estimados propietarios,</p>
            <p>Se han actualizado las normas de convivencia del condominio para mejorar la calidad de vida de todos los residentes.</p>
            <h6>Principales cambios:</h6>
            <ul>
                <li>Horarios de silencio: 10:00 PM - 7:00 AM</li>
                <li>Uso de áreas comunes</li>
                <li>Normas para mascotas</li>
                <li>Estacionamiento de visitantes</li>
            </ul>
            <p>El documento completo está disponible en administración.</p>
        `
    },
    {
        id: 5,
        titulo: 'Fumigación Mensual',
        resumen: 'Se realizará la fumigación mensual en todas las áreas comunes del edificio.',
        tipo: 'mantenimiento',
        fecha: '2024-01-08',
        autor: 'Administración',
        estado: 'vencido',
        contenido: `
            <p>Estimados residentes,</p>
            <p>Se realizará la fumigación mensual programada en todas las áreas comunes.</p>
            <h6>Información importante:</h6>
            <ul>
                <li>Fecha: Viernes 12 de enero de 2024</li>
                <li>Horario: 8:00 AM - 12:00 PM</li>
                <li>Áreas: Pasillos, escaleras, sótanos y azotea</li>
            </ul>
            <p>No es necesario desalojar los apartamentos.</p>
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
            aviso.autor.toLowerCase().includes(busqueda)
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
    let resultado = avisos.value

    if (filtros.value.busqueda) {
        const busqueda = filtros.value.busqueda.toLowerCase()
        resultado = resultado.filter(aviso =>
            aviso.titulo.toLowerCase().includes(busqueda) ||
            aviso.resumen.toLowerCase().includes(busqueda) ||
            aviso.autor.toLowerCase().includes(busqueda)
        )
    }

    if (filtros.value.tipo) {
        resultado = resultado.filter(aviso => aviso.tipo === filtros.value.tipo)
    }

    if (filtros.value.estado) {
        resultado = resultado.filter(aviso => aviso.estado === filtros.value.estado)
    }

    return Math.ceil(resultado.length / avisosPorPagina)
})

const paginasVisibles = computed(() => {
    const total = totalPaginas.value
    const actual = paginaActual.value
    const paginas = []
    
    if (total <= 5) {
        for (let i = 1; i <= total; i++) {
            paginas.push(i)
        }
    } else {
        if (actual <= 3) {
            paginas.push(1, 2, 3, 4, 5)
        } else if (actual >= total - 2) {
            for (let i = total - 4; i <= total; i++) {
                paginas.push(i)
            }
        } else {
            for (let i = actual - 2; i <= actual + 2; i++) {
                paginas.push(i)
            }
        }
    }
    
    return paginas
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

const getTipoIcon = (tipo) => {
    const iconos = {
        mantenimiento: 'bi-tools',
        asamblea: 'bi-people',
        emergencia: 'bi-exclamation-triangle',
        general: 'bi-info-circle'
    }
    return iconos[tipo] || 'bi-file-text'
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
    showFilters.value = false
}

const cambiarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const verDetalle = (aviso) => {
    avisoSeleccionado.value = aviso
    showModalDetalle.value = true
}

const cerrarModalDetalle = () => {
    showModalDetalle.value = false
    avisoSeleccionado.value = null
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

// Filters Card
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
        margin-bottom: 1.5rem;
        overflow: visible;
    }
}

.filters-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    
    @media (min-width: 576px) {
        grid-template-columns: 1fr 1fr;
    }
    
    @media (min-width: 768px) {
        grid-template-columns: 2fr 1fr 1fr auto;
        align-items: end;
    }
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    &.filter-group--search {
        @media (min-width: 576px) {
            grid-column: 1 / -1;
        }
        
        @media (min-width: 768px) {
            grid-column: auto;
        }
    }
    
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
        transform: translateY(-1px);
    }
    
    &::placeholder {
        color: rgba(52, 58, 64, 0.5);
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
        transform: scale(1.1);
    }
    
    &:active {
        transform: scale(0.9);
    }
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

// Avisos Grid
.avisos-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
    
    @media (min-width: 576px) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 992px) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.aviso-card {
    background: var(--color-fondo);
    border-radius: 1rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(18, 77, 181, 0.1);
    
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        border-color: var(--color-primario);
    }
    
    &:active {
        transform: translateY(-4px);
    }
}

.aviso-header {
    padding: 1.25rem 1.25rem 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.aviso-badge {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    border-radius: 2rem;
    font-weight: 600;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    white-space: nowrap;
    
    &.aviso-badge--primary {
        background: linear-gradient(135deg, rgba(18, 77, 181, 0.15), rgba(18, 77, 181, 0.1));
        color: var(--color-primario);
        border: 1px solid rgba(18, 77, 181, 0.2);
    }
    
    &.aviso-badge--warning {
        background: linear-gradient(135deg, rgba(255, 168, 1, 0.15), rgba(255, 168, 1, 0.1));
        color: var(--color-naranja);
        border: 1px solid rgba(255, 168, 1, 0.2);
    }
    
    &.aviso-badge--danger {
        background: linear-gradient(135deg, rgba(255, 101, 30, 0.15), rgba(255, 101, 30, 0.1));
        color: var(--color-peligro);
        border: 1px solid rgba(255, 101, 30, 0.2);
    }
    
    &.aviso-badge--info {
        background: linear-gradient(135deg, var(--color-azul-claro), rgba(0, 89, 255, 0.1));
        color: var(--color-informativo);
        border: 1px solid rgba(0, 89, 255, 0.2);
    }
}

.aviso-fecha {
    color: var(--color-oscuro);
    opacity: 0.6;
    font-size: 0.8rem;
    font-weight: 500;
}

.aviso-content {
    padding: 1.25rem;
}

.aviso-titulo {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-oscuro);
    margin: 0 0 0.75rem 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.aviso-resumen {
    color: var(--color-oscuro);
    opacity: 0.7;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.aviso-footer {
    padding: 0 1.25rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.aviso-autor {
    color: var(--color-oscuro);
    opacity: 0.6;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
}

.aviso-btn {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    border: none;
    color: var(--color-fondo);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    white-space: nowrap;
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(18, 77, 181, 0.4);
    }
    
    &:active {
        transform: translateY(0);
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

// Pagination
.pagination-nav {
    margin-top: 3rem;
    display: flex;
    justify-content: center;
}

.pagination {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
}

.page-item {
    &.disabled .page-link {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
    
    &.active .page-link {
        background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
        color: var(--color-fondo);
        border-color: var(--color-primario);
        transform: scale(1.1);
    }
}

.page-link {
    background: var(--color-fondo);
    border: 2px solid rgba(18, 77, 181, 0.2);
    color: var(--color-primario);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover:not(.disabled) {
        background-color: var(--color-azul-claro);
        border-color: var(--color-primario);
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
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
