<template>
    <div class="tabla">
        <div class="card mb-4">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0" id="productsTable">
                        <thead>
                            <tr>
                                <th width="40px"></th>
                                <th>Propietario</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Fila principal con capacidad de expandir -->
                            <tr class="expandable-row">
                                <td class="text-center">
                                    <button class="expand-btn" @click.stop="toggleRow(0)">
                                        <span class="expand-icon">
                                            {{ expandedRows[0] ? '▲' : '▼' }}
                                        </span>
                                    </button>
                                </td>
                                <td>Juanito Alonso</td>
                                <td>
                                    <button class="btnEditar">
                                        <img src="../../../../public/iconoEditar.svg" alt="">
                                    </button>
                                </td>
                            </tr>
                            <!-- Detalles de la fila (ocultos por defecto) -->
                            <tr class="row-details" :class="{ show: expandedRows[0] }">
                                <td colspan="3">
                                    <div class="detail-item">
                                        <span class="detail-label">Fecha:</span>
                                        <span>09/09/2023</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Concepto:</span>
                                        <span>Alicuota</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Monto:</span>
                                        <span>36,00</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Método de pago:</span>
                                        <span>Divisa</span>
                                    </div>
                                </td>
                            </tr>

                            <tr class="expandable-row">
                                <td class="text-center">
                                    <button class="expand-btn" @click.stop="toggleRow(1)">
                                        <span class="expand-icon">
                                            {{ expandedRows[1] ? '▲' : '▼' }}
                                        </span>
                                    </button>
                                </td>
                                <td>Juanito Alonso</td>
                                <td>
                                    <button class="btnEditar">
                                        <img src="../../../../public/iconoEditar.svg" alt="">
                                    </button>
                                </td>
                            </tr>
                            <!-- Detalles de la fila (ocultos por defecto) -->
                            <tr class="row-details" :class="{ show: expandedRows[1] }">
                                <td colspan="3">
                                    <div class="detail-item">
                                        <span class="detail-label">Fecha:</span>
                                        <span>09/09/2023</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Concepto:</span>
                                        <span>Deuda</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Monto:</span>
                                        <span>57,00</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Método de pago:</span>
                                        <span>Transferencia</span>
                                    </div>
                                </td>
                            </tr>
                            
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>    
   </div>
</template>

<script>
export default {
    name: 'tablaPagos',
    data() {
        return {
            expandedRows: [false, false]
        }
    },
    methods: {
        toggleRow(index) {
            this.expandedRows[index] = !this.expandedRows[index];
        }
    }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.btnEditar
{
    border:1px solid var(--color-fondo);
}


.card
{
    max-width: 500px;
}

.table-responsive {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    overflow: hidden; /* Esto asegura que los bordes internos también se redondeen */
    border: 2px groove $color-naranja;
}

.table {
    color: $color-primario; /* Color azul para el texto de la tabla */
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 10px;
    overflow: hidden; /* Para mantener los bordes redondeados */
    
    th
    {
        border-top: none;
        border-bottom: 1px solid $color-primario;
        padding: 16px;
    }
    td {
        border-top: none;
        border-bottom: none;
        padding: 16px;
    }
}

.table thead {
    background-color: var(--light-gray);
    th {
        font-size: $tamaño-fuente-base;
        color: $color-primario; /* Un azul más oscuro para los encabezados */
        padding: 16px;
    }
}

.expand-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: $tamaño-fuente-base;
    color: $color-primario; /* Azul para el botón de expansión */
    outline: none;
}

.expand-icon {
    font-size: 1.2rem;
    vertical-align: middle;
}

.expandable-row {
    cursor: pointer;
    transition: background-color 0.2s;
    td
    {
        font-size: $tamaño-fuente-base;
        font-weight: $peso-fuente-base;
        font-family: $fuente-base;
        color: $color-primario;
    }
}

.expandable-row:hover {
    background-color: rgba(0,0,0,0.02);
}

.row-details {
    display: none;
    padding: 15px;
    background-color: #f9f9f9;
    border-top: 1px solid #eee;
    font-family: $fuente-base;
    color: $color-primario; /* Azul para el texto de los detalles */
}

.row-details.show {
    display: table-row;
}

.detail-item {
    margin-bottom: 8px;

    span
    {
        font-size: $tamaño-fuente-base;
        font-family: $fuente-base;
        color: $color-primario; /* Azul para el texto de los detalles */
    }
}

.detail-label {
    font-weight: 600;
    /*color: var(--secondary-color);*/
    display: inline-block;
    min-width: 100px;
    color: $color-primario; /* Azul más oscuro para las etiquetas */
}
</style>