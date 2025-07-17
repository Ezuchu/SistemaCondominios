<template>
  <div class="login-container">
      <Formulario />
  </div>
</template>

<script setup>
import Formulario from '@/modules/auth/components/formulario.vue'
</script>

<style scoped lang="scss">
.login-container {
  background-image: url('@/assets/loginFondo.png'); /* Reemplaza con la ruta de tu imagen */
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.8); /* Fondo blanco semi-transparente */
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}
</style>
