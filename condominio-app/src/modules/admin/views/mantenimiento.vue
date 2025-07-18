<template>
  <div class="mantenimiento-view">
    <!-- Sub-navigation -->
    <div class="sub-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="{ active: activeTab === tab.key }"
        class="tab-btn"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Calendario -->
    <div v-if="activeTab === 'calendario'" class="tab-content">
      <div class="calendar-header">
        <div class="calendar-nav">
          <button @click="previousMonth" class="nav-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <h2>{{ currentMonthYear }}</h2>
          <button @click="nextMonth" class="nav-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="calendar-filters">
          <select v-model="calendarFilter.area" class="filter-select">
            <option value="">Todas las áreas</option>
            <option v-for="area in areas" :key="area.id" :value="area.id">
              {{ area.nombre }}
            </option>
          </select>
          
          <select v-model="calendarFilter.estado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="programada">Programada</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        
        <button @click="showCreateActivityModal = true" class="btn-primary">
          <i class="fas fa-plus"></i>
          Nueva Actividad
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <div class="calendar-weekdays">
          <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
        </div>
        
        <div class="calendar-days">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            :class="['calendar-day', { 
              'other-month': day.otherMonth,
              'today': day.isToday,
              'has-activities': day.activities.length > 0
            }]"
          >
            <div class="day-number">{{ day.day }}</div>
            <div class="day-activities">
              <div 
                v-for="activity in day.activities.slice(0, 2)" 
                :key="activity.id"
                :class="['activity-item', activity.estado]"
                @click="viewActivity(activity)"
              >
                {{ activity.nombre }}
              </div>
              <div v-if="day.activities.length > 2" class="more-activities">
                +{{ day.activities.length - 2 }} más
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actividades -->
    <div v-if="activeTab === 'actividades'" class="tab-content">
      <div class="section-header">
        <h2>Actividades de Mantenimiento</h2>
        <button @click="showCreateActivityModal = true" class="btn-primary">
          <i class="fas fa-plus"></i>
          Nueva Actividad
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-row">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Buscar actividades..."
            class="search-input"
          >
        </div>
        
        <select v-model="activitiesFilter.area" class="filter-select">
          <option value="">Todas las áreas</option>
          <option v-for="area in areas" :key="area.id" :value="area.id">
            {{ area.nombre }}
          </option>
        </select>
        
        <select v-model="activitiesFilter.estado" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="programada">Programada</option>
          <option value="en_progreso">En Progreso</option>
          <option value="completada">Completada</option>
        </select>
      </div>

      <!-- Activities Table -->
      <div class="table-container">
        <table class="activities-table">
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Área Común</th>
              <th>Fecha Programada</th>
              <th>Estado</th>
              <th>Asignado a</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in filteredActivities" :key="activity.id">
              <td>
                <div class="activity-info">
                  <div class="activity-name">{{ activity.nombre }}</div>
                  <div class="activity-description">{{ activity.descripcion }}</div>
                </div>
              </td>
              <td>{{ activity.area.nombre }}</td>
              <td>{{ formatDate(activity.fechaProgramada) }}</td>
              <td>
                <span class="status-badge" :class="activity.estado">
                  {{ getStatusLabel(activity.estado) }}
                </span>
              </td>
              <td>
                <div v-if="activity.operador" class="operator-info">
                  <div class="operator-name">{{ activity.operador.nombre }}</div>
                  <div class="operator-email">{{ activity.operador.email }}</div>
                </div>
                <span v-else class="no-operator">Sin asignar</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    v-if="activity.estado === 'programada'"
                    @click="markAsCompleted(activity)" 
                    class="btn-action complete" 
                    title="Marcar como completada"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button @click="editActivity(activity)" class="btn-action edit" title="Editar">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteActivity(activity)" class="btn-action delete" title="Eliminar">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Áreas Comunes -->
    <div v-if="activeTab === 'areas'" class="tab-content">
      <div class="section-header">
        <h2>Gestión de Áreas Comunes</h2>
        <button @click="showCreateAreaModal = true" class="btn-primary">
          <i class="fas fa-plus"></i>
          Nueva Área
        </button>
      </div>

      <!-- Areas Table -->
      <div class="table-container">
        <table class="areas-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="area in areas" :key="area.id">
              <td>
                <div class="area-info">
                  <div class="area-icon">
                    <i :class="area.icono"></i>
                  </div>
                  <div class="area-name">{{ area.nombre }}</div>
                </div>
              </td>
              <td>{{ area.descripcion }}</td>
              <td>{{ area.ubicacion }}</td>
              <td>
                <span class="status-badge" :class="area.estado">
                  {{ area.estado === 'activa' ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="editArea(area)" class="btn-action edit" title="Editar">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteArea(area)" class="btn-action delete" title="Eliminar">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Activity Modal -->
    <div v-if="showCreateActivityModal || showEditActivityModal" class="modal-overlay" @click="closeActivityModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateActivityModal ? 'Crear Nueva Actividad' : 'Editar Actividad' }}</h3>
          <button @click="closeActivityModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveActivity" class="activity-form">
          <div class="form-group">
            <label>Nombre de la Actividad</label>
            <input v-model="activityForm.nombre" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="activityForm.descripcion" rows="3" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Área Común</label>
              <select v-model="activityForm.areaId" required>
                <option value="">Seleccionar área</option>
                <option v-for="area in areas" :key="area.id" :value="area.id">
                  {{ area.nombre }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha Programada</label>
              <input v-model="activityForm.fechaProgramada" type="datetime-local" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Operador Asignado</label>
              <select v-model="activityForm.operadorId">
                <option value="">Sin asignar</option>
                <option v-for="operator in operators" :key="operator.id" :value="operator.id">
                  {{ operator.nombre }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select v-model="activityForm.estado" required>
                <option value="programada">Programada</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeActivityModals" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ showCreateActivityModal ? 'Crear Actividad' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create/Edit Area Modal -->
    <div v-if="showCreateAreaModal || showEditAreaModal" class="modal-overlay" @click="closeAreaModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateAreaModal ? 'Agregar Nueva Área' : 'Editar Área' }}</h3>
          <button @click="closeAreaModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveArea" class="area-form">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="areaForm.nombre" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="areaForm.descripcion" rows="3" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Ubicación</label>
              <input v-model="areaForm.ubicacion" type="text" required>
            </div>
            <div class="form-group">
              <label>Icono</label>
              <select v-model="areaForm.icono" required>
                <option value="">Seleccionar icono</option>
                <option value="fas fa-swimming-pool">Piscina</option>
                <option value="fas fa-dumbbell">Gimnasio</option>
                <option value="fas fa-tree">Jardín</option>
                <option value="fas fa-car">Estacionamiento</option>
                <option value="fas fa-building">Salón</option>
                <option value="fas fa-tools">Mantenimiento</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeAreaModals" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ showCreateAreaModal ? 'Crear Área' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Activity Details Modal -->
    <div v-if="showActivityDetailsModal" class="modal-overlay" @click="showActivityDetailsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalles de la Actividad</h3>
          <button @click="showActivityDetailsModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="activity-details" v-if="selectedActivity">
          <div class="detail-section">
            <h4>Información General</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Nombre:</label>
                <span>{{ selectedActivity.nombre }}</span>
              </div>
              <div class="detail-item">
                <label>Descripción:</label>
                <span>{{ selectedActivity.descripcion }}</span>
              </div>
              <div class="detail-item">
                <label>Área:</label>
                <span>{{ selectedActivity.area.nombre }}</span>
              </div>
              <div class="detail-item">
                <label>Estado:</label>
                <span class="status-badge" :class="selectedActivity.estado">
                  {{ getStatusLabel(selectedActivity.estado) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Programación</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Fecha Programada:</label>
                <span>{{ formatDate(selectedActivity.fechaProgramada) }}</span>
              </div>
              <div class="detail-item" v-if="selectedActivity.operador">
                <label>Operador Asignado:</label>
                <span>{{ selectedActivity.operador.nombre }}</span>
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
  name: 'MantenimientoView',
  data() {
    return {
      activeTab: 'calendario',
      tabs: [
        { key: 'calendario', label: 'Calendario', icon: 'fas fa-calendar-alt' },
        { key: 'actividades', label: 'Actividades', icon: 'fas fa-tasks' },
        { key: 'areas', label: 'Áreas Comunes', icon: 'fas fa-map-marker-alt' }
      ],
      currentDate: new Date(),
      searchTerm: '',
      showCreateActivityModal: false,
      showEditActivityModal: false,
      showCreateAreaModal: false,
      showEditAreaModal: false,
      showActivityDetailsModal: false,
      selectedActivity: null,
      selectedArea: null,
      calendarFilter: {
        area: '',
        estado: ''
      },
      activitiesFilter: {
        area: '',
        estado: ''
      },
      activityForm: {
        nombre: '',
        descripcion: '',
        areaId: '',
        fechaProgramada: '',
        operadorId: '',
        estado: 'programada'
      },
      areaForm: {
        nombre: '',
        descripcion: '',
        ubicacion: '',
        icono: ''
      },
      weekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      areas: [
        {
          id: 1,
          nombre: 'Piscina',
          descripcion: 'Área de piscina y recreación',
          ubicacion: 'Planta Baja - Zona Norte',
          icono: 'fas fa-swimming-pool',
          estado: 'activa'
        },
        {
          id: 2,
          nombre: 'Gimnasio',
          descripcion: 'Sala de ejercicios y fitness',
          ubicacion: 'Planta Baja - Zona Sur',
          icono: 'fas fa-dumbbell',
          estado: 'activa'
        },
        {
          id: 3,
          nombre: 'Jardín',
          descripcion: 'Área verde y jardines',
          ubicacion: 'Exterior',
          icono: 'fas fa-tree',
          estado: 'activa'
        }
      ],
      operators: [
        { id: 1, nombre: 'Carlos Martínez', email: 'carlos@email.com' },
        { id: 2, nombre: 'Ana López', email: 'ana@email.com' }
      ],
      activities: [
        {
          id: 1,
          nombre: 'Limpieza de Piscina',
          descripcion: 'Limpieza semanal de la piscina',
          area: { id: 1, nombre: 'Piscina' },
          fechaProgramada: new Date('2024-01-20T10:00:00'),
          estado: 'programada',
          operador: { id: 1, nombre: 'Carlos Martínez', email: 'carlos@email.com' }
        },
        {
          id: 2,
          nombre: 'Mantenimiento Equipos Gimnasio',
          descripcion: 'Revisión y mantenimiento de equipos',
          area: { id: 2, nombre: 'Gimnasio' },
          fechaProgramada: new Date('2024-01-22T14:00:00'),
          estado: 'en_progreso',
          operador: { id: 2, nombre: 'Ana López', email: 'ana@email.com' }
        }
      ]
    }
  },
  computed: {
    currentMonthYear() {
      return this.currentDate.toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      })
    },
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const days = []
      const today = new Date()
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        
        const dayActivities = this.activities.filter(activity => {
          const activityDate = new Date(activity.fechaProgramada)
          return activityDate.toDateString() === date.toDateString()
        })
        
        days.push({
          date: date.toISOString(),
          day: date.getDate(),
          otherMonth: date.getMonth() !== month,
          isToday: date.toDateString() === today.toDateString(),
          activities: dayActivities
        })
      }
      
      return days
    },
    filteredActivities() {
      return this.activities.filter(activity => {
        const matchesSearch = !this.searchTerm || 
          activity.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          activity.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        
        const matchesArea = !this.activitiesFilter.area || activity.area.id == this.activitiesFilter.area
        const matchesEstado = !this.activitiesFilter.estado || activity.estado === this.activitiesFilter.estado
        
        return matchesSearch && matchesArea && matchesEstado
      })
    }
  },
  methods: {
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getStatusLabel(status) {
      const labels = {
        programada: 'Programada',
        en_progreso: 'En Progreso',
        completada: 'Completada'
      }
      return labels[status] || status
    },
    viewActivity(activity) {
      this.selectedActivity = activity
      this.showActivityDetailsModal = true
    },
    editActivity(activity) {
      this.selectedActivity = activity
      this.activityForm = {
        nombre: activity.nombre,
        descripcion: activity.descripcion,
        areaId: activity.area.id,
        fechaProgramada: new Date(activity.fechaProgramada).toISOString().slice(0, 16),
        operadorId: activity.operador ? activity.operador.id : '',
        estado: activity.estado
      }
      this.showEditActivityModal = true
    },
    deleteActivity(activity) {
      if (confirm(`¿Está seguro de eliminar la actividad "${activity.nombre}"?`)) {
        this.activities = this.activities.filter(a => a.id !== activity.id)
      }
    },
    markAsCompleted(activity) {
      if (confirm('¿Marcar esta actividad como completada?')) {
        activity.estado = 'completada'
      }
    },
    saveActivity() {
      const area = this.areas.find(a => a.id == this.activityForm.areaId)
      const operador = this.activityForm.operadorId ? 
        this.operators.find(o => o.id == this.activityForm.operadorId) : null
      
      if (this.showCreateActivityModal) {
        const newActivity = {
          id: Date.now(),
          ...this.activityForm,
          area,
          operador,
          fechaProgramada: new Date(this.activityForm.fechaProgramada)
        }
        this.activities.push(newActivity)
      } else {
        const index = this.activities.findIndex(a => a.id === this.selectedActivity.id)
        if (index !== -1) {
          this.activities[index] = {
            ...this.activities[index],
            ...this.activityForm,
            area,
            operador,
            fechaProgramada: new Date(this.activityForm.fechaProgramada)
          }
        }
      }
      
      this.closeActivityModals()
    },
    closeActivityModals() {
      this.showCreateActivityModal = false
      this.showEditActivityModal = false
      this.selectedActivity = null
      this.activityForm = {
        nombre: '',
        descripcion: '',
        areaId: '',
        fechaProgramada: '',
        operadorId: '',
        estado: 'programada'
      }
    },
    editArea(area) {
      this.selectedArea = area
      this.areaForm = {
        nombre: area.nombre,
        descripcion: area.descripcion,
        ubicacion: area.ubicacion,
        icono: area.icono
      }
      this.showEditAreaModal = true
    },
    deleteArea(area) {
      if (confirm(`¿Está seguro de eliminar el área "${area.nombre}"?`)) {
        this.areas = this.areas.filter(a => a.id !== area.id)
      }
    },
    saveArea() {
      if (this.showCreateAreaModal) {
        const newArea = {
          id: Date.now(),
          ...this.areaForm,
          estado: 'activa'
        }
        this.areas.push(newArea)
      } else {
        const index = this.areas.findIndex(a => a.id === this.selectedArea.id)
        if (index !== -1) {
          this.areas[index] = {
            ...this.areas[index],
            ...this.areaForm
          }
        }
      }
      
      this.closeAreaModals()
    },
    closeAreaModals() {
      this.showCreateAreaModal = false
      this.showEditAreaModal = false
      this.selectedArea = null
      this.areaForm = {
        nombre: '',
        descripcion: '',
        ubicacion: '',
        icono: ''
      }
    }
  }
}
</script>

<style scoped>
.mantenimiento-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Sub Navigation */
.sub-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #6c757d;
  font-weight: 500;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.tab-btn.active {
  background-color: #007bff;
  color: white;
  border-bottom: 2px solid #007bff;
}

/* Calendar Styles */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #e9ecef;
}

.calendar-filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: white;
  min-width: 150px;
}

.calendar-grid {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8f9fa;
}

.weekday {
  padding: 15px;
  text-align: center;
  font-weight: 600;
  color: #495057;
  border-right: 1px solid #dee2e6;
}

.weekday:last-child {
  border-right: none;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 120px;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  padding: 8px;
  position: relative;
}

.calendar-day:last-child {
  border-right: none;
}

.calendar-day.other-month {
  background: #f8f9fa;
  color: #adb5bd;
}

.calendar-day.today {
  background: #e3f2fd;
}

.calendar-day.has-activities {
  background: #fff3cd;
}

.day-number {
  font-weight: 600;
  margin-bottom: 5px;
}

.day-activities {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-item {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-item.programada {
  background: #cce5ff;
  color: #0056b3;
}

.activity-item.en_progreso {
  background: #fff3cd;
  color: #856404;
}

.activity-item.completada {
  background: #d4edda;
  color: #155724;
}

.more-activities {
  font-size: 10px;
  color: #6c757d;
  font-style: italic;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #495057;
}

/* Filters */
.filters-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 35px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
}

/* Tables */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.activities-table,
.areas-table {
  width: 100%;
  border-collapse: collapse;
}

.activities-table th,
.areas-table th {
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.activities-table td,
.areas-table td {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: top;
}

.activity-info,
.area-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.activity-name,
.area-name {
  font-weight: 600;
  color: #495057;
}

.activity-description {
  font-size: 13px;
  color: #6c757d;
}

.area-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.area-icon {
  width: 40px;
  height: 40px;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.programada {
  background: #cce5ff;
  color: #0056b3;
}

.status-badge.en_progreso {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completada {
  background: #d4edda;
  color: #155724;
}

.status-badge.activa {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactiva {
  background: #f8d7da;
  color: #721c24;
}

.operator-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.operator-name {
  font-weight: 500;
  color: #495057;
}

.operator-email {
  font-size: 12px;
  color: #6c757d;
}

.no-operator {
  color: #6c757d;
  font-style: italic;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 5px;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-action.complete {
  background: #28a745;
  color: white;
}

.btn-action.complete:hover {
  background: #218838;
}

.btn-action.edit {
  background: #ffc107;
  color: #212529;
}

.btn-action.edit:hover {
  background: #e0a800;
}

.btn-action.delete {
  background: #dc3545;
  color: white;
}

.btn-action.delete:hover {
  background: #c82333;
}

/* Buttons */
.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.btn-secondary:hover {
  background: #545b62;
}

/* Modals */
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
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  color: #495057;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
}

.close-btn:hover {
  color: #495057;
}

/* Forms */
.activity-form,
.area-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

/* Activity Details */
.activity-details {
  padding: 20px;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item label {
  font-weight: 500;
  color: #6c757d;
  font-size: 13px;
}

.detail-item span {
  color: #495057;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .calendar-filters {
    justify-content: center;
  }
  
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .activities-table,
  .areas-table {
    font-size: 14px;
  }
  
  .activities-table th,
  .areas-table th,
  .activities-table td,
  .areas-table td {
    padding: 10px;
  }
}
</style>
