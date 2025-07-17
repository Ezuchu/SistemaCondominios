<template>
  <form @submit.prevent="login">
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input v-model="email" type="email" class="form-control" id="email" required>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Contraseña</label>
      <input v-model="password" type="password" class="form-control" id="password" required>
    </div>
    <button type="submit" class="btn btn-primary w-100 custom-btn">Iniciar Sesión</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function login() {
  // Aquí iría la lógica de autenticación (puedes usar mocks)
  alert(`Email: ${email.value}\nPassword: ${password.value}`)
}
</script>

<style lang="scss">
@import '@/styles/variables';

.custom-btn {
  background-color: $color-primario;
  color: $color-fondo;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darken($color-primario, 10%);
  }

}
</style>