<template>
  <div class="finanzas-view">
    <!-- Sub-navigation -->
    <div class="sub-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="{ active: activeTab === tab.key }"
        class="tab-btn"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Cuentas por Cobrar -->
    <div v-if="activeTab === 'cuentas'" class="tab-content">
      <div class="section-header">
        <h2>Cuentas por Cobrar</h2>
        <button @click="showCreateAccountModal = true" class="btn-primary">
          <i class="fas fa-plus"></i>
          Nueva Cuenta
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-row">
        <select v-model="accountsFilter.estado" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagada">Pagada</option>
          <option value="vencida">Vencida</option>
        </select>
        
        <select v-model="accountsFilter.propiedad" class="filter-select">
          <option value="">Todas las propiedades</option>
          <option v-for="prop in properties" :key="prop.id" :value="prop.id">
            {{ prop.numero }} - {{ prop.nombre }}
          </option>
        </select>
        
        <input v-model="accountsFilter.fechaDesde" type="date" class="filter-input">
        <input v-model="accountsFilter.fechaHasta" type="date" class="filter-input">
      </div>

      <!-- Accounts Table -->
      <div class="table-container">
        <table class="accounts-table">
          <thead>
            <tr>
              <th>Propiedad</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Fecha Emisión</th>
              <th>Fecha Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in filteredAccounts" :key="account.id">
              <td>
                <div class="property-cell">
                  <span class="property-number">{{ account.propiedad.numero }}</span>
                  <span class="property-name">{{ account.propiedad.nombre }}</span>
                </div>
              </td>
              <td>{{ account.concepto }}</td>
              <td class="amount-cell">${{ account.monto.toLocaleString() }}</td>
              <td>{{ formatDate(account.fechaEmision) }}</td>
              <td>{{ formatDate(account.fechaVencimiento) }}</td>
              <td>
                <span class="status-badge" :class="account.estado">
                  {{ getStatusLabel(account.estado) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    v-if="account.estado === 'pendiente'"
                    @click="markAsPaid(account)" 
                    class="btn-action pay" 
                    title="Marcar como pagada"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button @click="editAccount(account)" class="btn-action edit" title="Editar">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteAccount(account)" class="btn-action delete" title="Eliminar">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagos -->
    <div v-if="activeTab === 'pagos'" class="tab-content">
      <div class="section-header">
        <h2>Registro de Pagos</h2>
        <button @click="showCreatePaymentModal = true" class="btn-primary">
          <i class="fas fa-plus"></i>
          Registrar Pago
        </button>
      </div>

      <!-- Payments Table -->
      <div class="table-container">
        <table class="payments-table">
          <thead>
            <tr>
              <th>Propiedad</th>
              <th>Monto</th>
              <th>Fecha de Pago</th>
              <th>Método de Pago</th>
              <th>Cuenta Asociada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>
                <div class="property-cell">
                  <span class="property-number">{{ payment.propiedad.numero }}</span>
                  <span class="property-name">{{ payment.propiedad.nombre }}</span>
                </div>
              </td>
              <td class="amount-cell">${{ payment.monto.toLocaleString() }}</td>
              <td>{{ formatDate(payment.fechaPago) }}</td>
              <td>
                <span class="payment-method" :class="payment.metodoPago">
                  {{ getPaymentMethodLabel(payment.metodoPago) }}
                </span>
              </td>
              <td>{{ payment.cuentaAsociada || 'N/A' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="viewPayment(payment)" class="btn-action view" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Estados de Cuenta -->
    <div v-if="activeTab === 'estados'" class="tab-content">
      <div class="section-header">
        <h2>Estados de Cuenta</h2>
        <button @click="showGenerateStatementModal = true" class="btn-primary">
          <i class="fas fa-file-alt"></i>
          Generar Estado
        </button>
      </div>

      <!-- Statements Table -->
      <div class="table-container">
        <table class="statements-table">
          <thead>
            <tr>
              <th>Propiedad</th>
              <th>Período</th>
              <th>Fecha Generación</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="statement in statements" :key="statement.id">
              <td>
                <div class="property-cell">
                  <span class="property-number">{{ statement.propiedad.numero }}</span>
                  <span class="property-name">{{ statement.propiedad.nombre }}</span>
                </div>
              </td>
              <td>{{ statement.periodo }}</td>
              <td>{{ formatDate(statement.fechaGeneracion) }}</td>
              <td class="amount-cell">${{ statement.total.toLocaleString() }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="viewStatement(statement)" class="btn-action view" title="Ver">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="downloadStatement(statement)" class="btn-action download" title="Descargar PDF">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Account Modal -->
    <div v-if="showCreateAccountModal" class="modal-overlay" @click="showCreateAccountModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Generar Nueva Cuenta por Cobrar</h3>
          <button @click="showCreateAccountModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="createAccount" class="account-form">
          <div class="form-group">
            <label>Propiedad</label>
            <select v-model="accountForm.propiedadId" required>
              <option value="">Seleccionar propiedad</option>
              <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                {{ prop.numero }} - {{ prop.nombre }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Concepto</label>
            <input v-model="accountForm.concepto" type="text" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Monto</label>
              <input v-model="accountForm.monto" type="number" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Fecha Emisión</label>
              <input v-model="accountForm.fechaEmision" type="date" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Fecha Vencimiento</label>
            <input v-model="accountForm.fechaVencimiento" type="date" required>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showCreateAccountModal = false" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Generar Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Payment Modal -->
    <div v-if="showCreatePaymentModal" class="modal-overlay" @click="showCreatePaymentModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Registrar Nuevo Pago</h3>
          <button @click="showCreatePaymentModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="createPayment" class="payment-form">
          <div class="form-group">
            <label>Propiedad</label>
            <select v-model="paymentForm.propiedadId" required>
              <option value="">Seleccionar propiedad</option>
              <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                {{ prop.numero }} - {{ prop.nombre }}
              </option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Monto</label>
              <input v-model="paymentForm.monto" type="number" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Fecha de Pago</label>
              <input v-model="paymentForm.fechaPago" type="date" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Método de Pago</label>
            <select v-model="paymentForm.metodoPago" required>
              <option value="">Seleccionar método</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Cuenta por Cobrar Asociada</label>
            <select v-model="paymentForm.cuentaAsociada">
              <option value="">Ninguna</option>
              <option v-for="account in pendingAccounts" :key="account.id" :value="account.id">
                {{ account.concepto }} - ${{ account.monto.toLocaleString() }}
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showCreatePaymentModal = false" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Registrar Pago
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Generate Statement Modal -->
    <div v-if="showGenerateStatementModal" class="modal-overlay" @click="showGenerateStatementModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Generar Estado de Cuenta</h3>
          <button @click="showGenerateStatementModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="generateStatement" class="statement-form">
          <div class="form-group">
            <label>Propiedad</label>
            <select v-model="statementForm.propiedadId" required>
              <option value="">Seleccionar propiedad</option>
              <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                {{ prop.numero }} - {{ prop.nombre }}
              </option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Fecha Desde</label>
              <input v-model="statementForm.fechaDesde" type="date" required>
            </div>
            <div class="form-group">
              <label>Fecha Hasta</label>
              <input v-model="statementForm.fechaHasta" type="date" required>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showGenerateStatementModal = false" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Generar Estado
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanzasView',
  data() {
    return {
      activeTab: 'cuentas',
      tabs: [
        { key: 'cuentas', label: 'Cuentas por Cobrar', icon: 'fas fa-file-invoice-dollar' },
        { key: 'pagos', label: 'Pagos', icon: 'fas fa-money-bill-wave' },
        { key: 'estados', label: 'Estados de Cuenta', icon: 'fas fa-file-alt' }
      ],
      showCreateAccountModal: false,
      showCreatePaymentModal: false,
      showGenerateStatementModal: false,
      accountsFilter: {
        estado: '',
        propiedad: '',
        fechaDesde: '',
        fechaHasta: ''
      },
      accountForm: {
        propiedadId: '',
        concepto: '',
        monto: '',
        fechaEmision: '',
        fechaVencimiento: ''
      },
      paymentForm: {
        propiedadId: '',
        monto: '',
        fechaPago: '',
        metodoPago: '',
        cuentaAsociada: ''
      },
      statementForm: {
        propiedadId: '',
        fechaDesde: '',
        fechaHasta: ''
      },
      properties: [
        { id: 1, numero: '101', nombre: 'Apartamento 101' },
        { id: 2, numero: '102', nombre: 'Apartamento 102' },
        { id: 3, numero: '201', nombre: 'Apartamento 201' }
      ],
      accounts: [
        {
          id: 1,
          propiedad: { id: 1, numero: '101', nombre: 'Apartamento 101' },
          concepto: 'Cuota de Condominio - Enero 2024',
          monto: 150000,
          fechaEmision: new Date('2024-01-01'),
          fechaVencimiento: new Date('2024-01-15'),
          estado: 'pendiente'
        },
        {
          id: 2,
          propiedad: { id: 2, numero: '102', nombre: 'Apartamento 102' },
          concepto: 'Cuota de Condominio - Enero 2024',
          monto: 150000,
          fechaEmision: new Date('2024-01-01'),
          fechaVencimiento: new Date('2024-01-15'),
          estado: 'pagada'
        }
      ],
      payments: [
        {
          id: 1,
          propiedad: { id: 2, numero: '102', nombre: 'Apartamento 102' },
          monto: 150000,
          fechaPago: new Date('2024-01-10'),
          metodoPago: 'transferencia',
          cuentaAsociada: 'Cuota de Condominio - Enero 2024'
        }
      ],
      statements: [
        {
          id: 1,
          propiedad: { id: 1, numero: '101', nombre: 'Apartamento 101' },
          periodo: 'Enero 2024',
          fechaGeneracion: new Date('2024-01-31'),
          total: 150000
        }
      ]
    }
  },
  computed: {
    filteredAccounts() {
      return this.accounts.filter(account => {
        const matchesEstado = !this.accountsFilter.estado || account.estado === this.accountsFilter.estado
        const matchesPropiedad = !this.accountsFilter.propiedad || account.propiedad.id == this.accountsFilter.propiedad
        
        let matchesFecha = true
        if (this.accountsFilter.fechaDesde) {
          matchesFecha = matchesFecha && account.fechaEmision >= new Date(this.accountsFilter.fechaDesde)
        }
        if (this.accountsFilter.fechaHasta) {
          matchesFecha = matchesFecha && account.fechaEmision <= new Date(this.accountsFilter.fechaHasta)
        }
        
        return matchesEstado && matchesPropiedad && matchesFecha
      })
    },
    pendingAccounts() {
      return this.accounts.filter(account => account.estado === 'pendiente')
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-ES')
    },
    getStatusLabel(status) {
      const labels = {
        pendiente: 'Pendiente',
        pagada: 'Pagada',
        vencida: 'Vencida'
      }
      return labels[status] || status
    },
    getPaymentMethodLabel(method) {
      const labels = {
        efectivo: 'Efectivo',
        transferencia: 'Transferencia',
        cheque: 'Cheque',
        tarjeta: 'Tarjeta'
      }
      return labels[method] || method
    },
    markAsPaid(account) {
      if (confirm('¿Marcar esta cuenta como pagada?')) {
        account.estado = 'pagada'
      }
    },
    editAccount(account) {
      // Implementar edición de cuenta
      console.log('Editar cuenta:', account)
    },
    deleteAccount(account) {
      if (confirm('¿Está seguro de eliminar esta cuenta?')) {
        this.accounts = this.accounts.filter(a => a.id !== account.id)
      }
    },
    createAccount() {
      const propiedad = this.properties.find(p => p.id == this.accountForm.propiedadId)
      const newAccount = {
        id: Date.now(),
        propiedad,
        concepto: this.accountForm.concepto,
        monto: parseFloat(this.accountForm.monto),
        fechaEmision: new Date(this.accountForm.fechaEmision),
        fechaVencimiento: new Date(this.accountForm.fechaVencimiento),
        estado: 'pendiente'
      }
      
      this.accounts.push(newAccount)
      this.showCreateAccountModal = false
      this.accountForm = {
        propiedadId: '',
        concepto: '',
        monto: '',
        fechaEmision: '',
        fechaVencimiento: ''
      }
    },
    createPayment() {
      const propiedad = this.properties.find(p => p.id == this.paymentForm.propiedadId)
      const newPayment = {
        id: Date.now(),
        propiedad,
        monto: parseFloat(this.paymentForm.monto),
        fechaPago: new Date(this.paymentForm.fechaPago),
        metodoPago: this.paymentForm.metodoPago,
        cuentaAsociada: this.paymentForm.cuentaAsociada
      }
      
      this.payments.push(newPayment)
      this.showCreatePaymentModal = false
      this.paymentForm = {
        propiedadId: '',
        monto: '',
        fechaPago: '',
        metodoPago: '',
        cuentaAsociada: ''
      }
    },
    generateStatement() {
      const propiedad = this.properties.find(p => p.id == this.statementForm.propiedadId)
      const newStatement = {
        id: Date.now(),
        propiedad,
        periodo: `${this.statementForm.fechaDesde} - ${this.statementForm.fechaHasta}`,
        fechaGeneracion: new Date(),
        total: 150000 // Calcular total real
      }
      
      this.statements.push(newStatement)
      this.showGenerateStatementModal = false
      this.statementForm = {
        propiedadId: '',
        fechaDesde: '',
        fechaHasta: ''
      }
    },
    viewPayment(payment) {
      console.log('Ver pago:', payment)
    },
    viewStatement(statement) {
      console.log('Ver estado:', statement)
    },
    downloadStatement(statement) {
      console.log('Descargar estado:', statement)
    }
  }
}
</script>

<style scoped>
.finanzas-view {
  max-width: 1200px;
  margin: 0 auto;
}

.sub-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #64748b;
}

.tab-btn:hover {
  background: #f1f5f9;
  color: #374151;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.filters-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-select,
.filter-input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.table-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.accounts-table,
.payments-table,
.statements-table {
  width: 100%;
  border-collapse: collapse;
}

.accounts-table th,
.payments-table th,
.statements-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
}

.accounts-table td,
.payments-table td,
.statements-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.property-cell {
  display: flex;
  flex-direction: column;
}

.property-number {
  font-weight: 500;
  color: #1a202c;
}

.property-name {
  font-size: 0.75rem;
  color: #64748b;
}

.amount-cell {
  font-weight: 600;
  color: #059669;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.pendiente {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.pagada {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.vencida {
  background: #fee2e2;
  color: #991b1b;
}

.payment-method {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #e0f2fe;
  color: #0277bd;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-action.view {
  background: #e0f2fe;
  color: #0277bd;
}

.btn-action.edit {
  background: #fff3e0;
  color: #f57c00;
}

.btn-action.delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-action.pay {
  background: #d1fae5;
  color: #065f46;
}

.btn-action.download {
  background: #f3e8ff;
  color: #7c3aed;
}

.btn-action:hover {
  transform: scale(1.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f1f5f9;
}

.account-form,
.payment-form,
.statement-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
}

@media (max-width: 768px) {
  .sub-nav {
    flex-direction: column;
  }
  
  .tab-btn {
    justify-content: flex-start;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filters-row {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .accounts-table,
  .payments-table,
  .statements-table {
    font-size: 0.875rem;
  }
  
  .accounts-table th,
  .accounts-table td,
  .payments-table th,
  .payments-table td,
  .statements-table th,
  .statements-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
