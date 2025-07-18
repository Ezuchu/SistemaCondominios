<template>
  <div class="login-form-container">
    <div class="login-form">
      <div class="form-header">
        <img src="/src/assets/Logo.png" alt="Island Winds Logo" class="form-logo">
        <h2>Iniciar Sesión</h2>
        <p>Accede a tu cuenta de Island Winds</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form-content">
        <div class="form-group">
          <label for="email" class="form-label">
            <i class="bi bi-envelope"></i>
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            v-model="loginForm.email"
            class="form-control"
            placeholder="tu@email.com"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">
            <i class="bi bi-lock"></i>
            Contraseña
          </label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="loginForm.password"
              class="form-control"
              placeholder="Tu contraseña"
              required
            >
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <div class="form-check">
            <input
              type="checkbox"
              id="remember"
              v-model="loginForm.remember"
              class="form-check-input"
            >
            <label for="remember" class="form-check-label">
              Recordar sesión
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-login" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-box-arrow-in-right me-2"></i>
            {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
          </button>
        </div>
        
        <div class="form-footer">
          <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
      
      <div class="back-to-home">
        <router-link to="/" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>
          Volver al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock authentication logic
    if (loginForm.email && loginForm.password) {
      // Determine user type based on email domain or other logic
      const userType = getUserType(loginForm.email)
      
      // Redirect based on user type
      router.push(`/${userType}`)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

const getUserType = (email) => {
  // Mock logic to determine user type
  if (email.includes('admin')) return 'admin'
  if (email.includes('operador')) return 'operador'
  return 'propietario'
}
</script>

<style scoped lang="scss">
.login-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(10px);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  
  .form-logo {
    height: 60px;
    width: auto;
    margin-bottom: 1rem;
  }
  
  h2 {
    color: var(--color-primario);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--color-oscuro);
    opacity: 0.7;
    margin: 0;
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-primario);
  margin-bottom: 0.5rem;
  
  i {
    font-size: 1rem;
  }
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 0.2rem rgba(18, 77, 181, 0.25);
  }
}

.password-input {
  position: relative;
  
  .password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-primario);
    cursor: pointer;
    padding: 0;
    
    &:hover {
      opacity: 0.7;
    }
  }
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .form-check-input {
    margin: 0;
  }
  
  .form-check-label {
    color: var(--color-oscuro);
    font-size: 0.9rem;
    cursor: pointer;
  }
}

.form-actions {
  margin-bottom: 1.5rem;
  
  .btn-login {
    width: 100%;
    padding: 0.875rem;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 10px;
    background: var(--color-primario);
    border-color: var(--color-primario);
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background: var(--color-secundario);
      border-color: var(--color-secundario);
      transform: translateY(-1px);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.form-footer {
  text-align: center;
  margin-bottom: 1.5rem;
  
  .forgot-password {
    color: var(--color-primario);
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.back-to-home {
  text-align: center;
  
  .btn {
    border-radius: 10px;
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
