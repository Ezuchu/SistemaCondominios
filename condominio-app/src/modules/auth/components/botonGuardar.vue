<template>
    <button class="btnGuardar">
        Guardar
    </button>
</template>

<style lang="scss">
    
    .btnGuardar
    {
        background-color: var(--color-peligro);
        color: var(--color-fondo);
        border: 3px solid var(--color-peligro);
        border-radius: 40px;

        padding: 12px 40px;

        min-height: 42px;
        min-width:  42px;

        font-weight: 600;

        &:hover {
            background-color: var(--color-fondo);
            border-color: var(--color-peligro);
            color: var(--color-peligro);
        }
    }
</style>