<template>
  <div class="tarjeta-resumen">
    <div class="tarjeta-content">
      <div class="tarjeta-info">
        <h6 class="tarjeta-subtitle">{{ titulo }}</h6>
        <h4 class="tarjeta-value" :class="`tarjeta-value--${color}`">{{ valor }}</h4>
      </div>
      <div class="tarjeta-icon" :class="`tarjeta-icon--${color}`">
        <i :class="icono"></i>
      </div>
    </div>
    <div class="tarjeta-footer" :class="`tarjeta-footer--${color}`">
      <small class="tarjeta-update">
        <i class="bi bi-arrow-up-right me-1"></i>
        Actualizado recientemente
      </small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    required: true
  },
  valor: {
    type: String,
    required: true
  },
  icono: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  }
})
</script>

<style scoped lang="scss">
.tarjeta-resumen {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.tarjeta-content {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tarjeta-info {
  flex: 1;
  min-width: 0;
}

.tarjeta-subtitle {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
}

.tarjeta-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  
  &.tarjeta-value--primary {
    color: var(--color-primario);
  }
  
  &.tarjeta-value--success {
    color: var(--color-éxito);
  }
  
  &.tarjeta-value--warning {
    color: var(--color-naranja);
  }
  
  &.tarjeta-value--info {
    color: var(--color-informativo);
  }
  
  &.tarjeta-value--danger {
    color: var(--color-peligro);
  }
}

.tarjeta-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  i {
    font-size: 1.5rem;
  }
  
  &.tarjeta-icon--primary {
    background-color: rgba(18, 77, 181, 0.1);
    color: var(--color-primario);
  }
  
  &.tarjeta-icon--success {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--color-éxito);
  }
  
  &.tarjeta-icon--warning {
    background-color: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.tarjeta-icon--info {
    background-color: var(--color-azul-claro);
    color: var(--color-informativo);
  }
  
  &.tarjeta-icon--danger {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
  }
}

.tarjeta-footer {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  
  &.tarjeta-footer--primary {
    background-color: rgba(18, 77, 181, 0.05);
  }
  
  &.tarjeta-footer--success {
    background-color: rgba(40, 167, 69, 0.05);
  }
  
  &.tarjeta-footer--warning {
    background-color: rgba(255, 168, 1, 0.05);
  }
  
  &.tarjeta-footer--info {
    background-color: rgba(0, 89, 255, 0.05);
  }
  
  &.tarjeta-footer--danger {
    background-color: rgba(255, 101, 30, 0.05);
  }
}

.tarjeta-update {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}
</style>
