<template>
  <div class="p-2 p-md-4">
    <!-- Header -->
    <div class="flex align-center mb-4">
      <button class="btn btn-outline-secondary me-3 d-lg-none" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div>
        <h2 class="h3 mb-0 text-primary">Mi Perfil</h2>
        <p class="text-muted mb-0">Información personal y de la propiedad</p>
      </div>
    </div>

    <div class="row g-4">
      <!-- Información Personal -->
      <div class="col-12 col-lg-6">
        <div class="card h-100">
          <div class="card-header bg-white border-0 pb-0">
            <h5 class="card-title mb-0 text-primary">
              <i class="bi bi-person me-2"></i>
              Información Personal
            </h5>
          </div>
          <div class="card-body">
            <div class="text-center mb-4">
              <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-center justify-center" style="width: 80px; height: 80px;">
                <i class="bi bi-person-fill text-primary fs-1"></i>
              </div>
              <h5 class="mt-3 mb-1">{{ perfil.nombre }}</h5>
              <p class="text-muted">{{ perfil.email }}</p>
            </div>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label text-muted small">Nombre Completo</label>
                <p class="fw-bold mb-2">{{ perfil.nombre }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small">Cédula/RIF</label>
                <p class="fw-bold mb-2">{{ perfil.cedula }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small">Teléfono</label>
                <p class="fw-bold mb-2">{{ perfil.telefono }}</p>
              </div>
              <div class="col-12">
                <label class="form-label text-muted small">Email</label>
                <p class="fw-bold mb-2">{{ perfil.email }}</p>
              </div>
              <div class="col-12">
                <label class="form-label text-muted small">Dirección</label>
                <p class="fw-bold mb-2">{{ perfil.direccion }}</p>
              </div>
            </div>
            <div class="d-grid mt-4">
              <button class="btn btn-outline-primary" @click="editarPerfil">
                <i class="bi bi-pencil me-2"></i>
                Editar Información
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de la Propiedad -->
      <div class="col-12 col-lg-6">
        <div class="card h-100">
          <div class="card-header bg-white border-0 pb-0">
            <h5 class="card-title mb-0 text-primary">
              <i class="bi bi-building me-2"></i>
              Información de la Propiedad
            </h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small">Apartamento</label>
                <p class="fw-bold mb-2">{{ propiedad.apartamento }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small">Torre/Edificio</label>
                <p class="fw-bold mb-2">{{ propiedad.torre }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small">Área (m²)</label>
                <p class="fw-bold mb-2">{{ propiedad.area }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small">Tipo</label>
                <p class="fw-bold mb-2">{{ propiedad.tipo }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small">Cuota Mensual</label>
                <p class="fw-bold mb-2 text-success">{{ formatearMoneda(propiedad.cuotaMensual) }}</p>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small">Estado</label>
                <span class="badge bg-success">{{ propiedad.estado }}</span>
              </div>
              <div class="col-12">
                <label class="form-label text-muted small">Fecha de Adquisición</label>
                <p class="fw-bold mb-2">{{ formatearFecha(propiedad.fechaAdquisicion) }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Estado de Cuenta -->
        <div class="card mt-4">
          <div class="card-header bg-white border-0 pb-0">
            <h5 class="card-title mb-0 text-primary">
              <i class="bi bi-graph-up me-2"></i>
              Estado de Cuenta
            </h5>
          </div>
          <div class="card-body">
            <div class="row g-3 text-center">
              <div class="col-6">
                <div class="bg-success bg-opacity-10 rounded p-3">
                  <i class="bi bi-check-circle text-success fs-3"></i>
                  <h6 class="mt-2 mb-1">Pagos al Día</h6>
                  <p class="text-muted small mb-0">{{ estadoCuenta.pagosAlDia }}</p>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-warning bg-opacity-10 rounded p-3">
                  <i class="bi bi-clock text-warning fs-3"></i>
                  <h6 class="mt-2 mb-1">Saldo Pendiente</h6>
                  <p class="text-muted small mb-0">{{ formatearMoneda(estadoCuenta.saldoPendiente) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="row g-4 mt-2">
      <div class="col-12 col-lg-6">
        <div class="card h-100">
          <div class="card-header bg-white border-0 pb-0">
            <h5 class="card-title mb-0 text-primary">
              <i class="bi bi-car-front me-2"></i>
              Estacionamientos
            </h5>
          </div>
          <div class="card-body">
            <div v-if="estacionamientos.length === 0" class="text-center py-3">
              <i class="bi bi-car-front text-muted fs-1"></i>
              <p class="text-muted mt-2">No tiene estacionamientos asignados</p>
            </div>
            <div v-else class="list-group list-group-flush">
              <div v-for="estacionamiento in estacionamientos" :key="estacionamiento.id" class="list-group-item border-0 px-0">
                <div class="flex justify-between align-center">
                  <div>
                    <h6 class="mb-1">{{ estacionamiento.numero }}</h6>
                    <p class="mb-0 text-muted small">{{ estacionamiento.tipo }}</p>
                  </div>
                  <span class="badge bg-primary">{{ estacionamiento.nivel }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="card h-100">
          <div class="card-header bg-white border-0 pb-0">
            <h5 class="card-title mb-0 text-primary">
              <i class="bi bi-archive me-2"></i>
              Depósitos
            </h5>
          </div>
          <div class="card-body">
            <div v-if="depositos.length === 0" class="text-center py-3">
              <i class="bi bi-archive text-muted fs-1"></i>
              <p class="text-muted mt-2">No tiene depósitos asignados</p>
            </div>
            <div v-else class="list-group list-group-flush">
              <div v-for="deposito in depositos" :key="deposito.id" class="list-group-item border-0 px-0">
                <div class="flex justify-between align-center">
                  <div>
                    <h6 class="mb-1">{{ deposito.numero }}</h6>
                    <p class="mb-0 text-muted small">{{ deposito.area }} m²</p>
                  </div>
                  <span class="badge bg-secondary">{{ deposito.nivel }}</span>
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
import { ref } from 'vue'
import modalEditarPerfil from '../components/modalEditarPerfil.vue'

defineEmits(['back'])

const perfil = ref({
  nombre: 'Juan Carlos Pérez',
  cedula: 'V-12.345.678',
  telefono: '+58 412-1234567',
  email: 'juan.perez@email.com',
  direccion: 'Caracas, Venezuela'
})

const propiedad = ref({
  apartamento: '301-A',
  torre: 'Torre Norte',
  area: '85',
  tipo: 'Apartamento',
  cuotaMensual: 400,
  estado: 'Activo',
  fechaAdquisicion: '2020-03-15'
})

const estadoCuenta = ref({
  pagosAlDia: 'Sí',
  saldoPendiente: 0
})

const estacionamientos = ref([
  {
    id: 1,
    numero: 'E-45',
    tipo: 'Cubierto',
    nivel: 'Sótano 1'
  }
])

const depositos = ref([
  {
    id: 1,
    numero: 'D-12',
    area: '4',
    nivel: 'Sótano 2'
  }
])

const formatearMoneda = (monto) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(monto)
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const editarPerfil = () => {
  // Aquí puedes abrir un modal o navegar a la edición
  console.log('Editar perfil')
}
</script>
