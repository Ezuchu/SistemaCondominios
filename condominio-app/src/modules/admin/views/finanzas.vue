<template>
  <div class="finanzas-view">
    <!-- Header -->
    <div class="view-header">
      <div class="header-content">
        <div class="header-left">
          <button @click="$router.go(-1)" class="back-btn">
            <i class="bi bi-arrow-left"></i>
          </button>
          <div class="header-text">
            <h1>Gestión Financiera</h1>
            <p>Administra cuentas por cobrar, pagos y estados de cuenta</p>
          </div>
        </div>
        <button @click="showQuickActionModal = true" class="btn-primary">
          <i class="bi bi-plus-circle"></i>
          Acción Rápida
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-card--primary">
        <div class="stat-content">
          <div class="stat-info">
            <h3 class="stat-title">Cuentas Pendientes</h3>
            <p class="stat-value">{{ pendingAccountsCount }}</p>
          </div>
          <div class="stat-icon">
            <i class="bi bi-file-earmark-text"></i>
          </div>
        </div>
        <div class="stat-footer">
          <small>
            <i class="bi bi-arrow-up-right"></i>
            ${{ totalPendingAmount.toLocaleString() }} pendientes
          </small>
        </div>
      </div>

      <div class="stat-card stat-card--success">
        <div class="stat-content">
          <div class="stat-info">
            <h3 class="stat-title">Pagos del Mes</h3>
            <p class="stat-value">{{ monthlyPaymentsCount }}</p>
          </div>
          <div class="stat-icon">
            <i class="bi bi-cash-coin"></i>
          </div>
        </div>
        <div class="stat-footer">
          <small>
            <i class="bi bi-arrow-up-right"></i>
            ${{ monthlyPaymentsAmount.toLocaleString() }} recaudado
          </small>
        </div>
      </div>

      <div class="stat-card stat-card--warning">
        <div class="stat-content">
          <div class="stat-info">
            <h3 class="stat-title">Cuentas Vencidas</h3>
            <p class="stat-value">{{ overdueAccountsCount }}</p>
          </div>
          <div class="stat-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
        </div>
        <div class="stat-footer">
          <small>
            <i class="bi bi-arrow-down-right"></i>
            ${{ overdueAmount.toLocaleString() }} vencido
          </small>
        </div>
      </div>

      <div class="stat-card stat-card--info">
        <div class="stat-content">
          <div class="stat-info">
            <h3 class="stat-title">Estados Generados</h3>
            <p class="stat-value">{{ statementsCount }}</p>
          </div>
          <div class="stat-icon">
            <i class="bi bi-file-earmark-pdf"></i>
          </div>
        </div>
        <div class="stat-footer">
          <small>
            <i class="bi bi-arrow-up-right"></i>
            Este mes
          </small>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="nav-tabs-container">
      <div class="nav-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="['nav-tab', { active: activeTab === tab.key }]"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-header" @click="showFilters = !showFilters">
        <h3>
          <i class="bi bi-funnel"></i>
          Filtros
        </h3>
        <i :class="['bi', showFilters ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
      </div>
      
      <div class="filters-content" :class="{ show: showFilters }">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Buscar</label>
            <div class="search-input">
              <i class="bi bi-search"></i>
              <input 
                v-model="searchTerm" 
                type="text" 
                placeholder="Buscar por concepto, propiedad..."
              >
              <button v-if="searchTerm" @click="searchTerm = ''" class="clear-search">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>

          <div class="filter-group">
            <label>Estado</label>
            <select v-model="filters.estado" class="filter-select">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
              <option value="vencida">Vencida</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Propiedad</label>
            <select v-model="filters.propiedad" class="filter-select">
              <option value="">Todas las propiedades</option>
              <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                {{ prop.numero }} - {{ prop.nombre }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Fecha Desde</label>
            <input v-model="filters.fechaDesde" type="date" class="filter-input">
          </div>

          <div class="filter-group">
            <label>Fecha Hasta</label>
            <input v-model="filters.fechaHasta" type="date" class="filter-input">
          </div>
        </div>

        <div class="filters-actions">
          <button @click="clearFilters" class="btn-clear">
            <i class="bi bi-arrow-clockwise"></i>
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary">
      <p>
        <strong>{{ filteredData.length }}</strong> 
        {{ activeTab === 'cuentas' ? 'cuentas' : activeTab === 'pagos' ? 'pagos' : 'estados' }} encontrados
      </p>
      
      <!-- View Toggle (Desktop only) -->
      <div class="view-toggle desktop-only">
        <button 
          @click="viewMode = 'table'" 
          :class="['view-btn', { active: viewMode === 'table' }]"
          title="Vista de tabla"
        >
          <i class="bi bi-table"></i>
        </button>
        <button 
          @click="viewMode = 'grid'" 
          :class="['view-btn', { active: viewMode === 'grid' }]"
          title="Vista de tarjetas"
        >
          <i class="bi bi-grid-3x3-gap"></i>
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Cuentas por Cobrar -->
      <div v-if="activeTab === 'cuentas'" class="tab-content">
        <!-- Mobile View -->
        <div class="mobile-view mobile-only">
          <div v-for="account in filteredData" :key="account.id" class="mobile-card">
            <div class="mobile-card-header">
              <div class="property-info">
                <span class="property-number">{{ account.propiedad.numero }}</span>
                <span class="property-name">{{ account.propiedad.nombre }}</span>
              </div>
              <span class="status-badge" :class="account.estado">
                {{ getStatusLabel(account.estado) }}
              </span>
            </div>
            
            <div class="mobile-card-body">
              <div class="info-row">
                <span class="label">Concepto:</span>
                <span class="value">{{ account.concepto }}</span>
              </div>
              <div class="info-row">
                <span class="label">Monto:</span>
                <span class="value amount">${{ account.monto.toLocaleString() }}</span>
              </div>
              <div class="info-row">
                <span class="label">Vencimiento:</span>
                <span class="value">{{ formatDate(account.fechaVencimiento) }}</span>
              </div>
            </div>
            
            <div class="mobile-card-actions">
              <button 
                v-if="account.estado === 'pendiente'"
                @click="markAsPaid(account)" 
                class="action-btn action-btn--success"
              >
                <i class="bi bi-check-circle"></i>
                Marcar Pagada
              </button>
              <button @click="editAccount(account)" class="action-btn action-btn--warning">
                <i class="bi bi-pencil"></i>
                Editar
              </button>
              <button @click="viewAccountDetails(account)" class="action-btn action-btn--info">
                <i class="bi bi-eye"></i>
                Ver
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="desktop-view desktop-only">
          <!-- Table View -->
          <div v-if="viewMode === 'table'" class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Propiedad</th>
                  <th>Concepto</th>
                  <th>Monto</th>
                  <th>Fecha Emisión</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="account in filteredData" :key="account.id">
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
                        class="btn-action btn-action--success" 
                        title="Marcar como pagada"
                      >
                        <i class="bi bi-check-circle"></i>
                      </button>
                      <button @click="editAccount(account)" class="btn-action btn-action--warning" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button @click="viewAccountDetails(account)" class="btn-action btn-action--info" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button @click="deleteAccount(account)" class="btn-action btn-action--danger" title="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid-container">
            <div v-for="account in filteredData" :key="account.id" class="grid-card">
              <div class="grid-card-header">
                <div class="property-info">
                  <span class="property-number">{{ account.propiedad.numero }}</span>
                  <span class="property-name">{{ account.propiedad.nombre }}</span>
                </div>
                <span class="status-badge" :class="account.estado">
                  {{ getStatusLabel(account.estado) }}
                </span>
              </div>
              
              <div class="grid-card-body">
                <h4>{{ account.concepto }}</h4>
                <div class="amount">${{ account.monto.toLocaleString() }}</div>
                <div class="dates">
                  <small>Emisión: {{ formatDate(account.fechaEmision) }}</small>
                  <small>Vencimiento: {{ formatDate(account.fechaVencimiento) }}</small>
                </div>
              </div>
              
              <div class="grid-card-actions">
                <button 
                  v-if="account.estado === 'pendiente'"
                  @click="markAsPaid(account)" 
                  class="btn-action btn-action--success"
                  title="Marcar como pagada"
                >
                  <i class="bi bi-check-circle"></i>
                </button>
                <button @click="editAccount(account)" class="btn-action btn-action--warning" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="viewAccountDetails(account)" class="btn-action btn-action--info" title="Ver detalles">
                  <i class="bi bi-eye"></i>
                </button>
                <button @click="deleteAccount(account)" class="btn-action btn-action--danger" title="Eliminar">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagos -->
      <div v-if="activeTab === 'pagos'" class="tab-content">
        <!-- Mobile View -->
        <div class="mobile-view mobile-only">
          <div v-for="payment in filteredData" :key="payment.id" class="mobile-card">
            <div class="mobile-card-header">
              <div class="property-info">
                <span class="property-number">{{ payment.propiedad.numero }}</span>
                <span class="property-name">{{ payment.propiedad.nombre }}</span>
              </div>
              <span class="payment-method" :class="payment.metodoPago">
                {{ getPaymentMethodLabel(payment.metodoPago) }}
              </span>
            </div>
            
            <div class="mobile-card-body">
              <div class="info-row">
                <span class="label">Monto:</span>
                <span class="value amount">${{ payment.monto.toLocaleString() }}</span>
              </div>
              <div class="info-row">
                <span class="label">Fecha:</span>
                <span class="value">{{ formatDate(payment.fechaPago) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Cuenta Asociada:</span>
                <span class="value">{{ payment.cuentaAsociada || 'N/A' }}</span>
              </div>
            </div>
            
            <div class="mobile-card-actions">
              <button @click="viewPaymentDetails(payment)" class="action-btn action-btn--info">
                <i class="bi bi-eye"></i>
                Ver Detalles
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="desktop-view desktop-only">
          <div class="table-container">
            <table class="data-table">
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
                <tr v-for="payment in filteredData" :key="payment.id">
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
                      <button @click="viewPaymentDetails(payment)" class="btn-action btn-action--info" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Estados de Cuenta -->
      <div v-if="activeTab === 'estados'" class="tab-content">
        <!-- Mobile View -->
        <div class="mobile-view mobile-only">
          <div v-for="statement in filteredData" :key="statement.id" class="mobile-card">
            <div class="mobile-card-header">
              <div class="property-info">
                <span class="property-number">{{ statement.propiedad.numero }}</span>
                <span class="property-name">{{ statement.propiedad.nombre }}</span>
              </div>
            </div>
            
            <div class="mobile-card-body">
              <div class="info-row">
                <span class="label">Período:</span>
                <span class="value">{{ statement.periodo }}</span>
              </div>
              <div class="info-row">
                <span class="label">Total:</span>
                <span class="value amount">${{ statement.total.toLocaleString() }}</span>
              </div>
              <div class="info-row">
                <span class="label">Generado:</span>
                <span class="value">{{ formatDate(statement.fechaGeneracion) }}</span>
              </div>
            </div>
            
            <div class="mobile-card-actions">
              <button @click="viewStatement(statement)" class="action-btn action-btn--info">
                <i class="bi bi-eye"></i>
                Ver
              </button>
              <button @click="downloadStatement(statement)" class="action-btn action-btn--primary">
                <i class="bi bi-download"></i>
                Descargar
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="desktop-view desktop-only">
          <div class="table-container">
            <table class="data-table">
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
                <tr v-for="statement in filteredData" :key="statement.id">
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
                      <button @click="viewStatement(statement)" class="btn-action btn-action--info" title="Ver">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button @click="downloadStatement(statement)" class="btn-action btn-action--primary" title="Descargar PDF">
                        <i class="bi bi-download"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button (Mobile) -->
    <button @click="showCreateModal = true" class="fab mobile-only">
      <i class="bi bi-plus"></i>
    </button>

    <!-- Quick Action Modal -->
    <div v-if="showQuickActionModal" class="modal-overlay" @click="showQuickActionModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Acción Rápida</h3>
          <button @click="showQuickActionModal = false" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="quick-actions">
          <button @click="openCreateAccountModal" class="quick-action-btn">
            <i class="bi bi-file-earmark-plus"></i>
            <span>Nueva Cuenta por Cobrar</span>
          </button>
          <button @click="openCreatePaymentModal" class="quick-action-btn">
            <i class="bi bi-cash-coin"></i>
            <span>Registrar Pago</span>
          </button>
          <button @click="openGenerateStatementModal" class="quick-action-btn">
            <i class="bi bi-file-earmark-pdf"></i>
            <span>Generar Estado de Cuenta</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create Account Modal -->
    <div v-if="showCreateAccountModal" class="modal-overlay" @click="showCreateAccountModal = false">
      <div class="modal-content modal-content--large" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="bi bi-file-earmark-plus"></i>
            Nueva Cuenta por Cobrar
          </h3>
          <button @click="showCreateAccountModal = false" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <form @submit.prevent="createAccount" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label>
                <i class="bi bi-building"></i>
                Propiedad
              </label>
              <select v-model="accountForm.propiedadId" required class="form-input">
                <option value="">Seleccionar propiedad</option>
                <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                  {{ prop.numero }} - {{ prop.nombre }}
                </option>
              </select>
            </div>
            
            <div class="form-group form-group--full">
              <label>
                <i class="bi bi-card-text"></i>
                Concepto
              </label>
              <input v-model="accountForm.concepto" type="text" required class="form-input" placeholder="Descripción del concepto">
            </div>
            
            <div class="form-group">
              <label>
                <i class="bi bi-currency-dollar"></i>
                Monto
              </label>
              <input v-model="accountForm.monto" type="number" step="0.01" required class="form-input" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label>
                <i class="bi bi-calendar"></i>
                Fecha Emisión
              </label>
              <input v-model="accountForm.fechaEmision" type="date" required class="form-input">
            </div>
            
            <div class="form-group form-group--full">
              <label>
                <i class="bi bi-calendar-x"></i>
                Fecha Vencimiento
              </label>
              <input v-model="accountForm.fechaVencimiento" type="date" required class="form-input">
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showCreateAccountModal = false" class="btn-secondary">
              <i class="bi bi-x-circle"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              <i class="bi bi-check-circle"></i>
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Payment Modal -->
    <div v-if="showCreatePaymentModal" class="modal-overlay" @click="showCreatePaymentModal = false">
      <div class="modal-content modal-content--large" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="bi bi-cash-coin"></i>
            Registrar Nuevo Pago
          </h3>
          <button @click="showCreatePaymentModal = false" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <form @submit.prevent="createPayment" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label>
                <i class="bi bi-building"></i>
                Propiedad
              </label>
              <select v-model="paymentForm.propiedadId" required class="form-input">
                <option value="">Seleccionar propiedad</option>
                <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                  {{ prop.numero }} - {{ prop.nombre }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>
                <i class="bi bi-currency-dollar"></i>
                Monto
              </label>
              <input v-model="paymentForm.monto" type="number" step="0.01" required class="form-input" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label>
                <i class="bi bi-calendar"></i>
                Fecha de Pago
              </label>
              <input v-model="paymentForm.fechaPago" type="date" required class="form-input">
            </div>
            
            <div class="form-group">
              <label>
                <i class="bi bi-credit-card"></i>
                Método de Pago
              </label>
              <select v-model="paymentForm.metodoPago" required class="form-input">
                <option value="">Seleccionar método</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="cheque">Cheque</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
            
            <div class="form-group form-group--full">
              <label>
                <i class="bi bi-file-earmark-text"></i>
                Cuenta por Cobrar Asociada
              </label>
              <select v-model="paymentForm.cuentaAsociada" class="form-input">
                <option value="">Ninguna</option>
                <option v-for="account in pendingAccounts" :key="account.id" :value="account.id">
                  {{ account.concepto }} - ${{ account.monto.toLocaleString() }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showCreatePaymentModal = false" class="btn-secondary">
              <i class="bi bi-x-circle"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              <i class="bi bi-check-circle"></i>
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
          <h3>
            <i class="bi bi-file-earmark-pdf"></i>
            Generar Estado de Cuenta
          </h3>
          <button @click="showGenerateStatementModal = false" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <form @submit.prevent="generateStatement" class="modal-form">
          <div class="form-grid">
            <div class="form-group form-group--full">
              <label>
                <i class="bi bi-building"></i>
                Propiedad
              </label>
              <select v-model="statementForm.propiedadId" required class="form-input">
                <option value="">Seleccionar propiedad</option>
                <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                  {{ prop.numero }} - {{ prop.nombre }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>
                <i class="bi bi-calendar"></i>
                Fecha Desde
              </label>
              <input v-model="statementForm.fechaDesde" type="date" required class="form-input">
            </div>
            
            <div class="form-group">
              <label>
                <i class="bi bi-calendar"></i>
                Fecha Hasta
              </label>
              <input v-model="statementForm.fechaHasta" type="date" required class="form-input">
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showGenerateStatementModal = false" class="btn-secondary">
              <i class="bi bi-x-circle"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              <i class="bi bi-file-earmark-pdf"></i>
              Generar Estado
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-content modal-content--large" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="bi bi-info-circle"></i>
            Detalles
          </h3>
          <button @click="showDetailsModal = false" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="details-content">
          <div v-if="selectedItem" class="details-grid">
            <!-- Account Details -->
            <div v-if="activeTab === 'cuentas'" class="detail-section">
              <h4>Información de la Cuenta</h4>
              <div class="detail-item">
                <span class="detail-label">Propiedad:</span>
                <span class="detail-value">{{ selectedItem.propiedad.numero }} - {{ selectedItem.propiedad.nombre }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Concepto:</span>
                <span class="detail-value">{{ selectedItem.concepto }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Monto:</span>
                <span class="detail-value amount">${{ selectedItem.monto.toLocaleString() }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado:</span>
                <span class="status-badge" :class="selectedItem.estado">
                  {{ getStatusLabel(selectedItem.estado) }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fecha de Emisión:</span>
                <span class="detail-value">{{ formatDate(selectedItem.fechaEmision) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fecha de Vencimiento:</span>
                <span class="detail-value">{{ formatDate(selectedItem.fechaVencimiento) }}</span>
              </div>
            </div>

            <!-- Payment Details -->
            <div v-if="activeTab === 'pagos'" class="detail-section">
              <h4>Información del Pago</h4>
              <div class="detail-item">
                <span class="detail-label">Propiedad:</span>
                <span class="detail-value">{{ selectedItem.propiedad.numero }} - {{ selectedItem.propiedad.nombre }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Monto:</span>
                <span class="detail-value amount">${{ selectedItem.monto.toLocaleString() }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fecha de Pago:</span>
                <span class="detail-value">{{ formatDate(selectedItem.fechaPago) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Método de Pago:</span>
                <span class="payment-method" :class="selectedItem.metodoPago">
                  {{ getPaymentMethodLabel(selectedItem.metodoPago) }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Cuenta Asociada:</span>
                <span class="detail-value">{{ selectedItem.cuentaAsociada || 'N/A' }}</span>
              </div>
            </div>

            <!-- Statement Details -->
            <div v-if="activeTab === 'estados'" class="detail-section">
              <h4>Información del Estado de Cuenta</h4>
              <div class="detail-item">
                <span class="detail-label">Propiedad:</span>
                <span class="detail-value">{{ selectedItem.propiedad.numero }} - {{ selectedItem.propiedad.nombre }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Período:</span>
                <span class="detail-value">{{ selectedItem.periodo }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Total:</span>
                <span class="detail-value amount">${{ selectedItem.total.toLocaleString() }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fecha de Generación:</span>
                <span class="detail-value">{{ formatDate(selectedItem.fechaGeneracion) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="showDetailsModal = false" class="btn-secondary">
            <i class="bi bi-x-circle"></i>
            Cerrar
          </button>
        </div>
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
      viewMode: 'table',
      showFilters: false,
      searchTerm: '',
      showQuickActionModal: false,
      showCreateModal: false,
      showCreateAccountModal: false,
      showCreatePaymentModal: false,
      showGenerateStatementModal: false,
      showDetailsModal: false,
      selectedItem: null,
      
      tabs: [
        { key: 'cuentas', label: 'Cuentas por Cobrar', icon: 'bi bi-file-earmark-text' },
        { key: 'pagos', label: 'Pagos', icon: 'bi bi-cash-coin' },
        { key: 'estados', label: 'Estados de Cuenta', icon: 'bi bi-file-earmark-pdf' }
      ],
      
      filters: {
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
        { id: 3, numero: '201', nombre: 'Apartamento 201' },
        { id: 4, numero: '202', nombre: 'Apartamento 202' },
        { id: 5, numero: '301', nombre: 'Apartamento 301' }
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
        },
        {
          id: 3,
          propiedad: { id: 3, numero: '201', nombre: 'Apartamento 201' },
          concepto: 'Cuota de Condominio - Diciembre 2023',
          monto: 150000,
          fechaEmision: new Date('2023-12-01'),
          fechaVencimiento: new Date('2023-12-15'),
          estado: 'vencida'
        },
        {
          id: 4,
          propiedad: { id: 4, numero: '202', nombre: 'Apartamento 202' },
          concepto: 'Fondo de Reserva - Enero 2024',
          monto: 75000,
          fechaEmision: new Date('2024-01-01'),
          fechaVencimiento: new Date('2024-01-31'),
          estado: 'pendiente'
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
        },
        {
          id: 2,
          propiedad: { id: 1, numero: '101', nombre: 'Apartamento 101' },
          monto: 75000,
          fechaPago: new Date('2024-01-05'),
          metodoPago: 'efectivo',
          cuentaAsociada: 'Fondo de Reserva - Diciembre 2023'
        }
      ],
      
      statements: [
        {
          id: 1,
          propiedad: { id: 1, numero: '101', nombre: 'Apartamento 101' },
          periodo: 'Enero 2024',
          fechaGeneracion: new Date('2024-01-31'),
          total: 225000
        },
        {
          id: 2,
          propiedad: { id: 2, numero: '102', nombre: 'Apartamento 102' },
          periodo: 'Enero 2024',
          fechaGeneracion: new Date('2024-01-31'),
          total: 150000
        }
      ]
    }
  },
  
  computed: {
    filteredData() {
      let data = []
      
      if (this.activeTab === 'cuentas') {
        data = this.accounts
      } else if (this.activeTab === 'pagos') {
        data = this.payments
      } else if (this.activeTab === 'estados') {
        data = this.statements
      }
      
      // Apply search filter
      if (this.searchTerm) {
        data = data.filter(item => {
          const searchLower = this.searchTerm.toLowerCase()
          if (this.activeTab === 'cuentas') {
            return item.concepto.toLowerCase().includes(searchLower) ||
                   item.propiedad.numero.toLowerCase().includes(searchLower) ||
                   item.propiedad.nombre.toLowerCase().includes(searchLower)
          } else if (this.activeTab === 'pagos') {
            return item.propiedad.numero.toLowerCase().includes(searchLower) ||
                   item.propiedad.nombre.toLowerCase().includes(searchLower) ||
                   (item.cuentaAsociada && item.cuentaAsociada.toLowerCase().includes(searchLower))
          } else if (this.activeTab === 'estados') {
            return item.propiedad.numero.toLowerCase().includes(searchLower) ||
                   item.propiedad.nombre.toLowerCase().includes(searchLower) ||
                   item.periodo.toLowerCase().includes(searchLower)
          }
          return false
        })
      }
      
      // Apply other filters
      if (this.filters.estado && this.activeTab === 'cuentas') {
        data = data.filter(item => item.estado === this.filters.estado)
      }
      
      if (this.filters.propiedad) {
        data = data.filter(item => item.propiedad.id == this.filters.propiedad)
      }
      
      if (this.filters.fechaDesde) {
        data = data.filter(item => {
          const itemDate = this.activeTab === 'cuentas' ? item.fechaEmision :
                          this.activeTab === 'pagos' ? item.fechaPago :
                          item.fechaGeneracion
          return itemDate >= new Date(this.filters.fechaDesde)
        })
      }
      
      if (this.filters.fechaHasta) {
        data = data.filter(item => {
          const itemDate = this.activeTab === 'cuentas' ? item.fechaEmision :
                          this.activeTab === 'pagos' ? item.fechaPago :
                          item.fechaGeneracion
          return itemDate <= new Date(this.filters.fechaHasta)
        })
      }
      
      return data
    },
    
    pendingAccounts() {
      return this.accounts.filter(account => account.estado === 'pendiente')
    },
    
    pendingAccountsCount() {
      return this.accounts.filter(account => account.estado === 'pendiente').length
    },
    
    totalPendingAmount() {
      return this.accounts
        .filter(account => account.estado === 'pendiente')
        .reduce((sum, account) => sum + account.monto, 0)
    },
    
    monthlyPaymentsCount() {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return this.payments.filter(payment => {
        const paymentDate = new Date(payment.fechaPago)
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
      }).length
    },
    
    monthlyPaymentsAmount() {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return this.payments
        .filter(payment => {
          const paymentDate = new Date(payment.fechaPago)
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
        })
        .reduce((sum, payment) => sum + payment.monto, 0)
    },
    
    overdueAccountsCount() {
      return this.accounts.filter(account => account.estado === 'vencida').length
    },
    
    overdueAmount() {
      return this.accounts
        .filter(account => account.estado === 'vencida')
        .reduce((sum, account) => sum + account.monto, 0)
    },
    
    statementsCount() {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return this.statements.filter(statement => {
        const statementDate = new Date(statement.fechaGeneracion)
        return statementDate.getMonth() === currentMonth && statementDate.getFullYear() === currentYear
      }).length
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
    
    clearFilters() {
      this.searchTerm = ''
      this.filters = {
        estado: '',
        propiedad: '',
        fechaDesde: '',
        fechaHasta: ''
      }
    },
    
    openCreateAccountModal() {
      this.showQuickActionModal = false
      this.showCreateAccountModal = true
    },
    
    openCreatePaymentModal() {
      this.showQuickActionModal = false
      this.showCreatePaymentModal = true
    },
    
    openGenerateStatementModal() {
      this.showQuickActionModal = false
      this.showGenerateStatementModal = true
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
    
    viewAccountDetails(account) {
      this.selectedItem = account
      this.showDetailsModal = true
    },
    
    viewPaymentDetails(payment) {
      this.selectedItem = payment
      this.showDetailsModal = true
    },
    
    viewStatement(statement) {
      this.selectedItem = statement
      this.showDetailsModal = true
    },
    
    downloadStatement(statement) {
      console.log('Descargar estado:', statement)
      // Implementar descarga de PDF
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
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';

.finanzas-view {
  min-height: 100vh;
  background: var(--color-fondo);
  padding-bottom: 2rem;
}

// Header Styles
.view-header {
  background: linear-gradient(135deg, $color-primario 0%, $color-secundario 100%);
  color: white;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }

  i {
    font-size: 1.2rem;
  }
}

.header-text {
  h1 {
    margin: 0;
    font-size: $tamaño-h1;
    font-weight: $peso-h1;
    font-family: $fuente-encabezados;
  }

  p {
    margin: 0.25rem 0 0 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
}

// Stats Grid
.stats-grid {
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}

.stat-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-oscuro);
  opacity: 0.7;
}

.stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primario);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 1.5rem;
  }
}

.stat-card--primary {
  .stat-value { color: $color-primario; }
  .stat-icon {
    background: rgba(26, 84, 184, 0.1);
    color: $color-primario;
  }
  .stat-footer { background: rgba(26, 84, 184, 0.05); }
}

.stat-card--success {
  .stat-value { color: $color-éxito; }
  .stat-icon {
    background: rgba(40, 167, 69, 0.1);
    color: $color-éxito;
  }
  .stat-footer { background: rgba(40, 167, 69, 0.05); }
}

.stat-card--warning {
  .stat-value { color: $color-naranja; }
  .stat-icon {
    background: rgba(255, 168, 1, 0.1);
    color: $color-naranja;
  }
  .stat-footer { background: rgba(255, 168, 1, 0.05); }
}

.stat-card--info {
  .stat-value { color: $color-informativo; }
  .stat-icon {
    background: rgba(0, 89, 255, 0.1);
    color: $color-informativo;
  }
  .stat-footer { background: rgba(0, 89, 255, 0.05); }
}

.stat-footer {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  small {
    color: var(--color-oscuro);
    opacity: 0.7;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

// Navigation Tabs
.nav-tabs-container {
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  padding: 0 1.5rem;
}

.nav-tabs {
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-tab {
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

  &:hover {
    background: #f1f5f9;
    color: #374151;
  }

  &.active {
    background: linear-gradient(135deg, $color-primario 0%, $color-secundario 100%);
    color: white;
  }

  i {
    font-size: 1rem;
  }

  span {
    font-size: 0.9rem;
  }
}

// Filters Section
.filters-section {
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  padding: 0 1.5rem;
}

.filters-header {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-oscuro);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  i {
    color: $color-primario;
    transition: transform 0.3s ease;
  }
}

.filters-content {
  background: white;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #e2e8f0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &.show {
    max-height: 500px;
    padding: 1.5rem;
  }
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;

  i {
    position: absolute;
    left: 0.75rem;
    color: #9ca3af;
    z-index: 1;
  }

  input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $color-primario;
      box-shadow: 0 0 0 3px rgba(26, 84, 184, 0.1);
    }
  }

  .clear-search {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      color: #6b7280;
      background: #f3f4f6;
    }
  }
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: $color-primario;
    box-shadow: 0 0 0 3px rgba(26, 84, 184, 0.1);
  }
}

.filters-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-clear {
  background: #f8fafc;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
}

// Results Summary
.results-summary {
  max-width: 1200px;
  margin: 0 auto 1.5rem auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
}

.view-toggle {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  &.active {
    background: $color-primario;
    color: white;
  }
}

// Content Area
.content-area {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.tab-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

// Mobile View
.mobile-view {
  padding: 1rem;
}

.mobile-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.mobile-card-header {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.property-info {
  display: flex;
  flex-direction: column;
}

.property-number {
  font-weight: 600;
  color: $color-primario;
  font-size: 1rem;
}

.property-name {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.mobile-card-body {
  padding: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

.value {
  font-weight: 500;
  color: #374151;
  text-align: right;

  &.amount {
    color: $color-éxito;
    font-weight: 600;
  }
}

.mobile-card-actions {
  padding: 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 120px;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &.action-btn--success {
    background: rgba(40, 167, 69, 0.1);
    color: $color-éxito;
    &:hover { background: rgba(40, 167, 69, 0.2); }
  }

  &.action-btn--warning {
    background: rgba(255, 168, 1, 0.1);
    color: $color-naranja;
    &:hover { background: rgba(255, 168, 1, 0.2); }
  }

  &.action-btn--info {
    background: rgba(0, 89, 255, 0.1);
    color: $color-informativo;
    &:hover { background: rgba(0, 89, 255, 0.2); }
  }

  &.action-btn--primary {
    background: rgba(26, 84, 184, 0.1);
    color: $color-primario;
    &:hover { background: rgba(26, 84, 184, 0.2); }
  }
}

// Desktop View
.desktop-view {
  min-height: 400px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f8fafc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.875rem;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.875rem;
  }

  tr:hover {
    background: #f8fafc;
  }
}

.property-cell {
  display: flex;
  flex-direction: column;
}

.amount-cell {
  font-weight: 600;
  color: $color-éxito;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;

  &.pendiente {
    background: rgba(255, 168, 1, 0.1);
    color: $color-naranja;
  }

  &.pagada {
    background: rgba(40, 167, 69, 0.1);
    color: $color-éxito;
  }

  &.vencida {
    background: rgba(255, 101, 30, 0.1);
    color: $color-peligro;
  }
}

.payment-method {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(0, 89, 255, 0.1);
  color: $color-informativo;
  text-transform: capitalize;

  &.efectivo {
    background: rgba(40, 167, 69, 0.1);
    color: $color-éxito;
  }

  &.transferencia {
    background: rgba(26, 84, 184, 0.1);
    color: $color-primario;
  }

  &.cheque {
    background: rgba(255, 168, 1, 0.1);
    color: $color-naranja;
  }

  &.tarjeta {
    background: rgba(255, 101, 30, 0.1);
    color: $color-peligro;
  }
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

  &.btn-action--success {
    background: rgba(40, 167, 69, 0.1);
    color: $color-éxito;
    &:hover { 
      background: rgba(40, 167, 69, 0.2);
      transform: scale(1.1);
    }
  }

  &.btn-action--warning {
    background: rgba(255, 168, 1, 0.1);
    color: $color-naranja;
    &:hover { 
      background: rgba(255, 168, 1, 0.2);
      transform: scale(1.1);
    }
  }

  &.btn-action--info {
    background: rgba(0, 89, 255, 0.1);
    color: $color-informativo;
    &:hover { 
      background: rgba(0, 89, 255, 0.2);
      transform: scale(1.1);
    }
  }

  &.btn-action--danger {
    background: rgba(255, 101, 30, 0.1);
    color: $color-peligro;
    &:hover { 
      background: rgba(255, 101, 30, 0.2);
      transform: scale(1.1);
    }
  }

  &.btn-action--primary {
    background: rgba(26, 84, 184, 0.1);
    color: $color-primario;
    &:hover { 
      background: rgba(26, 84, 184, 0.2);
      transform: scale(1.1);
    }
  }
}

// Grid View
.grid-container {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.grid-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
}

.grid-card-header {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid-card-body {
  padding: 1rem;

  h4 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
  }

  .amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-éxito;
    margin-bottom: 0.75rem;
  }

  .dates {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    small {
      color: #6b7280;
      font-size: 0.8rem;
    }
  }
}

.grid-card-actions {
  padding: 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

// Floating Action Button
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, $color-primario 0%, $color-secundario 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(26, 84, 184, 0.3);
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(26, 84, 184, 0.4);
  }

  i {
    font-size: 1.5rem;
  }
}

// Modal Styles
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  &.modal-content--large {
    max-width: 700px;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;

  h3 {
    margin: 0;
    color: #1a202c;
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      color: $color-primario;
    }
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #374151;
  }
}

// Quick Actions
.quick-actions {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-action-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    background: #f8fafc;
    border-color: $color-primario;
    transform: translateY(-2px);
  }

  i {
    font-size: 1.5rem;
    color: $color-primario;
    width: 24px;
    text-align: center;
  }

  span {
    font-weight: 500;
    color: #374151;
  }
}

// Form Styles
.modal-form {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  &.form-group--full {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      color: $color-primario;
      width: 16px;
      text-align: center;
    }
  }
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: $color-primario;
    box-shadow: 0 0 0 3px rgba(26, 84, 184, 0.1);
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
}

// Details Modal
.details-content {
  padding: 1.5rem;
}

.details-grid {
  display: grid;
  gap: 1.5rem;
}

.detail-section {
  h4 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
  color: #374151;
  text-align: right;

  &.amount {
    color: $color-éxito;
    font-weight: 600;
  }
}

// Responsive Design
.mobile-only {
  display: block;
}

.desktop-only {
  display: none;
}

@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }

  .desktop-only {
    display: block;
  }

  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .modal-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 767px) {
  .view-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-left {
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .nav-tabs-container,
  .filters-section,
  .results-summary,
  .content-area {
    padding: 0 1rem;
  }

  .nav-tabs {
    flex-direction: column;
  }

  .nav-tab {
    justify-content: flex-start;
  }

  .results-summary {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-form {
    padding: 1rem;
  }

  .quick-actions {
    padding: 1rem;
  }

  .details-content {
    padding: 1rem;
  }
}
</style>
