<template>
    <button class ="btnCrearAviso">
        Crear Nuevo Aviso
    </button>
</template>

<style lang ="scss">
    @import '@/styles/variables';

    .btnCrearAviso {
        background-color: $color-primario;
        color: $color-fondo;
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 38px 60px;
        gap: 10px;
        font-size: 1rem;
        border-radius: 0.5rem;
        transition: background-color 0.3s ease;

        text-align: left;

        min-width: 42px;
        min-height: 42px;
        max-height: 72px;
        min-height: 72px;

        font-family: $fuente-base;
        font-size: $tamaño-h1;
        font-weight: $peso-h2;
        
        

        &:hover {
            background-color: darken($color-primario, 20%);
        }
    }
</style>







