<template>
  <div class="propiedades-view">
    <!-- Header -->
    <div class="view-header">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Buscar propiedades..."
          class="search-input"
        >
      </div>
      
      <button @click="showCreateModal = true" class="btn-primary">
        <i class="fas fa-plus"></i>
        Agregar Propiedad
      </button>
    </div>

    <!-- Properties Table -->
    <div class="table-container">
      <table class="properties-table">
        <thead>
          <tr>
            <th>Propiedad</th>
            <th>Torre/Edificio</th>
            <th>Alícuota</th>
            <th>Propietario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="property in filteredProperties" :key="property.id">
            <td>
              <div class="property-info">
                <div class="property-icon">
                  <i class="fas fa-home"></i>
                </div>
                <div>
                  <div class="property-name">{{ property.nombre }}</div>
                  <div class="property-number">N° {{ property.numero }}</div>
                </div>
              </div>
            </td>
            <td>{{ property.torre }}</td>
            <td>{{ property.alicuota }}%</td>
            <td>
              <div v-if="property.propietario" class="owner-info">
                <div class="owner-name">{{ property.propietario.nombre }}</div>
                <div class="owner-email">{{ property.propietario.email }}</div>
              </div>
              <span v-else class="no-owner">Sin asignar</span>
            </td>
            <td>
              <span class="status-badge" :class="property.estado">
                {{ property.estado === 'ocupada' ? 'Ocupada' : 'Disponible' }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewProperty(property)" class="btn-action view" title="Ver detalles">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editProperty(property)" class="btn-action edit" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteProperty(property)" class="btn-action delete" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Property Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateModal ? 'Agregar Nueva Propiedad' : 'Editar Propiedad' }}</h3>
          <button @click="closeModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveProperty" class="property-form">
          <div class="form-row">
            <div class="form-group">
              <label>Número de Propiedad</label>
              <input v-model="propertyForm.numero" type="text" required>
            </div>
            <div class="form-group">
              <label>Nombre/Descripción</label>
              <input v-model="propertyForm.nombre" type="text" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Torre/Edificio</label>
              <input v-model="propertyForm.torre" type="text" required>
            </div>
            <div class="form-group">
              <label>Alícuota (%)</label>
              <input v-model="propertyForm.alicuota" type="number" step="0.01" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Área (m²)</label>
              <input v-model="propertyForm.area" type="number" step="0.01">
            </div>
            <div class="form-group">
              <label>Tipo</label>
              <select v-model="propertyForm.tipo" required>
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
            <label>Propietario</label>
            <select v-model="propertyForm.propietarioId">
              <option value="">Sin asignar</option>
              <option v-for="owner in availableOwners" :key="owner.id" :value="owner.id">
                {{ owner.nombre }} - {{ owner.email }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Observaciones</label>
            <textarea v-model="propertyForm.observaciones" rows="3"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModals" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ showCreateModal ? 'Crear Propiedad' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Property Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalles de la Propiedad</h3>
          <button @click="showDetailsModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="property-details" v-if="selectedProperty">
          <div class="detail-section">
            <h4>Información General</h4>
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
            <h4>Propietario</h4>
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
            <h4>Observaciones</h4>
            <p>{{ selectedProperty.observaciones }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PropiedadesView',
  data() {
    return {
      searchTerm: '',
      showCreateModal: false,
      showEditModal: false,
      showDetailsModal: false,
      selectedProperty: null,
      propertyForm: {
        numero: '',
        nombre: '',
        torre: '',
        alicuota: '',
        area: '',
        tipo: '',
        propietarioId: '',
        observaciones: ''
      },
      properties: [
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
        }
      ],
      availableOwners: [
        { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@email.com' },
        { id: 2, nombre: 'María González', email: 'maria.gonzalez@email.com' },
        { id: 3, nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com' }
      ]
    }
  },
  computed: {
    filteredProperties() {
      return this.properties.filter(property => {
        return !this.searchTerm || 
          property.numero.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          property.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          property.torre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (property.propietario && property.propietario.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()))
      })
    }
  },
  methods: {
    viewProperty(property) {
      this.selectedProperty = property
      this.showDetailsModal = true
    },
    editProperty(property) {
      this.selectedProperty = property
      this.propertyForm = {
        numero: property.numero,
        nombre: property.nombre,
        torre: property.torre,
        alicuota: property.alicuota,
        area: property.area,
        tipo: property.tipo,
        propietarioId: property.propietario ? property.propietario.id : '',
        observaciones: property.observaciones || ''
      }
      this.showEditModal = true
    },
    deleteProperty(property) {
      if (confirm(`¿Está seguro de eliminar la propiedad ${property.nombre}?`)) {
        this.properties = this.properties.filter(p => p.id !== property.id)
      }
    },
    saveProperty() {
      const propietario = this.propertyForm.propietarioId ? 
        this.availableOwners.find(o => o.id == this.propertyForm.propietarioId) : null
      
      if (this.showCreateModal) {
        const newProperty = {
          id: Date.now(),
          ...this.propertyForm,
          alicuota: parseFloat(this.propertyForm.alicuota),
          area: parseFloat(this.propertyForm.area),
          estado: propietario ? 'ocupada' : 'disponible',
          propietario
        }
        this.properties.push(newProperty)
      } else {
        const index = this.properties.findIndex(p => p.id === this.selectedProperty.id)
        if (index !== -1) {
          this.properties[index] = {
            ...this.properties[index],
            ...this.propertyForm,
            alicuota: parseFloat(this.propertyForm.alicuota),
            area: parseFloat(this.propertyForm.area),
            estado: propietario ? 'ocupada' : 'disponible',
            propietario
          }
        }
      }
      
      this.closeModals()
    },
    closeModals() {
      this.showCreateModal = false
      this.showEditModal = false
      this.showDetailsModal = false
      this.selectedProperty = null
      this.propertyForm = {
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
  }
}
</script>

<style scoped>
.propiedades-view {
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.properties-table {
  width: 100%;
  border-collapse: collapse;
}

.properties-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
}

.properties-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.property-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.property-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.property-name {
  font-weight: 500;
  color: #1a202c;
}

.property-number {
  font-size: 0.75rem;
  color: #64748b;
}

.owner-info {
  display: flex;
  flex-direction: column;
}

.owner-name {
  font-weight: 500;
  color: #1a202c;
}

.owner-email {
  font-size: 0.75rem;
  color: #64748b;
}

.no-owner {
  color: #64748b;
  font-style: italic;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.ocupada {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.disponible {
  background: #fef3c7;
  color: #92400e;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-action.view {
  background: #e0f2fe;
  color: #0277bd;
}

.btn-action.edit {
  background: #fff3e0;
  color: #f57c00;
}

.btn-action.delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-action:hover {
  transform: scale(1.1);
}

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
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f1f5f9;
}

.property-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
}

.property-details {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.125rem;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  font-weight: 500;
  color: #64748b;
  font-size: 0.875rem;
}

.detail-item span {
  color: #1a202c;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .properties-table {
    font-size: 0.875rem;
  }
  
  .properties-table th,
  .properties-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
