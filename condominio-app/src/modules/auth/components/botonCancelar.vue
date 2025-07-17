<template>
    <button class="btnCancelar">
        Cancelar
    </button>
</template>

<style lang="scss">
    
    .btnCancelar
    {
        background-color: var(--color-fondo);
        color: var(--color-primario);
        border: 3px solid var(--color-primario);
        border-radius: 40px;

        padding: 12px 40px;

        min-height: 42px;
        min-width:  42px;

        font-weight: 600;

        &:hover {
            background-color: var(--color-primario);
            color: var(--color-fondo);
        }
    }
</style>