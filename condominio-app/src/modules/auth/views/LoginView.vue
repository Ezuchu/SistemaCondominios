<template>
  <div class="auth-container">
    <h2 class="mb-4 text-center">Iniciar Sesión</h2>
    <formulario />
    <div class="mt-3 text-center">
      <router-link to="/recuperar-password">¿Olvidaste tu contraseña?</router-link>
    </div>
  </div>
</template>

<script setup>
import formulario from '../components/formulario.vue';

</script>

<style scoped lang="scss">
@import '@/styles/variables';

.auth-container {
  max-width: 400px;
  margin: 3rem auto;
  background: $color-tarjeta;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(30,41,59,0.08);
}
</style>
