<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <!-- Propietario -->
          <div class="form-section">
            <h2 class="section-title">
              Propietario <span class="required">*</span>
            </h2>
            <div class="row">
              <div class="col-3">
                <div class="form-group">
                  <label class="label">Identificación</label>
                  <div class="id-group">
                    <select v-model="formData.tipoId" class="form-control id-select">
                      <option value="V">V</option>
                      <option value="E">E</option>
                      <option value="J">J</option>
                    </select>
                    <input
                      type="text"
                      class="form-control id-input"
                      v-model="formData.identificacion"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nombre"
                    v-model="formData.nombre"
                  />
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Apellido"
                    v-model="formData.apellido"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Fechas -->
          <div class="form-section">
            <div class="row">
              <div class="col-6">
                <h2 class="section-title">Fecha Inicio</h2>
                <div class="form-group">
                  <input
                    type="date"
                    class="form-control"
                    v-model="formData.fechaInicio"
                    required
                  />
                </div>
              </div>
              <div class="col-6">
                <h2 class="section-title">Fecha Fin</h2>
                <div class="form-group">
                  <input
                    type="date"
                    class="form-control"
                    v-model="formData.fechaFin"
                    required
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
  name: 'EstadoCuentaForm',
  data() {
    return {
      formData: {
        tipoId: 'V',
        identificacion: '',
        nombre: '',
        apellido: '',
        fechaInicio: '',
        fechaFin: ''
      }
    }
  },
  methods: {
    submitForm() {
      alert('Estado de cuenta registrado correctamente');
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        tipoId: 'V',
        identificacion: '',
        nombre: '',
        apellido: '',
        fechaInicio: '',
        fechaFin: ''
      };
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 18px;
  max-width: 950px;
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
  display: flex;
  align-items: center;
  gap: 6px;
}

.required {
  color: #0d47a1;
  font-size: 1.2rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 0;
}

.col-12 { width: 100%; padding-right: 10px; }
.col-6 { width: 48%; min-width: 220px; padding-right: 10px; }
.col-4 { width: 31%; min-width: 180px; padding-right: 10px; }
.col-3 { width: 23%; min-width: 120px; padding-right: 10px; }

@media (max-width: 900px) {
  .col-3, .col-4, .col-6, .col-12 { width: 100%; min-width: unset; }
}

.form-group { margin-bottom: 1.2rem; }
label { color: #666; margin-bottom: 0.3rem; display: block; font-size: 1rem; }

.form-control {
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 10px 15px;
  font-size: 1rem;
  font-family: var(--font-base);
  max-width: 400px;
}

.id-group {
  display: flex;
  gap: 8px;
}

.id-select {
  width: 60px;
  min-width: 60px;
  padding-right: 0;
}

.id-input {
  flex: 1;
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
  background:var(--color-fondo);
}
</style>