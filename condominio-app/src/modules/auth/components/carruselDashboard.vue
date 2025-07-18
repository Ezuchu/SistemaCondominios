<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Componente Saldo General -->
      <div class="col-md-4 mb-4">
        <div class="card info-card shadow-sm carta-saldo">
          <div class="card-body text-left">
            <h1 class="card-value text-success">1.557.785,67</h1>
            <p class="card-label h1">Saldo General</p>
          </div>
        </div>
      </div>

      <!-- Componente Deudas Pendientes -->
      <div class="col-md-4 mb-4">
        <div class="card info-card shadow-sm carta-deudas">
          <div class="card-body text-left">
            <h1 class="card-value text-warning">57.785,67</h1>
            <p class="card-label h1">Deudas Pendientes</p>
          </div>
        </div>
      </div>

      <!-- Componente Nuevos Propietarios -->
      <div class="col-md-4 mb-4">
        <div class="card info-card shadow-sm carta-propietarios">
          <div class="card-body text-left">
            <h1 class="card-value text-success ">30</h1>
            <p class="card-label h1">Nuevos Propietarios</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCards'
}
</script>

<style lang="scss">


.info-card {
    max-width: 250px;
  border-radius: 10px;
  border: none;
  transition: transform 0.3s ease;
  text-align: left;
}

.info-card:hover {
  transform: translateY(-5px);
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.card-label {
  font-size: 1.1rem;
  color: var(--color-oscuro);
  margin-bottom: 0;
}

.carta-deudas
{
    background-color: var(--color-primario);
    color: var(--color-fondo);
}

/* Colores personalizados */
.text-warning {
    font-size: 2rem;
  color: var(--color-azul-claro) !important;
}

.text-success {
    font-size: 2rem;
  color: var(--color-primario) !important;
}
</style>