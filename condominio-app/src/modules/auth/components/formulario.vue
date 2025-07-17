<template>
  <div class="form-container">
    <form @submit.prevent="login">
      <div class="logo mb-4">
        <img src="@/assets/Logo.png" alt="ISLAND WINDS" class="img-fluid">
      </div>
      <div v-if="errorMsg" class="alert alert-danger text-center py-2 mb-3" role="alert">
        {{ errorMsg }}
      </div>
      <div class="mb-4">
        <label for="user" class="form-label">Usuario</label>
        <input v-model="email" type="text" class="form-control custom-input" id="user" required>
      </div>
      <div class="mb-4">
        <label for="password" class="form-label">Contraseña</label>
        <input v-model="password" type="password" class="form-control custom-input" id="password" required>
      </div>
      <button type="submit" class="btn btn-primary w-100 custom-btn">Iniciar Sesión</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { users } from '@/mock/users'; 

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

function login() {
  const user = users.find(
    (u) => u.username === email.value && u.password === password.value
  );

  if (user) {
    errorMsg.value = '';
    switch (user.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'propietario':
        router.push('/propietario');
        break;
      case 'residente':
        router.push('/residente');
        break;
    }
  } else {
    errorMsg.value = 'Credenciales incorrectas';
  }
}
</script>

<style lang="scss">
.form-container {
  background-color:  rgba(255, 255, 255, 0.923);;
  padding: 3rem;
  border-radius: 3rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin-bottom: 1rem;

  img {
    max-width: 16rem;
    height: auto;
  }
}

@media screen and (max-width: 768px) {
  .logo img {
    max-width: 12rem;
  }
}

.custom-btn {
  background-color: var(--color-primario);
  color: var(--color-fondo);
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: color-mix(in srgb, var(--color-primario) 50%, black);
  }
}

.custom-input {
  border-radius: 0.5rem;
  border: 1px solid #ced4da;
  padding: 0.75rem;
  font-size: 1rem;
  color: var(--color-oscuro);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: var(--color-informativo);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &::placeholder {
    color: var(--color-secundario);
    opacity: 1;
  }
}
</style>