<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <img src="../../../assets/Logo.png" alt="Island Winds" class="navbar-logo">
        <span class="brand-text">Island Winds</span>
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        @click="toggleMobileMenu"
        :class="{ 'collapsed': !mobileMenuOpen }"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="navbar-collapse" :class="{ 'show': mobileMenuOpen }">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#inicio" @click="scrollTo('inicio')">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#caracteristicas" @click="scrollTo('caracteristicas')">Características</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#usuarios" @click="scrollTo('usuarios')">Usuarios</a>
          </li>
          <li class="nav-item">
            <button class="btn btn-primary nav-login-btn" @click="$emit('open-login')">
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Iniciar Sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['open-login'])

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const scrollTo = (elementId) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  mobileMenuOpen.value = false
}
</script>

<style scoped lang="scss">
.navbar {
  background: rgba(18, 77, 181, 0.95) !important;
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  transition: all 0.3s ease;
  
  &.scrolled {
    background: rgba(18, 77, 181, 0.98) !important;
    padding: 0.5rem 0;
  }
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  
  .navbar-logo {
    height: 40px;
    width: auto;
    filter: brightness(0) invert(1);
  }
  
  .brand-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }
}

.nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-amarillo) !important;
    transform: translateY(-1px);
  }
}

.nav-login-btn {
  background: var(--color-amarillo);
  border-color: var(--color-amarillo);
  color: var(--color-primario);
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-naranja);
    border-color: var(--color-naranja);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 168, 1, 0.4);
  }
}

.navbar-toggler {
  border: none;
  padding: 0.25rem 0.5rem;
  
  &:focus {
    box-shadow: none;
  }
}

@media (max-width: 991px) {
  .navbar-collapse {
    background: rgba(18, 77, 181, 0.98);
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 10px;
    
    .nav-item {
      margin-bottom: 0.5rem;
    }
    
    .nav-login-btn {
      width: 100%;
      margin-top: 1rem;
    }
  }
}
</style>
