<template>
  <div class="p-2 p-md-4">
    <!-- Header -->
    <div class="flex align-center mb-4">
      <button class="btn btn-outline-secondary me-3 d-lg-none" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div>
        <h2 class="h3 mb-0 text-primary">Registrar Nuevo Pago</h2>
        <p class="text-muted mb-0">Complete la información de su pago</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-8">
        <div class="card h-100">
          <div class="card-header bg-white border-0 pb-0">
            <h5 class="card-title mb-0 text-primary">
              <i class="bi bi-credit-card me-2"></i>
              Información del Pago
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="registrarPago">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label text-muted small">Monto del Pago *</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="formData.monto"
                      step="0.01"
                      required
                    >
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label text-muted small">Fecha del Pago *</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="formData.fecha"
                    required
                  >
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label text-muted small">Método de Pago *</label>
                  <select class="form-select" v-model="formData.metodo" required>
                    <option value="">Seleccionar método</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="cheque">Cheque</option>
                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label text-muted small">Número de Referencia</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.referencia"
                    placeholder="Ej: 123456789"
                  >
                </div>
                <div class="col-12">
                  <label class="form-label text-muted small">Concepto del Pago</label>
                  <select class="form-select" v-model="formData.concepto">
                    <option value="mantenimiento">Cuota de Mantenimiento</option>
                    <option value="extraordinaria">Cuota Extraordinaria</option>
                    <option value="multa">Pago de Multa</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label text-muted small">Observaciones</label>
                  <textarea 
                    class="form-control" 
                    rows="3" 
                    v-model="formData.observaciones"
                    placeholder="Información adicional sobre el pago..."
                  ></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label text-muted small">Comprobante de Pago</label>
                  <input 
                    type="file" 
                    class="form-control" 
                    @change="handleFileUpload"
                    accept="image/*,.pdf"
                  >
                  <div class="form-text">
                    <i class="bi bi-info-circle me-1"></i>
                    Formatos permitidos: JPG, PNG, PDF (máx. 5MB)
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary" :disabled="enviando">
                  <span v-if="enviando" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ enviando ? 'Registrando...' : 'Registrar Pago' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="limpiarFormulario">
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card h-100">
          <div class="card-header bg-white border-0 pb-0">
            <h5 class="card-title mb-0 text-primary">
              <i class="bi bi-info-circle me-2"></i>
              Información Importante
            </h5>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <h6 class="alert-heading">
                <i class="bi bi-lightbulb me-2"></i>
                Consejos
              </h6>
              <ul class="mb-0 small">
                <li>Adjunte siempre el comprobante de pago</li>
                <li>Verifique que el monto sea correcto</li>
                <li>Guarde una copia del comprobante</li>
                <li>El pago será verificado en 24-48 horas</li>
              </ul>
            </div>

            <div class="border rounded p-3">
              <h6 class="fw-bold mb-2">
                <i class="bi bi-bank me-2"></i>
                Datos Bancarios
              </h6>
              <div class="small">
                <p class="mb-1"><strong>Banco:</strong> Banco Nacional</p>
                <p class="mb-1"><strong>Cuenta:</strong> 1234-5678-9012</p>
                <p class="mb-1"><strong>Titular:</strong> Condominio XYZ</p>
                <p class="mb-0"><strong>RIF:</strong> J-12345678-9</p>
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

defineEmits(['back'])

const enviando = ref(false)

const formData = ref({
  monto: '',
  fecha: new Date().toISOString().split('T')[0],
  metodo: '',
  referencia: '',
  concepto: 'mantenimiento',
  observaciones: '',
  comprobante: null
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 5MB.')
      return
    }
    formData.value.comprobante = file
  }
}

const registrarPago = async () => {
  enviando.value = true
  
  try {
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Pago registrado exitosamente')
    limpiarFormulario()
  } catch (error) {
    alert('Error al registrar el pago')
  } finally {
    enviando.value = false
  }
}

const limpiarFormulario = () => {
  formData.value = {
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    metodo: '',
    referencia: '',
    concepto: 'mantenimiento',
    observaciones: '',
    comprobante: null
  }
}
</script>
