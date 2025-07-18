<template>
  <div class="usuarios-container">
    <!-- Header -->
    <div class="usuarios-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="bi bi-people"></i>
          Gestión de Usuarios
        </h1>
        <p class="page-subtitle">Administra usuarios del condominio</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <i class="bi bi-person-plus"></i>
        <span>Agregar Usuario</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-card">
        <div class="search-group">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Buscar por nombre, email o ID..."
              class="search-input"
            >
          </div>
        </div>
        
        <div class="filter-group">
          <select v-model="filterRole" class="filter-select">
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="operador">Operador</option>
            <option value="propietario">Propietario</option>
          </select>
          
          <select v-model="filterStatus" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stat-card stat-card--total">
        <div class="stat-icon">
          <i class="bi bi-people"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ userStats.total }}</div>
          <div class="stat-label">Total Usuarios</div>
        </div>
      </div>
      
      <div class="stat-card stat-card--active">
        <div class="stat-icon">
          <i class="bi bi-person-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ userStats.active }}</div>
          <div class="stat-label">Usuarios Activos</div>
        </div>
      </div>
      
      <div class="stat-card stat-card--new">
        <div class="stat-icon">
          <i class="bi bi-person-plus"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ userStats.newThisMonth }}</div>
          <div class="stat-label">Nuevos este Mes</div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-section">
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="bi bi-list-ul"></i>
            Lista de Usuarios
          </h3>
          <div class="table-actions">
            <button class="btn-outline btn-sm" @click="exportUsers">
              <i class="bi bi-download"></i>
              <span class="btn-text">Exportar</span>
            </button>
          </div>
        </div>
        
        <div class="table-container">
          <div class="table-responsive">
            <table class="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th class="d-none d-md-table-cell">Fecha Registro</th>
                  <th class="d-none d-lg-table-cell">Último Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id" class="table-row">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">
                        <i class="bi bi-person"></i>
                      </div>
                      <div class="user-info">
                        <div class="user-name">{{ user.nombre }} {{ user.apellido }}</div>
                        <div class="user-id">ID: {{ user.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="user-email">{{ user.email }}</span>
                  </td>
                  <td>
                    <span :class="['role-badge', `role-badge--${user.rol}`]">
                      {{ getRoleLabel(user.rol) }}
                    </span>
                  </td>
                  <td>
                    <span :class="['status-badge', `status-badge--${user.estado}`]">
                      <i :class="user.estado === 'activo' ? 'bi bi-circle-fill' : 'bi bi-circle'"></i>
                      {{ user.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="d-none d-md-table-cell">
                    <span class="date-text">{{ formatDate(user.fechaRegistro) }}</span>
                  </td>
                  <td class="d-none d-lg-table-cell">
                    <span class="date-text">{{ formatDate(user.ultimoAcceso) }}</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button @click="viewUser(user)" class="btn-action btn-action--view" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button @click="editUser(user)" class="btn-action btn-action--edit" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button @click="deleteUser(user)" class="btn-action btn-action--delete" title="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i :class="showCreateModal ? 'bi bi-person-plus' : 'bi bi-pencil'"></i>
            {{ showCreateModal ? 'Agregar Nuevo Usuario' : 'Editar Usuario' }}
          </h3>
          <button @click="closeModals" class="modal-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input v-model="userForm.nombre" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input v-model="userForm.apellido" type="text" class="form-input" required>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="userForm.email" type="email" class="form-input" required>
          </div>
          
          <div class="form-grid" v-if="showCreateModal">
            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input v-model="userForm.password" type="password" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Confirmar Contraseña</label>
              <input v-model="userForm.confirmPassword" type="password" class="form-input" required>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Rol</label>
            <select v-model="userForm.rol" class="form-select" required>
              <option value="">Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="operador">Operador</option>
              <option value="propietario">Propietario</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              <i :class="showCreateModal ? 'bi bi-plus' : 'bi bi-check'"></i>
              <span>{{ showCreateModal ? 'Crear Usuario' : 'Guardar Cambios' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="bi bi-person-circle"></i>
            Detalles del Usuario
          </h3>
          <button @click="showDetailsModal = false" class="modal-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedUser">
          <div class="user-details">
            <div class="detail-section">
              <h4 class="section-title">Información Personal</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Nombre Completo:</label>
                  <span>{{ selectedUser.nombre }} {{ selectedUser.apellido }}</span>
                </div>
                <div class="detail-item">
                  <label>Email:</label>
                  <span>{{ selectedUser.email }}</span>
                </div>
                <div class="detail-item">
                  <label>Rol:</label>
                  <span :class="['role-badge', `role-badge--${selectedUser.rol}`]">
                    {{ getRoleLabel(selectedUser.rol) }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Estado:</label>
                  <span :class="['status-badge', `status-badge--${selectedUser.estado}`]">
                    <i :class="selectedUser.estado === 'activo' ? 'bi bi-circle-fill' : 'bi bi-circle'"></i>
                    {{ selectedUser.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4 class="section-title">Información del Sistema</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>ID de Usuario:</label>
                  <span>{{ selectedUser.id }}</span>
                </div>
                <div class="detail-item">
                  <label>Fecha de Registro:</label>
                  <span>{{ formatDate(selectedUser.fechaRegistro) }}</span>
                </div>
                <div class="detail-item">
                  <label>Último Acceso:</label>
                  <span>{{ formatDate(selectedUser.ultimoAcceso) }}</span>
                </div>
                <div class="detail-item">
                  <label>Propiedades Asociadas:</label>
                  <span>{{ selectedUser.propiedades || 'Ninguna' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchTerm = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const selectedUser = ref(null)

const userForm = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: '',
  rol: ''
})

const users = ref([
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@email.com',
    rol: 'admin',
    estado: 'activo',
    fechaRegistro: new Date('2024-01-15'),
    ultimoAcceso: new Date('2024-01-18'),
    propiedades: 'Apto 301-A'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@email.com',
    rol: 'operador',
    estado: 'activo',
    fechaRegistro: new Date('2024-01-10'),
    ultimoAcceso: new Date('2024-01-17'),
    propiedades: 'N/A'
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    rol: 'propietario',
    estado: 'activo',
    fechaRegistro: new Date('2024-01-05'),
    ultimoAcceso: new Date('2024-01-16'),
    propiedades: 'Apto 205-B'
  },
  {
    id: 4,
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@email.com',
    rol: 'propietario',
    estado: 'inactivo',
    fechaRegistro: new Date('2023-12-20'),
    ultimoAcceso: new Date('2024-01-10'),
    propiedades: 'Local 101'
  },
  {
    id: 5,
    nombre: 'Luis',
    apellido: 'Fernández',
    email: 'luis.fernandez@email.com',
    rol: 'propietario',
    estado: 'activo',
    fechaRegistro: new Date('2024-01-12'),
    ultimoAcceso: new Date('2024-01-18'),
    propiedades: 'Apto 102-C'
  }
])

const userStats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.estado === 'activo').length,
  newThisMonth: users.value.filter(u => {
    const now = new Date()
    const userDate = new Date(u.fechaRegistro)
    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
  }).length
}))

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchTerm.value || 
      user.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.id.toString().includes(searchTerm.value)
    
    const matchesRole = !filterRole.value || user.rol === filterRole.value
    const matchesStatus = !filterStatus.value || user.estado === filterStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const getRoleLabel = (role) => {
  const labels = {
    admin: 'Administrador',
    operador: 'Operador',
    propietario: 'Propietario'
  }
  return labels[role] || role
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewUser = (user) => {
  selectedUser.value = user
  showDetailsModal.value = true
}

const editUser = (user) => {
  selectedUser.value = user
  userForm.value = {
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    rol: user.rol,
    password: '',
    confirmPassword: ''
  }
  showEditModal.value = true
}

const deleteUser = (user) => {
  if (confirm(`¿Está seguro de eliminar al usuario ${user.nombre} ${user.apellido}?`)) {
    users.value = users.value.filter(u => u.id !== user.id)
  }
}

const saveUser = () => {
  if (showCreateModal.value) {
    if (userForm.value.password !== userForm.value.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    
    const newUser = {
      id: Date.now(),
      ...userForm.value,
      estado: 'activo',
      fechaRegistro: new Date(),
      ultimoAcceso: new Date(),
      propiedades: 'N/A'
    }
    users.value.push(newUser)
  } else {
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        ...userForm.value
      }
    }
  }
  
  closeModals()
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDetailsModal.value = false
  selectedUser.value = null
  userForm.value = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: ''
  }
}

const exportUsers = () => {
  alert('Funcionalidad de exportación en desarrollo')
}
</script>

<style scoped lang="scss">
.usuarios-container {
  padding: 2rem;
  background: var(--color-claro);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Header
.usuarios-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-primario);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  i {
    font-size: 1.75rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    i {
      font-size: 1.25rem;
    }
  }
}

.page-subtitle {
  color: var(--color-oscuro);
  opacity: 0.7;
  margin: 0;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  color: var(--color-fondo);
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(18, 77, 181, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  i {
    font-size: 1rem;
  }
}

// Filters
.filters-section {
  margin-bottom: 2rem;
}

.filters-card {
  background: var(--color-fondo);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem;
  }
}

.search-group {
  flex: 1;
}

.search-box {
  position: relative;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: none;
  }
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-oscuro);
  opacity: 0.5;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  background: var(--color-claro);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    background: var(--color-fondo);
    box-shadow: 0 0 0 3px rgba(18, 77, 181, 0.1);
  }
  
  &::placeholder {
    color: var(--color-oscuro);
    opacity: 0.5;
  }
}

.filter-group {
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
}

.filter-select {
  padding: 0.875rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  background: var(--color-claro);
  color: var(--color-oscuro);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    background: var(--color-fondo);
    box-shadow: 0 0 0 3px rgba(18, 77, 181, 0.1);
  }
  
  @media (max-width: 576px) {
    min-width: auto;
  }
}

// Stats
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.stat-card {
  background: var(--color-fondo);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--color-fondo);
  flex-shrink: 0;
  
  .stat-card--total & {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  }
  
  .stat-card--active & {
    background: linear-gradient(135deg, var(--color-éxito), #4caf50);
  }
  
  .stat-card--new & {
    background: linear-gradient(135deg, var(--color-naranja), #ff9800);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-oscuro);
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-oscuro);
  opacity: 0.7;
  font-weight: 500;
}

// Table
.table-section {
  margin-bottom: 2rem;
}

.table-card {
  background: var(--color-fondo);
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem;
  }
}

.table-title {
  color: var(--color-primario);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    font-size: 1rem;
  }
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-outline {
  background: none;
  border: 1px solid var(--color-primario);
  color: var(--color-primario);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  
  &:hover {
    background: var(--color-primario);
    color: var(--color-fondo);
  }
  
  &.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .btn-text {
    @media (max-width: 480px) {
      display: none;
    }
  }
}

.table-container {
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  min-width: 700px;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    min-width: 600px;
  }
}

.users-table th {
  background: var(--color-claro);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-oscuro);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  vertical-align: middle;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }
}

.table-row {
  transition: background-color 0.3s ease;
  
  &:hover {
    background: var(--color-azul-claro);
  }
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-fondo);
  font-size: 1rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }
}

.user-info {
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--color-oscuro);
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
}

.user-id {
  font-size: 0.75rem;
  color: var(--color-oscuro);
  opacity: 0.6;
}

.user-email {
  color: var(--color-oscuro);
  font-size: 0.85rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
}

.role-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  &.role-badge--admin {
    background: linear-gradient(135deg, rgba(255, 168, 1, 0.2), rgba(255, 168, 1, 0.1));
    color: var(--color-naranja);
  }
  
  &.role-badge--operador {
    background: linear-gradient(135deg, rgba(0, 89, 255, 0.2), rgba(0, 89, 255, 0.1));
    color: var(--color-informativo);
  }
  
  &.role-badge--propietario {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(40, 167, 69, 0.1));
    color: var(--color-éxito);
  }
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  
  &.status-badge--activo {
    color: var(--color-éxito);
  }
  
  &.status-badge--inactivo {
    color: var(--color-peligro);
  }
  
  i {
    font-size: 0.5rem;
  }
}

.date-text {
  color: var(--color-oscuro);
  opacity: 0.7;
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.btn-action--view {
    background: linear-gradient(135deg, rgba(0, 89, 255, 0.2), rgba(0, 89, 255, 0.1));
    color: var(--color-informativo);
    
    &:hover {
      background: var(--color-informativo);
      color: var(--color-fondo);
    }
  }
  
  &.btn-action--edit {
    background: linear-gradient(135deg, rgba(255, 168, 1, 0.2), rgba(255, 168, 1, 0.1));
    color: var(--color-naranja);
    
    &:hover {
      background: var(--color-naranja);
      color: var(--color-fondo);
    }
  }
  
  &.btn-action--delete {
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.2), rgba(220, 53, 69, 0.1));
    color: var(--color-peligro);
    
    &:hover {
      background: var(--color-peligro);
      color: var(--color-fondo);
    }
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}

// Modal
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--color-fondo);
  border-radius: 1rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 576px) {
    margin: 0.5rem;
    max-width: none;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  @media (max-width: 576px) {
    padding: 1rem;
  }
}

.modal-title {
  margin: 0;
  color: var(--color-primario);
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    font-size: 1.1rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-oscuro);
  opacity: 0.5;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    background: var(--color-claro);
  }
}

.modal-body {
  padding: 1.5rem;
  
  @media (max-width: 576px) {
    padding: 1rem;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-oscuro);
  font-size: 0.9rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  background: var(--color-claro);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    background: var(--color-fondo);
    box-shadow: 0 0 0 3px rgba(18, 77, 181, 0.1);
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
}

// User Details
.user-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  .section-title {
    margin: 0 0 1rem 0;
    color: var(--color-primario);
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-weight: 500;
    color: var(--color-oscuro);
    opacity: 0.7;
    font-size: 0.85rem;
  }
  
  span {
    color: var(--color-oscuro);
    font-size: 0.95rem;
  }
}

// Responsive utilities
.d-none {
  display: none !important;
}

.d-md-table-cell {
  @media (min-width: 768px) {
    display: table-cell !important;
  }
}

.d-lg-table-cell {
  @media (min-width: 992px) {
    display: table-cell !important;
  }
}
</style>
