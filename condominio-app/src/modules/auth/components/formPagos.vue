<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <!-- Grupo Propietario -->
          <div class="form-section">
            <h2 class="section-title">Propietario</h2>
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Identificación"
                    v-model="formData.identificacion"
                    required
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nombre"
                    v-model="formData.nombre"
                    required
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="N° Telefónico"
                    v-model="formData.telefono"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Grupo Datos del Pago -->
          <div class="form-section">
            <h2 class="section-title">Datos del Pago</h2>
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label class="label">Fecha Registro Pago *</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="formData.fecha"
                    required
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label class="label">Método de Pago *</label>
                  <select class="form-control" v-model="formData.metodo" required>
                    <option value="" disabled>Seleccione</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Divisa">Divisa</option>
                  </select>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label class="label">Monto *</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="000,00"
                    v-model="formData.monto"
                    required
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label>Concepto</label>
                  <select class="form-control" v-model="formData.concepto">
                    <option value="Alicuota">Alicuota</option>
                    <option value="Deuda">Deuda</option>
                    <option value="Extraordinario">Extraordinario</option>
                  </select>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label>Referencia</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.referencia"
                    placeholder="Referencia"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistroPagoForm',
  data() {
    return {
      formData: {
        identificacion: '',
        nombre: '',
        telefono: '',
        fecha: '',
        monto: '',
        metodo: '',
        referencia: '',
        concepto: 'Alicuota'
      }
    }
  },
  methods: {
    submitForm() {
      // Aquí iría la lógica para enviar los datos al servidor
      alert('Pago registrado correctamente');
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        identificacion: '',
        nombre: '',
        telefono: '',
        fecha: '',
        monto: '',
        metodo: '',
        referencia: '',
        concepto: 'Alicuota'
      };
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 18px;
  max-width: 900px;
  margin: 0 auto;
  border: 2px groove var(--color-naranja);
}

.form-section {
  margin-bottom: 2.5rem;
}

.section-title {
  color: var(--color-primario);
  font-family: var(--font-base);
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 0;
}

.col-12 {
  width: 100%;
  padding-right: 10px;
}

.col-6 {
  width: 48%;
  min-width: 220px;
  padding-right: 10px;
}

@media (max-width: 700px) {
  .col-6, .col-12 {
    width: 100%;
    min-width: unset;
  }
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  color: #666;
  margin-bottom: 0.3rem;
  display: block;
  font-size: 1rem;
}

.label-required {
  color: var(--color-primario);
  font-weight: bold;
  font-size: 1rem;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 10px 15px;
  font-size: 1rem;
  font-family: var(--font-base);
  max-width: 400px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  min-width: 120px;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--color-primario);
  border-color: var(--color-primario);
  color: #fff;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
  background: #fff;
}
</style>