<template>
  <div class="container">
    <h3>Mis Estados de Cuenta</h3>
    <div class="mb-3">
      <label>Filtrar por período:</label>
      <input type="month" class="form-control" />
    </div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Fecha de Generación</th>
          <th>Saldo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>01/07/2025</td>
          <td>$1,200</td>
          <td>
            <button class="btn btn-info btn-sm">Ver</button>
            <button class="btn btn-outline-secondary btn-sm">Descargar PDF</button>
          </td>
        </tr>
        <!-- Más filas -->
      </tbody>
    </table>
  </div>
</template>