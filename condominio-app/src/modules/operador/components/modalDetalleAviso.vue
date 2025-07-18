<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-title-section">
          <h4 class="modal-title">{{ aviso?.titulo }}</h4>
          <span :class="['modal-badge', `modal-badge--${getTipoColor(aviso?.tipo)}`]">
            {{ aviso?.tipo }}
          </span>
        </div>
        <button class="modal-close" @click="$emit('close')">
          <i class="bi bi-x"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="aviso-meta">
          <div class="meta-item">
            <i class="bi bi-calendar3"></i>
            <span>{{ formatearFecha(aviso?.fechaPublicacion) }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-person"></i>
            <span>{{ aviso?.creador }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-eye"></i>
            <span>{{ aviso?.vistas }} vistas</span>
          </div>
        </div>
        
        <div class="aviso-contenido" v-html="aviso?.contenido"></div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" @click="$emit('close')">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  aviso: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])

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
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
  
  &.modal-badge--primary {
    background-color: rgba(18, 77, 181, 0.1);
    color: var(--color-primario);
  }
  
  &.modal-badge--warning {
    background-color: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.modal-badge--danger {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
  }
  
  &.modal-badge--info {
    background-color: var(--color-azul-claro);
    color: var(--color-informativo);
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

.aviso-meta {
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
  opacity: 0.8;
  font-size: 0.9rem;
  
  i {
    color: var(--color-primario);
    font-size: 1rem;
  }
}

.aviso-contenido {
  color: var(--color-oscuro);
  line-height: 1.6;
  
  :deep(p) {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  :deep(h6) {
    color: var(--color-primario);
    font-weight: 600;
    margin: 1.5rem 0 0.75rem 0;
  }
  
  :deep(ul) {
    margin: 1rem 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
  
  :deep(strong) {
    color: var(--color-primario);
    font-weight: 600;
  }
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
  
  &:active {
    transform: translateY(0);
  }
}
</style>
