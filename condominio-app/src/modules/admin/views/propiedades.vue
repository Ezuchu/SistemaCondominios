<template>
  <div class="propiedades-container">
    <!-- Header -->
    <div class="propiedades-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="bi bi-building"></i>
          Gestión de Propiedades
        </h1>
        <p class="page-subtitle">Administra las propiedades del condominio</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <i class="bi bi-plus"></i>
        <span>Agregar Propiedad</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-card">
        <div class="search-group">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Buscar propiedades..."
              class="search-input"
            >
          </div>
        </div>
        
        <div class="filter-group">
          <select v-model="filterTorre" class="filter-select">
            <option value="">Todas las torres</option>
            <option value="Torre A">Torre A</option>
            <option value="Torre B">Torre B</option>
            <option value="Torre C">Torre C</option>
          </select>
          
          <select v-model="filterEstado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="ocupada">Ocupadas</option>
            <option value="disponible">Disponibles</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stat-card stat-card--total">
        <div class="stat-icon">
          <i class="bi bi-building"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ propertyStats.total }}</div>
          <div class="stat-label">Total Propiedades</div>
        </div>
      </div>
      
      <div class="stat-card stat-card--occupied">
        <div class="stat-icon">
          <i class="bi bi-house-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ propertyStats.occupied }}</div>
          <div class="stat-label">Ocupadas</div>
        </div>
      </div>
      
      <div class="stat-card stat-card--available">
        <div class="stat-icon">
          <i class="bi bi-house-dash"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ propertyStats.available }}</div>
          <div class="stat-label">Disponibles</div>
        </div>
      </div>
    </div>

    <!-- Properties Table -->
    <div class="table-section">
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="bi bi-list-ul"></i>
            Lista de Propiedades
          </h3>
          <div class="table-actions">
            <button class="btn-outline btn-sm" @click="exportProperties">
              <i class="bi bi-download"></i>
              <span class="btn-text">Exportar</span>
            </button>
          </div>
        </div>
        
        <div class="table-container">
          <div class="table-responsive">
            <table class="properties-table">
              <thead>
                <tr>
                  <th>Propiedad</th>
                  <th>Torre/Edificio</th>
                  <th class="d-none d-md-table-cell">Alícuota</th>
                  <th>Propietario</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in filteredProperties" :key="property.id" class="table-row">
                  <td>
                    <div class="property-cell">
                      <div class="property-icon">
                        <i class="bi bi-house"></i>
                      </div>
                      <div class="property-info">
                        <div class="property-name">{{ property.nombre }}</div>
                        <div class="property-number">N° {{ property.numero }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="torre-badge">{{ property.torre }}</span>
                  </td>
                  <td class="d-none d-md-table-cell">
                    <span class="alicuota-text">{{ property.alicuota }}%</span>
                  </td>
                  <td>
                    <div v-if="property.propietario" class="owner-info">
                      <div class="owner-name">{{ property.propietario.nombre }}</div>
                      <div class="owner-email">{{ property.propietario.email }}</div>
                    </div>
                    <span v-else class="no-owner">Sin asignar</span>
                  </td>
                  <td>
                    <span class="status-badge" :class="property.estado">
                      <i :class="property.estado === 'ocupada' ? 'bi bi-house-check' : 'bi bi-house-dash'"></i>
                      {{ property.estado === 'ocupada' ? 'Ocupada' : 'Disponible' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button @click="viewProperty(property)" class="btn-action btn-action--view" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button @click="editProperty(property)" class="btn-action btn-action--edit" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button @click="deleteProperty(property)" class="btn-action btn-action--delete" title="Eliminar">
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
    </div>

    <!-- Create/Edit Property Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i :class="showCreateModal ? 'bi bi-building-add' : 'bi bi-pencil'"></i>
            {{ showCreateModal ? 'Agregar Nueva Propiedad' : 'Editar Propiedad' }}
          </h3>
          <button @click="closeModals" class="modal-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveProperty" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Número de Propiedad</label>
              <input v-model="propertyForm.numero" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Nombre/Descripción</label>
              <input v-model="propertyForm.nombre" type="text" class="form-input" required>
            </div>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Torre/Edificio</label>
              <select v-model="propertyForm.torre" class="form-select" required>
                <option value="">Seleccionar torre</option>
                <option value="Torre A">Torre A</option>
                <option value="Torre B">Torre B</option>
                <option value="Torre C">Torre C</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Alícuota (%)</label>
              <input v-model="propertyForm.alicuota" type="number" step="0.01" class="form-input" required>
            </div>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Área (m²)</label>
              <input v-model="propertyForm.area" type="number" step="0.01" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Tipo</label>
              <select v-model="propertyForm.tipo" class="form-select" required>
                <option value="">Seleccionar tipo</option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="local">Local Comercial</option>
                <option value="oficina">Oficina</option>
                <option value="deposito">Depósito</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Propietario</label>
            <select v-model="propertyForm.propietarioId" class="form-select">
              <option value="">Sin asignar</option>
              <option v-for="owner in availableOwners" :key="owner.id" :value="owner.id">
                {{ owner.nombre }} - {{ owner.email }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Observaciones</label>
            <textarea v-model="propertyForm.observaciones" rows="3" class="form-textarea"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              <i :class="showCreateModal ? 'bi bi-plus' : 'bi bi-check'"></i>
              <span>{{ showCreateModal ? 'Crear Propiedad' : 'Guardar Cambios' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Property Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="bi bi-house-door"></i>
            Detalles de la Propiedad
          </h3>
          <button @click="showDetailsModal = false" class="modal-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedProperty">
          <div class="property-details">
            <div class="detail-section">
              <h4 class="section-title">Información General</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Número:</label>
                  <span>{{ selectedProperty.numero }}</span>
                </div>
                <div class="detail-item">
                  <label>Nombre:</label>
                  <span>{{ selectedProperty.nombre }}</span>
                </div>
                <div class="detail-item">
                  <label>Torre/Edificio:</label>
                  <span>{{ selectedProperty.torre }}</span>
                </div>
                <div class="detail-item">
                  <label>Tipo:</label>
                  <span>{{ selectedProperty.tipo }}</span>
                </div>
                <div class="detail-item">
                  <label>Área:</label>
                  <span>{{ selectedProperty.area }} m²</span>
                </div>
                <div class="detail-item">
                  <label>Alícuota:</label>
                  <span>{{ selectedProperty.alicuota }}%</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedProperty.propietario">
              <h4 class="section-title">Propietario</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Nombre:</label>
                  <span>{{ selectedProperty.propietario.nombre }}</span>
                </div>
                <div class="detail-item">
                  <label>Email:</label>
                  <span>{{ selectedProperty.propietario.email }}</span>
                </div>
                <div class="detail-item">
                  <label>Teléfono:</label>
                  <span>{{ selectedProperty.propietario.telefono || 'No registrado' }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedProperty.observaciones">
              <h4 class="section-title">Observaciones</h4>
              <p class="observations-text">{{ selectedProperty.observaciones }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchTerm = ref('')
const filterTorre = ref('')
const filterEstado = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const selectedProperty = ref(null)

const propertyForm = ref({
  numero: '',
  nombre: '',
  torre: '',
  alicuota: '',
  area: '',
  tipo: '',
  propietarioId: '',
  observaciones: ''
})

const properties = ref([
  {
    id: 1,
    numero: '101',
    nombre: 'Apartamento 101',
    torre: 'Torre A',
    alicuota: 2.5,
    area: 85,
    tipo: 'apartamento',
    estado: 'ocupada',
    propietario: {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      telefono: '+58 412-1234567'
    },
    observaciones: 'Apartamento en excelente estado'
  },
  {
    id: 2,
    numero: '102',
    nombre: 'Apartamento 102',
    torre: 'Torre A',
    alicuota: 2.5,
    area: 85,
    tipo: 'apartamento',
    estado: 'disponible',
    propietario: null,
    observaciones: ''
  },
  {
    id: 3,
    numero: '201',
    nombre: 'Apartamento 201',
    torre: 'Torre B',
    alicuota: 3.0,
    area: 95,
    tipo: 'apartamento',
    estado: 'ocupada',
    propietario: {
      id: 2,
      nombre: 'María González',
      email: 'maria.gonzalez@email.com',
      telefono: '+58 414-7654321'
    },
    observaciones: 'Apartamento con vista al jardín'
  },
  {
    id: 4,
    numero: '301',
    nombre: 'Apartamento 301',
    torre: 'Torre C',
    alicuota: 3.5,
    area: 110,
    tipo: 'apartamento',
    estado: 'ocupada',
    propietario: {
      id: 3,
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      telefono: '+58 416-9876543'
    },
    observaciones: 'Penthouse con terraza'
  }
])

const availableOwners = ref([
  { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@email.com' },
  { id: 2, nombre: 'María González', email: 'maria.gonzalez@email.com' },
  { id: 3, nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com' },
  { id: 4, nombre: 'Ana Martínez', email: 'ana.martinez@email.com' }
])

const propertyStats = computed(() => ({
  total: properties.value.length,
  occupied: properties.value.filter(p => p.estado === 'ocupada').length,
  available: properties.value.filter(p => p.estado === 'disponible').length
}))

const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    const matchesSearch = !searchTerm.value || 
      property.numero.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      property.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      property.torre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (property.propietario && property.propietario.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()))
    
    const matchesTorre = !filterTorre.value || property.torre === filterTorre.value
    const matchesEstado = !filterEstado.value || property.estado === filterEstado.value
    
    return matchesSearch && matchesTorre && matchesEstado
  })
})

const viewProperty = (property) => {
  selectedProperty.value = property
  showDetailsModal.value = true
}

const editProperty = (property) => {
  selectedProperty.value = property
  propertyForm.value = {
    numero: property.numero,
    nombre: property.nombre,
    torre: property.torre,
    alicuota: property.alicuota,
    area: property.area,
    tipo: property.tipo,
    propietarioId: property.propietario ? property.propietario.id : '',
    observaciones: property.observaciones || ''
  }
  showEditModal.value = true
}

const deleteProperty = (property) => {
  if (confirm(`¿Está seguro de eliminar la propiedad ${property.nombre}?`)) {
    properties.value = properties.value.filter(p => p.id !== property.id)
  }
}

const saveProperty = () => {
  const propietario = propertyForm.value.propietarioId ? 
    availableOwners.value.find(o => o.id == propertyForm.value.propietarioId) : null
  
  if (showCreateModal.value) {
    const newProperty = {
      id: Date.now(),
      ...propertyForm.value,
      alicuota: parseFloat(propertyForm.value.alicuota),
      area: parseFloat(propertyForm.value.area),
      estado: propietario ? 'ocupada' : 'disponible',
      propietario
    }
    properties.value.push(newProperty)
  } else {
    const index = properties.value.findIndex(p => p.id === selectedProperty.value.id)
    if (index !== -1) {
      properties.value[index] = {
        ...properties.value[index],
        ...propertyForm.value,
        alicuota: parseFloat(propertyForm.value.alicuota),
        area: parseFloat(propertyForm.value.area),
        estado: propietario ? 'ocupada' : 'disponible',
        propietario
      }
    }
  }
  
  closeModals()
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDetailsModal.value = false
  selectedProperty.value = null
  propertyForm.value = {
    numero: '',
    nombre: '',
    torre: '',
    alicuota: '',
    area: '',
    tipo: '',
    propietarioId: '',
    observaciones: ''
  }
}

const exportProperties = () => {
  alert('Funcionalidad de exportación en desarrollo')
}
</script>

<style scoped lang="scss">
.propiedades-container {
  padding: 2rem;
  background: var(--color-claro);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Header
.propiedades-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
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
}

.btn-primary {
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
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(18, 77, 181, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  i {
    font-size: 1rem;
  }
}

// Filters
.filters-section {
  margin-bottom: 2rem;
}

.filters-card {
  background: var(--color-fondo);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem;
  }
}

.search-group {
  flex: 1;
}

.search-box {
  position: relative;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: none;
  }
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-oscuro);
  opacity: 0.5;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  background: var(--color-claro);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    background: var(--color-fondo);
    box-shadow: 0 0 0 3px rgba(18, 77, 181, 0.1);
  }
  
  &::placeholder {
    color: var(--color-oscuro);
    opacity: 0.5;
  }
}

.filter-group {
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
}

.filter-select {
  padding: 0.875rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  background: var(--color-claro);
  color: var(--color-oscuro);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    background: var(--color-fondo);
    box-shadow: 0 0 0 3px rgba(18, 77, 181, 0.1);
  }
  
  @media (max-width: 576px) {
    min-width: auto;
  }
}

// Stats
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
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
    padding: 1rem;
  }
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--color-fondo);
  flex-shrink: 0;
  
  .stat-card--total & {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  }
  
  .stat-card--occupied & {
    background: linear-gradient(135deg, var(--color-éxito), #4caf50);
  }
  
  .stat-card--available & {
    background: linear-gradient(135deg, var(--color-naranja), #ff9800);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-oscuro);
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-oscuro);
  opacity: 0.7;
  font-weight: 500;
}

// Table
.table-section {
  margin-bottom: 2rem;
}

.table-card {
  background: var(--color-fondo);
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem;
  }
}

.table-title {
  color: var(--color-primario);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    font-size: 1rem;
  }
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-outline {
  background: none;
  border: 1px solid var(--color-primario);
  color: var(--color-primario);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  
  &:hover {
    background: var(--color-primario);
    color: var(--color-fondo);
  }
  
  &.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .btn-text {
    @media (max-width: 480px) {
      display: none;
    }
  }
}

.table-container {
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.properties-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  min-width: 700px;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    min-width: 600px;
  }
}

.properties-table th {
  background: var(--color-claro);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-oscuro);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }
}

.properties-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  vertical-align: middle;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }
}

.table-row {
  transition: background-color 0.3s ease;
  
  &:hover {
    background: var(--color-azul-claro);
  }
}

.property-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
}

.property-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fondo);
  font-size: 1rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }
}

.property-info {
  min-width: 0;
}

.property-name {
  font-weight: 600;
  color: var(--color-oscuro);
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
}

.property-number {
  font-size: 0.75rem;
  color: var(--color-oscuro);
  opacity: 0.6;
}

.torre-badge {
  background: linear-gradient(135deg, rgba(18, 77, 181, 0.2), rgba(18, 77, 181, 0.1));
  color: var(--color-primario);
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.alicuota-text {
  color: var(--color-oscuro);
  font-weight: 500;
}

.owner-info {
  display: flex;
  flex-direction: column;
}

.owner-name {
  font-weight: 500;
  color: var(--color-oscuro);
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
}

.owner-email {
  font-size: 0.75rem;
  color: var(--color-oscuro);
  opacity: 0.6;
}

.no-owner {
  color: var(--color-oscuro);
  opacity: 0.5;
  font-style: italic;
  font-size: 0.85rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  
  &.ocupada {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(40, 167, 69, 0.1));
    color: var(--color-éxito);
  }
  
  &.disponible {
    background: linear-gradient(135deg, rgba(255, 168, 1, 0.2), rgba(255, 168, 1, 0.1));
    color: var(--color-naranja);
  }
  
  i {
    font-size: 0.75rem;
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.btn-action--view {
    background: linear-gradient(135deg, rgba(0, 89, 255, 0.2), rgba(0, 89, 255, 0.1));
    color: var(--color-informativo);
    
    &:hover {
      background: var(--color-informativo);
      color: var(--color-fondo);
    }
  }
  
  &.btn-action--edit {
    background: linear-gradient(135deg, rgba(255, 168, 1, 0.2), rgba(255, 168, 1, 0.1));
    color: var(--color-naranja);
    
    &:hover {
      background: var(--color-naranja);
      color: var(--color-fondo);
    }
  }
  
  &.btn-action--delete {
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.2), rgba(220, 53, 69, 0.1));
    color: var(--color-peligro);
    
    &:hover {
      background: var(--color-peligro);
      color: var(--color-fondo);
    }
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}

// Modal
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--color-fondo);
  border-radius: 1rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 576px) {
    margin: 0.5rem;
    max-width: none;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  @media (max-width: 576px) {
    padding: 1rem;
  }
}

.modal-title {
  margin: 0;
  color: var(--color-primario);
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    font-size: 1.1rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-oscuro);
  opacity: 0.5;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    background: var(--color-claro);
  }
}

.modal-body {
  padding: 1.5rem;
  
  @media (max-width: 576px) {
    padding: 1rem;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-oscuro);
  font-size: 0.9rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  background: var(--color-claro);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    background: var(--color-fondo);
    box-shadow: 0 0 0 3px rgba(18, 77, 181, 0.1);
  }
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
}

// Property Details
.property-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  .section-title {
    margin: 0 0 1rem 0;
    color: var(--color-primario);
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-weight: 500;
    color: var(--color-oscuro);
    opacity: 0.7;
    font-size: 0.85rem;
  }
  
  span {
    color: var(--color-oscuro);
    font-size: 0.95rem;
  }
}

.observations-text {
  color: var(--color-oscuro);
  line-height: 1.6;
  margin: 0;
}

// Responsive utilities
.d-none {
  display: none !important;
}

.d-md-table-cell {
  @media (min-width: 768px) {
    display: table-cell !important;
  }
}
</style>
