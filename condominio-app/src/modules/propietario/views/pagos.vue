<template>
  <div class="container">
    <h3>Registrar Nuevo Pago</h3>
    <form>
      <div class="mb-3">
        <label class="form-label">Monto</label>
        <input type="number" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Fecha de Pago</label>
        <input type="date" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Método de Pago</label>
        <select class="form-select">
          <option>Transferencia</option>
          <option>Depósito</option>
          <option>Efectivo</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Referencia/Comprobante</label>
        <input type="text" class="form-control" />
        <input type="file" class="form-control mt-2" />
      </div>
      <button class="btn btn-success">Enviar Comprobante</button>
    </form>
  </div>
</template>