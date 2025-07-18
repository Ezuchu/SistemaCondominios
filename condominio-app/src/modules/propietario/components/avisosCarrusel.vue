<template>
  <div class="avisos-carrusel">
    <div class="avisos-header">
      <h5 class="avisos-title">
        <i class="bi bi-bell me-2"></i>
        Avisos Recientes
      </h5>
      <button class="avisos-ver-todos" @click="$emit('verTodos')">
        Ver todos
      </button>
    </div>
    <div class="avisos-content">
      <div v-if="avisos.length === 0" class="avisos-empty">
        <i class="bi bi-bell-slash"></i>
        <p>No hay avisos recientes</p>
      </div>
      <div v-else class="avisos-list">
        <div 
          v-for="aviso in avisos" 
          :key="aviso.id"
          class="aviso-item"
          @click="$emit('verDetalle', aviso.id)"
        >
          <div class="aviso-icon">
            <i class="bi bi-info-circle"></i>
          </div>
          <div class="aviso-content">
            <h6 class="aviso-titulo">{{ aviso.titulo }}</h6>
            <p class="aviso-descripcion">{{ aviso.descripcion }}</p>
            <div class="aviso-meta">
              <span class="aviso-tipo" :class="`aviso-tipo--${getTipoColor(aviso.tipo)}`">
                {{ aviso.tipo }}
              </span>
              <small class="aviso-fecha">{{ formatearFecha(aviso.fecha) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  avisos: {
    type: Array,
    default: () => [
      {
        id: 1,
        titulo: 'Mantenimiento de Ascensores',
        descripcion: 'Se realizará mantenimiento preventivo mañana.',
        tipo: 'mantenimiento',
        fecha: '2024-01-15'
      },
      {
        id: 2,
        titulo: 'Asamblea Extraordinaria',
        descripcion: 'Convocatoria para el próximo viernes.',
        tipo: 'asamblea',
        fecha: '2024-01-20'
      }
    ]
  }
})

defineEmits(['verTodos', 'verDetalle'])

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
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped lang="scss">
.avisos-carrusel {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.avisos-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.avisos-title {
  color: var(--color-primario);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.avisos-ver-todos {
  background: none;
  border: 1px solid var(--color-primario);
  color: var(--color-primario);
  padding: 0.4rem 0.8rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-primario);
    color: var(--color-fondo);
  }
}

.avisos-content {
  flex: 1;
  padding: 0 1.5rem 1.5rem;
  overflow-y: auto;
}

.avisos-empty {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--color-oscuro);
  opacity: 0.6;
  
  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
}

.avisos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.aviso-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-claro);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
    transform: translateX(4px);
  }
}

.aviso-icon {
  width: 35px;
  height: 35px;
  background-color: var(--color-azul-claro);
  color: var(--color-primario);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  i {
    font-size: 1rem;
  }
}

.aviso-content {
  flex: 1;
  min-width: 0;
}

.aviso-titulo {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-oscuro);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.aviso-descripcion {
  font-size: 0.8rem;
  color: var(--color-oscuro);
  opacity: 0.7;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aviso-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.aviso-tipo {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
  text-transform: capitalize;
  
  &.aviso-tipo--primary {
    background-color: rgba(18, 77, 181, 0.1);
    color: var(--color-primario);
  }
  
  &.aviso-tipo--warning {
    background-color: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.aviso-tipo--danger {
    background-color: rgba(255, 101, 30, 0.1);
    color: var(--color-peligro);
  }
  
  &.aviso-tipo--info {
    background-color: var(--color-azul-claro);
    color: var(--color-informativo);
  }
  
  &.aviso-tipo--secondary {
    background-color: rgba(108, 117, 125, 0.1);
    color: #6c757d;
  }
}

.aviso-fecha {
  color: var(--color-oscuro);
  opacity: 0.6;
  font-size: 0.7rem;
  flex-shrink: 0;
}
</style>
