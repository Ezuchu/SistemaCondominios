<template>
  <div class="d-flex">
    <sidebar />
    <main class="flex-grow-1 p-4" style="margin-left: var(--sidebar-width);">
      <h2 class="mb-4">Bienvenido, Propietario</h2>
      <div class="row mb-4">
        <tarjetaResumen titulo="Saldo Actual de mi Propiedad" valor="$1,200" icono="bi-cash-stack" />
        <tarjetaResumen titulo="Próxima Cuota a Vencer" valor="15/08/2025" icono="bi-calendar-event" />
        <tarjetaResumen titulo="Último Pago Registrado" valor="$400 - 01/07/2025" icono="bi-receipt" />
      </div>
      <div class="mb-4">
        <button class="btn btn-primary me-2" @click="$router.push('/propietario/pagos')">Registrar Nuevo Pago</button>
        <button class="btn btn-outline-primary me-2" @click="$router.push('/propietario/estados-cuenta')">Ver Mis Estados de Cuenta</button>
        <button class="btn btn-outline-info" @click="$router.push('/propietario/avisos')">Ver Avisos</button>
      </div>
      <avisosCarrusel />
    </main>
  </div>
</template>

<script setup>
import sidebar from './components/sidebar.vue'
import tarjetaResumen from './components/tarjetaResumen.vue'
import avisosCarrusel from './components/avisosCarrusel.vue'
</script>