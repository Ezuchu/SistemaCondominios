<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-body">
        <p>¿Seguro que deseas cancelar el registro de pago?</p>
      </div>
      <div class="modal-footer">
          <button class="btn-Seguro" onclick="closeModal">Seguro</button>
          <button class="btn-Cancela" onclick="closeModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalPago',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss">

    

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-body p {
    font-family: var(--font-base);
    font-size: var(--font-size-h2);
    color: #333;
}

.modal-footer
{
    display: flex;
    justify-content: flex;
    align-items: center;
    flex-direction: row;
    gap:10px;
}

  .btn-Seguro
    {
        background-color: var(--color-fondo);
        color: var(--color-peligro);
        border: 3px solid var(--color-peligro);
        border-radius: 40px;

        padding: 15px 40px;

        min-height: 42px;
        min-width:  42px;

        font-weight: 600;

        &:hover {
            background-color: var(--color-peligro);
            color: var(--color-fondo);
        }    
    }

    .btn-Cancela
    {
        background-color: var(--color-peligro);
        color: var(--color-fondo);
        border: 3px solid var(--color-peligro);
        border-radius: 40px;

        padding: 15px 40px;

        min-height: 42px;
        min-width:  42px;

        font-weight: 600;

        &:hover {
            background-color: var(--color-fondo);
            color: var(--color-peligro);
        }    
    }

</style>