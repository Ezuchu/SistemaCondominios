<template>
  <div class="modal-overlay" v-if="show" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <button class="close-button" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div class="modal-content">
        <div class="login-header">
          <div class="logo-container">
            <img src="/src/assets/Logo.png" alt="Island Winds Logo" class="modal-logo">
          </div>
          <h2 class="login-title">Bienvenido de vuelta</h2>
          <p class="login-subtitle">Accede a tu cuenta de Island Winds</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
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
              :class="{ 'error': errors.email }"
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
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
                :class="{ 'error': errors.password }"
              >
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <div class="form-options">
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
            <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-login" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-box-arrow-in-right me-2"></i>
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
          
          <div class="divider">
            <span>o continúa con</span>
          </div>
          
          <div class="social-login">
            <button type="button" class="btn btn-social google-btn">
              <i class="bi bi-google"></i>
              Google
            </button>
            <button type="button" class="btn btn-social microsoft-btn">
              <i class="bi bi-microsoft"></i>
              Microsoft
            </button>
          </div>
        </form>
        
        <div class="modal-footer">
          <p class="signup-link">
            ¿No tienes cuenta? 
            <a href="#" class="link-primary">Solicitar acceso</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'login-success'])

const showPassword = ref(false)
const isLoading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  loginForm.email = ''
  loginForm.password = ''
  loginForm.remember = false
  errors.email = ''
  errors.password = ''
  showPassword.value = false
}

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!loginForm.email) {
    errors.email = 'El correo electrónico es requerido'
    return false
  }
  
  if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
    errors.email = 'Ingresa un correo electrónico válido'
    return false
  }
  
  if (!loginForm.password) {
    errors.password = 'La contraseña es requerida'
    return false
  }
  
  if (loginForm.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock authentication logic
    const userType = getUserType(loginForm.email)
    
    // Emit success event with user type
    emit('login-success', userType)
    
  } catch (error) {
    console.error('Login error:', error)
    errors.password = 'Credenciales incorrectas. Inténtalo de nuevo.'
  } finally {
    isLoading.value = false
  }
}

const getUserType = (email) => {
  // Mock logic to determine user type based on email
  if (email.includes('admin')) return 'admin'
  if (email.includes('operador')) return 'operador'
  return 'propietario'
}

// Close modal on escape key
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('keydown', handleEscape)
  }
})

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    closeModal()
  }
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background: white;
  border-radius: 25px;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  position: relative;
}

.modal-header {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}

.close-button {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: rotate(90deg);
  }
  
  i {
    font-size: 1rem;
    color: var(--color-oscuro);
  }
}

.modal-content {
  padding: 3rem 2.5rem 2rem;
  
  @media (max-width: 480px) {
    padding: 2.5rem 1.5rem 1.5rem;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  margin-bottom: 1.5rem;
  
  .modal-logo {
    height: 60px;
    width: auto;
  }
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-primario);
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: var(--color-oscuro);
  opacity: 0.7;
  margin: 0;
  font-size: 1rem;
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
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  
  i {
    font-size: 1rem;
  }
}

.form-control {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 0.2rem rgba(18, 77, 181, 0.15);
    background: white;
  }
  
  &.error {
    border-color: var(--color-peligro);
    background: rgba(255, 101, 30, 0.05);
  }
  
  &::placeholder {
    color: #adb5bd;
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
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(18, 77, 181, 0.1);
    }
  }
}

.error-message {
  color: var(--color-peligro);
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: block;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .form-check-input {
    margin: 0;
    accent-color: var(--color-primario);
  }
  
  .form-check-label {
    color: var(--color-oscuro);
    font-size: 0.9rem;
    cursor: pointer;
  }
}

.forgot-password {
  color: var(--color-primario);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
}

.form-actions {
  margin-bottom: 1.5rem;
}

.btn-login {
  width: 100%;
  padding: 1rem;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  border: none;
  color: white;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(18, 77, 181, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e9ecef;
  }
  
  span {
    background: white;
    padding: 0 1rem;
    color: var(--color-oscuro);
    opacity: 0.6;
    font-size: 0.9rem;
  }
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-social {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &.google-btn {
    background: white;
    border: 2px solid #e9ecef;
    color: var(--color-oscuro);
    
    &:hover {
      border-color: #db4437;
      color: #db4437;
    }
  }
  
  &.microsoft-btn {
    background: white;
    border: 2px solid #e9ecef;
    color: var(--color-oscuro);
    
    &:hover {
      border-color: #0078d4;
      color: #0078d4;
    }
  }
}

.modal-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.signup-link {
  margin: 0;
  color: var(--color-oscuro);
  opacity: 0.8;
  font-size: 0.9rem;
  
  .link-primary {
    color: var(--color-primario);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
