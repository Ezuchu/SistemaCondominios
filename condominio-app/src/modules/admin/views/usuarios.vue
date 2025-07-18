<template>
  <div class="usuarios-view">
    <!-- Header with search and filters -->
    <div class="view-header">
      <div class="search-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Buscar usuarios..."
            class="search-input"
          >
        </div>
        
        <select v-model="filterRole" class="filter-select">
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="operador">Operador</option>
          <option value="propietario">Propietario</option>
        </select>
      </div>
      
      <button @click="showCreateModal = true" class="btn-primary">
        <i class="fas fa-plus"></i>
        Agregar Usuario
      </button>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div>
                  <div class="user-name">{{ user.nombre }} {{ user.apellido }}</div>
                  <div class="user-id">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.rol">
                {{ getRoleLabel(user.rol) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="user.estado">
                {{ user.estado === 'activo' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>{{ formatDate(user.fechaRegistro) }}</td>
            <td>
              <div class="action-buttons">
                <button @click="viewUser(user)" class="btn-action view" title="Ver detalles">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editUser(user)" class="btn-action edit" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteUser(user)" class="btn-action delete" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateModal ? 'Agregar Nuevo Usuario' : 'Editar Usuario' }}</h3>
          <button @click="closeModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="user-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="userForm.nombre" type="text" required>
            </div>
            <div class="form-group">
              <label>Apellido</label>
              <input v-model="userForm.apellido" type="text" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="userForm.email" type="email" required>
          </div>
          
          <div class="form-row" v-if="showCreateModal">
            <div class="form-group">
              <label>Contraseña</label>
              <input v-model="userForm.password" type="password" required>
            </div>
            <div class="form-group">
              <label>Confirmar Contraseña</label>
              <input v-model="userForm.confirmPassword" type="password" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Rol</label>
            <select v-model="userForm.rol" required>
              <option value="">Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="operador">Operador</option>
              <option value="propietario">Propietario</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModals" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ showCreateModal ? 'Crear Usuario' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalles del Usuario</h3>
          <button @click="showDetailsModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="user-details" v-if="selectedUser">
          <div class="detail-section">
            <h4>Información Personal</h4>
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
                <span class="role-badge" :class="selectedUser.rol">
                  {{ getRoleLabel(selectedUser.rol) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Estado:</label>
                <span class="status-badge" :class="selectedUser.estado">
                  {{ selectedUser.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Información del Sistema</h4>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsuariosView',
  data() {
    return {
      searchTerm: '',
      filterRole: '',
      showCreateModal: false,
      showEditModal: false,
      showDetailsModal: false,
      selectedUser: null,
      userForm: {
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        rol: ''
      },
      users: [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@email.com',
          rol: 'admin',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-15'),
          ultimoAcceso: new Date('2024-01-18')
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          email: 'maria.gonzalez@email.com',
          rol: 'operador',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-10'),
          ultimoAcceso: new Date('2024-01-17')
        },
        {
          id: 3,
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          email: 'carlos.rodriguez@email.com',
          rol: 'propietario',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-05'),
          ultimoAcceso: new Date('2024-01-16')
        }
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const matchesSearch = !this.searchTerm || 
          user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        
        const matchesRole = !this.filterRole || user.rol === this.filterRole
        
        return matchesSearch && matchesRole
      })
    }
  },
  methods: {
    getRoleLabel(role) {
      const labels = {
        admin: 'Administrador',
        operador: 'Operador',
        propietario: 'Propietario'
      }
      return labels[role] || role
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-ES')
    },
    viewUser(user) {
      this.selectedUser = user
      this.showDetailsModal = true
    },
    editUser(user) {
      this.selectedUser = user
      this.userForm = {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        password: '',
        confirmPassword: ''
      }
      this.showEditModal = true
    },
    deleteUser(user) {
      if (confirm(`¿Está seguro de eliminar al usuario ${user.nombre} ${user.apellido}?`)) {
        this.users = this.users.filter(u => u.id !== user.id)
      }
    },
    saveUser() {
      if (this.showCreateModal) {
        if (this.userForm.password !== this.userForm.confirmPassword) {
          alert('Las contraseñas no coinciden')
          return
        }
        
        const newUser = {
          id: Date.now(),
          ...this.userForm,
          estado: 'activo',
          fechaRegistro: new Date(),
          ultimoAcceso: new Date()
        }
        this.users.push(newUser)
      } else {
        const index = this.users.findIndex(u => u.id === this.selectedUser.id)
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...this.userForm
          }
        }
      }
      
      this.closeModals()
    },
    closeModals() {
      this.showCreateModal = false
      this.showEditModal = false
      this.showDetailsModal = false
      this.selectedUser = null
      this.userForm = {
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        rol: ''
      }
    }
  }
}
</script>

<style scoped>
.usuarios-view {
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-filters {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  min-width: 150px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-name {
  font-weight: 500;
  color: #1a202c;
}

.user-id {
  font-size: 0.75rem;
  color: #64748b;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.operador {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.propietario {
  background: #d1fae5;
  color: #065f46;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.activo {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactivo {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-action.view {
  background: #e0f2fe;
  color: #0277bd;
}

.btn-action.edit {
  background: #fff3e0;
  color: #f57c00;
}

.btn-action.delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-action:hover {
  transform: scale(1.1);
}

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
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f1f5f9;
}

.user-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
}

.user-details {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.125rem;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item label {
  font-weight: 500;
  color: #64748b;
  font-size: 0.875rem;
}

.detail-item span {
  color: #1a202c;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filters {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .users-table {
    font-size: 0.875rem;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
