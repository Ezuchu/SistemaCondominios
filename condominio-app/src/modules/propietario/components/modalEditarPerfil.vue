<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h4 class="modal-title">Editar Perfil</h4>
        <button class="modal-close" @click="$emit('close')">
          <i class="bi bi-x"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="guardar">
          <div class="form-section">
            <h6 class="section-title">
              <i class="bi bi-person me-2"></i>
              Información Personal
            </h6>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre Completo *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.nombre"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Cédula/RIF</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.cedula"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Teléfono *</label>
                <input 
                  type="tel" 
                  class="form-control" 
                  v-model="formData.telefono"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="formData.email"
                  required
                >
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h6 class="section-title">
              <i class="bi bi-geo-alt me-2"></i>
              Dirección
            </h6>
            
            <div class="form-group">
              <label class="form-label">Dirección Completa</label>
              <textarea 
                class="form-control" 
                rows="3"
                v-model="formData.direccion"
                placeholder="Ingrese su dirección completa..."
              ></textarea>
            </div>
          </div>
          
          <div class="form-section">
            <h6 class="section-title">
              <i class="bi bi-shield-lock me-2"></i>
              Cambiar Contraseña
            </h6>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Contraseña Actual</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="formData.passwordActual"
                  placeholder="Dejar vacío si no desea cambiar"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Nueva Contraseña</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="formData.passwordNueva"
                  placeholder="Dejar vacío si no desea cambiar"
                >
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" @click="$emit('close')">
          Cancelar
        </button>
        <button class="btn btn-primary" @click="guardar" :disabled="guardando">
          <span v-if="guardando" class="spinner"></span>
          <i v-else class="bi bi-check-circle me-2"></i>
          {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  perfil: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'guardar'])

const guardando = ref(false)
const formData = ref({
  nombre: '',
  cedula: '',
  telefono: '',
  email: '',
  direccion: '',
  passwordActual: '',
  passwordNueva: ''
})

watch(() => props.perfil, (newPerfil) => {
  if (newPerfil) {
    formData.value = {
      nombre: newPerfil.nombre || '',
      cedula: newPerfil.cedula || '',
      telefono: newPerfil.telefono || '',
      email: newPerfil.email || '',
      direccion: newPerfil.direccion || '',
      passwordActual: '',
      passwordNueva: ''
    }
  }
}, { immediate: true })

const guardar = async () => {
  guardando.value = true
  
  try {
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const datosActualizados = { ...formData.value }
    
    // Limpiar campos de contraseña si están vacíos
    if (!datosActualizados.passwordActual || !datosActualizados.passwordNueva) {
      delete datosActualizados.passwordActual
      delete datosActualizados.passwordNueva
    }
    
    emit('guardar', datosActualizados)
  } catch (error) {
    console.error('Error al guardar:', error)
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  color: var(--color-primario);
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-oscuro);
  opacity: 0.6;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  font-size: 1.25rem;
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-section {
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  color: var(--color-primario);
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-azul-claro);
  display: flex;
  align-items: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-oscuro);
  font-weight: 500;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
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
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
}

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
  min-width: 120px;
  
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
