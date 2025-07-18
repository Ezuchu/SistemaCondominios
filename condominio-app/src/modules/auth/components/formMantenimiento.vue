<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <!-- Campo Área -->
          <div class="form-group">
            <label for="area" class="font-weight-bold h2">Area *</label>
            <select class="form-control" id="area" v-model="formData.area" required>
              <option value="" disabled selected>Seleccione un área</option>
              <option value="Piscina">Piscina</option>
              <option value="Jardín">Jardín</option>
              <option value="Salón">Salón</option>
              <option value="Gimnasio">Gimnasio</option>
            </select>
          </div>

          <!-- Campo Fecha -->
          <div class="form-group">
            <label for="fecha" class="font-weight-bold h2">Fecha *</label>
            <input 
              type="date" 
              class="form-control" 
              id="fecha" 
              v-model="formData.fecha"
              placeholder="mm/dd/yyyy"
              required>
          </div>

          <!-- Campo Responsable -->
          <div class="form-group">
            <label for="responsable" class="font-weight-bold h2">Responsable</label>
            <select class="form-control" id="responsable" v-model="formData.responsable">
              <option value="" disabled selected>Seleccione un responsable</option>
              <option value="Operator">Operator</option>
              <option value="Administrador">Administrador</option>
              <option value="Supervisor">Supervisor</option>
            </select>
          </div>

          <!-- Campo Descripción -->
          <div class="form-group">
            <label for="descripcion" class="font-weight-bold h2">Descripción</label>
            <textarea 
              class="form-control" 
              id="descripcion" 
              v-model="formData.descripcion"
              rows="3"></textarea>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AreaForm',
  data() {
    return {
      formData: {
        area: '',
        fecha: '',
        responsable: '',
        descripcion: ''
      }
    }
  },
  methods: {
    submitForm() {
      console.log('Formulario enviado:', this.formData);
      // Aquí iría la lógica para enviar los datos al servidor
      alert('Registro guardado correctamente');
    },
    resetForm() {
      this.formData = {
        area: '',
        fecha: '',
        responsable: '',
        descripcion: ''
      };
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  border: 2px groove var(--color-naranja);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  color: var(--color-primario);
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  border-radius: 5px;
  border: 1px solid #ced4da;
  padding: 10px 15px;
}

.btn {
  min-width: 100px;
  padding: 8px 20px;
  border-radius: 5px;
  font-weight: 500;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}
</style>