<template>
  <section id="usuarios" class="user-types-section">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">
          <i class="bi bi-people"></i>
          <span>Para Todos los Usuarios</span>
        </div>
        <h2 class="section-title">
          Diseñado para cada tipo de usuario
        </h2>
        <p class="section-subtitle">
          Island Winds se adapta a las necesidades específicas de cada rol en tu condominio, 
          proporcionando herramientas especializadas para una gestión eficiente.
        </p>
      </div>
      
      <div class="user-types-grid">
        <div class="user-type-card admin-card">
          <div class="card-header">
            <div class="user-avatar">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Administrador">
            </div>
            <div class="user-info">
              <h3>Administradores</h3>
              <p>Control total del condominio</p>
            </div>
          </div>
          
          <div class="card-content">
            <div class="features-list">
              <div class="feature-item">
                <i class="bi bi-graph-up"></i>
                <div>
                  <h4>Dashboard Ejecutivo</h4>
                  <p>Métricas y KPIs en tiempo real</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-people-fill"></i>
                <div>
                  <h4>Gestión de Usuarios</h4>
                  <p>Control completo de residentes y personal</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-cash-stack"></i>
                <div>
                  <h4>Finanzas Avanzadas</h4>
                  <p>Reportes financieros y presupuestos</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-gear"></i>
                <div>
                  <h4>Configuración</h4>
                  <p>Personalización completa del sistema</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="user-badge admin-badge">
              <i class="bi bi-shield-check"></i>
              <span>Acceso Completo</span>
            </div>
          </div>
        </div>
        
        <div class="user-type-card operator-card">
          <div class="card-header">
            <div class="user-avatar">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Operador">
            </div>
            <div class="user-info">
              <h3>Operadores</h3>
              <p>Gestión operativa diaria</p>
            </div>
          </div>
          
          <div class="card-content">
            <div class="features-list">
              <div class="feature-item">
                <i class="bi bi-calendar-check"></i>
                <div>
                  <h4>Calendario de Tareas</h4>
                  <p>Programación y seguimiento de actividades</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-tools"></i>
                <div>
                  <h4>Mantenimiento</h4>
                  <p>Gestión de reparaciones y servicios</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-megaphone"></i>
                <div>
                  <h4>Comunicaciones</h4>
                  <p>Envío de avisos y notificaciones</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-clipboard-data"></i>
                <div>
                  <h4>Reportes</h4>
                  <p>Informes de actividades realizadas</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="user-badge operator-badge">
              <i class="bi bi-wrench"></i>
              <span>Gestión Operativa</span>
            </div>
          </div>
        </div>
        
        <div class="user-type-card owner-card">
          <div class="card-header">
            <div class="user-avatar">
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Propietario">
            </div>
            <div class="user-info">
              <h3>Propietarios</h3>
              <p>Acceso a información personal</p>
            </div>
          </div>
          
          <div class="card-content">
            <div class="features-list">
              <div class="feature-item">
                <i class="bi bi-receipt"></i>
                <div>
                  <h4>Estado de Cuenta</h4>
                  <p>Consulta de pagos y deudas</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-credit-card"></i>
                <div>
                  <h4>Pagos en Línea</h4>
                  <p>Pago seguro de gastos comunes</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-bell"></i>
                <div>
                  <h4>Notificaciones</h4>
                  <p>Avisos importantes del condominio</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="bi bi-person-gear"></i>
                <div>
                  <h4>Perfil Personal</h4>
                  <p>Gestión de datos personales</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="user-badge owner-badge">
              <i class="bi bi-house"></i>
              <span>Residente</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cta-section">
        <div class="cta-content">
          <h3>¿Listo para transformar tu condominio?</h3>
          <p>Únete a cientos de condominios que ya confían en Island Winds</p>
          <button class="btn btn-primary btn-lg cta-button" @click="$emit('open-login')">
            <i class="bi bi-rocket-takeoff me-2"></i>
            Comenzar Ahora
          </button>
        </div>
        <div class="cta-image">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Condominio Moderno">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['open-login'])
</script>

<style scoped lang="scss">
.user-types-section {
  padding: 6rem 0;
  background: white;
  position: relative;
}

.section-header {
  margin-bottom: 4rem;
  
  .section-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--color-azul-claro);
    color: var(--color-primario);
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    color: var(--color-primario);
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }
  
  .section-subtitle {
    font-size: 1.2rem;
    color: var(--color-oscuro);
    opacity: 0.8;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.user-types-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.user-type-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(18, 77, 181, 0.1);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  
  &.admin-card {
    border-top: 4px solid var(--color-primario);
  }
  
  &.operator-card {
    border-top: 4px solid var(--color-naranja);
  }
  
  &.owner-card {
    border-top: 4px solid var(--color-éxito);
  }
}

.card-header {
  padding: 2rem 2rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-azul-claro);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.user-info {
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primario);
    margin-bottom: 0.25rem;
  }
  
  p {
    color: var(--color-oscuro);
    opacity: 0.7;
    margin: 0;
  }
}

.card-content {
  padding: 0 2rem 1rem;
}

.features-list {
  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    i {
      font-size: 1.5rem;
      color: var(--color-primario);
      margin-top: 0.25rem;
      flex-shrink: 0;
    }
    
    h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-primario);
      margin-bottom: 0.25rem;
    }
    
    p {
      font-size: 0.9rem;
      color: var(--color-oscuro);
      opacity: 0.7;
      margin: 0;
      line-height: 1.4;
    }
  }
}

.card-footer {
  padding: 1rem 2rem 2rem;
}

.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  
  &.admin-badge {
    background: rgba(18, 77, 181, 0.1);
    color: var(--color-primario);
  }
  
  &.operator-badge {
    background: rgba(255, 168, 1, 0.1);
    color: var(--color-naranja);
  }
  
  &.owner-badge {
    background: rgba(40, 167, 69, 0.1);
    color: var(--color-éxito);
  }
}

.cta-section {
  background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  border-radius: 25px;
  padding: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  color: white;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    padding: 4rem;
  }
}

.cta-content {
  text-align: center;
  
  @media (min-width: 768px) {
    text-align: left;
  }
  
  h3 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 2rem;
  }
}

.cta-button {
  background: var(--color-amarillo);
  border-color: var(--color-amarillo);
  color: var(--color-primario);
  font-weight: 700;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-naranja);
    border-color: var(--color-naranja);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 168, 1, 0.4);
  }
}

.cta-image {
  text-align: center;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  }
}
</style>
