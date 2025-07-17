<template>
    <button class ="btnProgramarMantenimiento">
        Programar Mantenimiento
    </button>
</template>

<style lang ="scss">
    @import '@/styles/variables';

    .btnProgramarMantenimiento {
        background-color: $color-peligro;
        color: $color-fondo;
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 38px 40px;
        gap: 10px;
        font-size: 1rem;
        transition: background-color 0.3s ease;

        min-width: 42px;
        min-height: 42px;
        max-height: 72px;
        min-height: 72px;

        text-align: left;
        font-family: $fuente-base;
        font-size: $tamaño-h2;
        font-weight: $peso-h2;

        &:hover {
            background-color: darken($color-peligro, 20%);
        }
    }
</style>





