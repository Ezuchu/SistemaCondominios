<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <!-- Datos Personales -->
          <div class="form-section">
            <h2 class="section-title">Datos Personales</h2>
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
                      placeholder=""
                      v-model="formData.identificacion"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                <div class="form-group">
                  <input
                    placeholder="nombre"
                    type="text"
                    class="form-control"
                    v-model="formData.nombre"
                    required
                  />
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <input
                    placeholder="apellido"
                    type="text"
                    class="form-control"
                    v-model="formData.apellido"
                    required
                  />
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <input
                    placeholder="teléfono"
                    type="text"
                    class="form-control"
                    v-model="formData.telefono"
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <div class="email-group">
                    <input
                    
                      type="text"
                      class="form-control email-user"
                      v-model="formData.emailUser"
                      placeholder="Correo Eléctronico"
                    />
                    <span class="email-at">@</span>
                    <select v-model="formData.emailDomain" class="form-control email-domain">
                      <option value="gmail">gmail</option>
                      <option value="hotmail">hotmail</option>
                      <option value="yahoo">yahoo</option>
                    </select>
                    <select v-model="formData.emailTld" class="form-control email-tld">
                      <option value=".com">.com</option>
                      <option value=".ve">.ve</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Datos de Acceso -->
          <div class="form-section">
            <h2 class="section-title">Datos de Acceso</h2>
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <input
                    placeholder="Usuario"
                    type="text"
                    class="form-control"
                    v-model="formData.usuario"
                    required
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <input
                    placeholder="Contraseña"
                    type="password"
                    class="form-control"
                    v-model="formData.contrasena"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Detalles de la Propiedad -->
          <div class="form-section">
            <h2 class="section-title">Detalles de la Propiedad</h2>
            <div class="row">
              <div class="col-3">
                <div class="form-group">
                  <label class="label">Cantidad de Propiedades</label>
                  <select v-model="formData.cantidadPropiedades" class="form-control">
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label class="label">Nombre de la(s) Propiedad(es)</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.nombresPropiedades"
                    placeholder="Ej: B17, B19, C20"
                  />
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label class="label">Alicuota</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.alicuota"
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
  name: 'RegistroPropietarioForm',
  data() {
    return {
      formData: {
        tipoId: 'V',
        identificacion: '',
        nombre: '',
        apellido: '',
        telefono: '',
        emailUser: '',
        emailDomain: 'gmail',
        emailTld: '.com',
        usuario: '',
        contrasena: '',
        cantidadPropiedades: 1,
        nombresPropiedades: '',
        alicuota: ''
      }
    }
  },
  methods: {
    submitForm() {
      // Aquí iría la lógica para enviar los datos al servidor
      alert('Propietario registrado correctamente');
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        tipoId: 'V',
        identificacion: '',
        nombre: '',
        apellido: '',
        telefono: '',
        emailUser: '',
        emailDomain: 'gmail',
        emailTld: '.com',
        usuario: '',
        contrasena: '',
        cantidadPropiedades: 1,
        nombresPropiedades: '',
        alicuota: ''
      };
    }
  }
}
</script>

<style lang="scss">
.card {
  border-radius: 18px;
  max-width: 1100px;
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
  gap: 10px 0;
}

.col-12 { width: 100%; padding-right: 10px; }
.col-6 { width: 48%; min-width: 220px; padding-right: 10px; }
.col-3 { width: 23%; min-width: 120px; padding-right: 10px; }

@media (max-width: 900px) {
  .col-3, .col-6, .col-12 { width: 100%; min-width: unset; }
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

.email-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.email-user { max-width: 200px; }
.email-at { font-size: 1.2rem; color: #888; }
.email-domain { width: 100px; }
.email-tld { width: 80px; }

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
  background: var(--color-fond);
}
</style>