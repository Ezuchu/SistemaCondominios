<template>
  <div class="card tarjeta-resumen text-center col-md-4 mb-3">
    <div class="card-body">
      <i :class="['bi', icono, 'fs-2', 'mb-2']"></i>
      <h5 class="card-title">{{ titulo }}</h5>
      <p class="card-text fw-bold">{{ valor }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: String,
  valor: String,
  icono: String
})
</script>

<style scoped>
.tarjeta-resumen {
  background-color: var(--color-tarjeta, #e7e7e7d6);
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.07);
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>