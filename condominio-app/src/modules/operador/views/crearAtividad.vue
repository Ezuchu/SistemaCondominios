<template>
  <div class="crear-actividad-view">
    <!-- Header -->
    <div class="view-header">
      <button class="back-btn" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="view-title">Crear Nueva Actividad</h2>
        <p class="view-subtitle">Programa una nueva actividad de mantenimiento</p>
      </div>
    </div>

    <div class="form-container">
      <div class="form-card">
        <div class="form-header">
          <h5 class="form-title">
            <i class="bi bi-plus-circle me-2"></i>
            Información de la Actividad
          </h5>
        </div>
        
        <div class="form-body">
          <form @submit.prevent="crearActividad">
            <div class="form-grid">
              <!-- Nombre de la Actividad -->
              <div class="form-group form-group--full">
                <label class="form-label">Nombre de la Actividad *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.nombre"
                  placeholder="Ej: Mantenimiento de ascensores"
                  required
                >
              </div>

              <!-- Descripción -->
              <div class="form-group form-group--full">
                <label class="form-label">Descripción *</label>
                <textarea 
                  class="form-control" 
                  rows="4"
                  v-model="formData.descripcion"
                  placeholder="Describe detalladamente la actividad a realizar..."
                  required
                ></textarea>
              </div>

              <!-- Área Común -->
              <div class="form-group">
                <label class="form-label">Área Común *</label>
                <div class="select-wrapper">
                  <select class="form-select" v-model="formData.area" required>
                    <option value="">Seleccionar área</option>
                    <option value="Ascensores">Ascensores</option>
                    <option value="Piscina">Piscina</option>
                    <option value="Jardines">Jardines</option>
                    <option value="Instalaciones Eléctricas">Instalaciones Eléctricas</option>
                    <option value="Plomería">Plomería</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Aire Acondicionado">Aire Acondicionado</option>
                  </select>
                  <i class="bi bi-chevron-down select-arrow"></i>
                </div>
              </div>

              <!-- Fecha Programada -->
              <div class="form-group">
                <label class="form-label">Fecha Programada *</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="formData.fechaProgramada"
                  :min="fechaMinima"
                  required
                >
              </div>

              <!-- Hora -->
              <div class="form-group">
                <label class="form-label">Hora</label>
                <input 
                  type="time" 
                  class="form-control" 
                  v-model="formData.hora"
                >
              </div>

              <!-- Prioridad -->
              <div class="form-group">
                <label class="form-label">Prioridad *</label>
                <div class="select-wrapper">
                  <select class="form-select" v-model="formData.prioridad" required>
                    <option value="">Seleccionar prioridad</option>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                  <i class="bi bi-chevron-down select-arrow"></i>
                </div>
              </div>

              <!-- Observaciones -->
              <div class="form-group form-group--full">
                <label class="form-label">Observaciones</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="formData.observaciones"
                  placeholder="Información adicional, materiales necesarios, precauciones especiales..."
                ></textarea>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="$emit('back')">
                <i class="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="creando">
                <span v-if="creando" class="spinner"></span>
                <i v-else class="bi bi-check-circle me-2"></i>
                {{ creando ? 'Creando...' : 'Crear Actividad' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Info Card -->
      <div class="info-card">
        <div class="info-header">
          <h6 class="info-title">
            <i class="bi bi-info-circle me-2"></i>
            Información Importante
          </h6>
        </div>
        <div class="info-body">
          <div class="info-item">
            <i class="bi bi-check-circle text-success"></i>
            <span>Completa todos los campos obligatorios (*)</span>
          </div>
          <div class="info-item">
            <i class="bi bi-calendar3 text-info"></i>
            <span>La fecha debe ser posterior a hoy</span>
          </div>
          <div class="info-item">
            <i class="bi bi-flag text-warning"></i>
            <span>Selecciona la prioridad adecuada</span>
          </div>
          <div class="info-item">
            <i class="bi bi-chat-left-text text-primary"></i>
            <span>Las observaciones ayudan a planificar mejor</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['back', 'created'])

const creando = ref(false)

const formData = ref({
  nombre: '',
  descripcion: '',
  area: '',
  fechaProgramada: '',
  hora: '09:00',
  prioridad: '',
  observaciones: ''
})

const fechaMinima = computed(() => {
  const mañana = new Date()
  mañana.setDate(mañana.getDate() + 1)
  return mañana.toISOString().split('T')[0]
})

const crearActividad = async () => {
  creando.value = true
  
  try {
    // Simular creación
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const nuevaActividad = {
      id: Date.now(),
      ...formData.value,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString().split('T')[0]
    }
    
    console.log('Nueva actividad creada:', nuevaActividad)
    emit('created', nuevaActividad)
    
    // Limpiar formulario
    formData.value = {
      nombre: '',
      descripcion: '',
      area: '',
      fechaProgramada: '',
      hora: '09:00',
      prioridad: '',
      observaciones: ''
    }
    
  } catch (error) {
    console.error('Error al crear actividad:', error)
  } finally {
    creando.value = false
  }
}
</script>

<style scoped lang="scss">
.crear-actividad-view {
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

// Form Container
.form-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 2fr 1fr;
  }
}

// Form Card
.form-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.form-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-azul-claro), rgba(214, 230, 255, 0.5));
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.form-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.form-body {
  padding: 2rem;
}

// Form Grid
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.form-group--full {
    @media (min-width: 768px) {
      grid-column: 1 / -1;
    }
  }
}

.form-label {
  color: var(--color-oscuro);
  font-weight: 500;
  font-size: 0.9rem;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(18, 77, 181, 0.2);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-oscuro);
  background-color: var(--color-fondo);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 4px rgba(18, 77, 181, 0.1);
  }
  
  &::placeholder {
    color: rgba(52, 58, 64, 0.5);
  }
}

.select-wrapper {
  position: relative;
}

.form-select {
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 2px solid rgba(18, 77, 181, 0.2);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-oscuro);
  background-color: var(--color-fondo);
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  width: 100%;
  
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

// Form Actions
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
}

// Info Card
.info-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: fit-content;
}

.info-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-azul-claro), rgba(214, 230, 255, 0.5));
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.info-body {
  padding: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  i {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  
  span {
    color: var(--color-oscuro);
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

// Button Styles
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  min-width: 140px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.btn-outline {
    background: none;
    border: 2px solid var(--color-primario);
    color: var(--color-primario);
    
    &:hover:not(:disabled) {
      background-color: var(--color-primario);
      color: var(--color-fondo);
    }
  }
  
  &.btn-primary {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    border: 2px solid transparent;
    color: var(--color-fondo);
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(18, 77, 181, 0.3);
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid var(--color-fondo);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
