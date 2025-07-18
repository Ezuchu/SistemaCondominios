<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-title-section">
          <h4 class="modal-title">{{ actividad?.nombre }}</h4>
          <span :class="['modal-badge', `modal-badge--${getEstadoColor(actividad?.estado)}`]">
            {{ actividad?.estado }}
          </span>
        </div>
        <button class="modal-close" @click="$emit('close')">
          <i class="bi bi-x"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="actividad-meta">
          <div class="meta-item">
            <i class="bi bi-geo-alt"></i>
            <span>{{ actividad?.area }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-calendar3"></i>
            <span>{{ formatearFecha(actividad?.fechaProgramada) }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-flag"></i>
            <span :class="`prioridad--${actividad?.prioridad}`">
              Prioridad {{ actividad?.prioridad }}
            </span>
          </div>
        </div>
        
        <div class="actividad-contenido">
          <div class="contenido-section">
            <h6 class="section-title">
              <i class="bi bi-file-text me-2"></i>
              Descripción
            </h6>
            <p class="section-content">{{ actividad?.descripcion }}</p>
          </div>
          
          <div class="contenido-section" v-if="actividad?.observaciones">
            <h6 class="section-title">
              <i class="bi bi-chat-left-text me-2"></i>
              Observaciones
            </h6>
            <p class="section-content">{{ actividad?.observaciones }}</p>
          </div>
          
          <div class="contenido-section">
            <h6 class="section-title">
              <i class="bi bi-info-circle me-2"></i>
              Información Adicional
            </h6>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Fecha de Creación:</span>
                <span class="info-value">{{ formatearFecha(actividad?.fechaCreacion) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ID de Actividad:</span>
                <span class="info-value">#{{ actividad?.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" @click="$emit('close')">
          Cerrar
        </button>
        <button 
          v-if="actividad?.estado === 'pendiente'"
          class="btn btn-success" 
          @click="completarActividad"
        >
          <i class="bi bi-check-circle me-2"></i>
          Marcar como Completada
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  actividad: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'completar'])

const getEstadoColor = (estado) => {
  const colores = {
    pendiente: 'warning',
    'en-progreso': 'info',
    completada: 'success',
    cancelada: 'danger'
  }
  return colores[estado] || 'secondary'
}

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const completarActividad = () => {
  emit('completar', props.actividad.id)
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
  max-width: 600px;
  max-height: 80vh;
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.modal-title-section {
  flex: 1;
  min-width: 0;
}

.modal-title {
  margin: 0 0 0.5rem 0;
  color: var(--color-primario);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
}

.modal-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 500;
  text-transform: capitalize;
  
  &.modal-badge--warning {
    background-color: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.modal-badge--info {
    background-color: var(--color-azul-claro);
    color: var(--color-informativo);
  }
  
  &.modal-badge--success {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--color-éxito);
  }
  
  &.modal-badge--danger {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
  }
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

.actividad-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-oscuro);
  font-size: 0.9rem;
  
  i {
    color: var(--color-primario);
    font-size: 1rem;
  }
  
  .prioridad--alta {
    color: var(--color-peligro);
    font-weight: 600;
  }
  
  .prioridad--media {
    color: var(--color-naranja);
    font-weight: 600;
  }
  
  .prioridad--baja {
    color: var(--color-éxito);
    font-weight: 600;
  }
}

.actividad-contenido {
  color: var(--color-oscuro);
  line-height: 1.6;
}

.contenido-section {
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  color: var(--color-primario);
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.section-content {
  margin: 0;
  color: var(--color-oscuro);
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.info-label {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.9rem;
  font-weight: 500;
}

.info-value {
  color: var(--color-oscuro);
  font-weight: 600;
  font-size: 0.9rem;
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
  
  &.btn-outline {
    background: none;
    border: 2px solid var(--color-primario);
    color: var(--color-primario);
    
    &:hover {
      background-color: var(--color-primario);
      color: var(--color-fondo);
    }
  }
  
  &.btn-success {
    background: linear-gradient(135deg, var(--color-éxito), #1e7e34);
    border: 2px solid transparent;
    color: var(--color-fondo);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>
