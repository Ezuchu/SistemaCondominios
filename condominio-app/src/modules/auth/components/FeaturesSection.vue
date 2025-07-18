<template>
  <section id="caracteristicas" class="features-section">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">
          <i class="bi bi-stars"></i>
          <span>Características Principales</span>
        </div>
        <h2 class="section-title">
          Todo lo que necesitas para gestionar tu condominio
        </h2>
        <p class="section-subtitle">
          Descubre cómo Island Winds revoluciona la administración de condominios 
          con tecnología de vanguardia y funcionalidades intuitivas.
        </p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card main-feature">
          <div class="feature-image">
            <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Comunicación Eficiente">
          </div>
          <div class="feature-content">
            <div class="feature-icon">
              <i class="bi bi-chat-square-dots"></i>
            </div>
            <h3>Comunicación Eficiente</h3>
            <p>
              Mantén a todos los residentes informados con nuestro sistema de comunicación 
              integrado. Avisos, notificaciones y mensajes directos en tiempo real.
            </p>
            <ul class="feature-list">
              <li><i class="bi bi-check-circle"></i> Avisos masivos instantáneos</li>
              <li><i class="bi bi-check-circle"></i> Chat directo con administración</li>
              <li><i class="bi bi-check-circle"></i> Notificaciones push</li>
              <li><i class="bi bi-check-circle"></i> Historial de comunicaciones</li>
            </ul>
          </div>
        </div>
        
        <div class="feature-card">
          <div class="feature-image">
            <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Control Financiero">
          </div>
          <div class="feature-content">
            <div class="feature-icon">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <h3>Control Financiero</h3>
            <p>
              Gestiona las finanzas del condominio con transparencia total. 
              Pagos, gastos comunes y reportes financieros detallados.
            </p>
            <ul class="feature-list">
              <li><i class="bi bi-check-circle"></i> Estados de cuenta digitales</li>
              <li><i class="bi bi-check-circle"></i> Pagos en línea seguros</li>
              <li><i class="bi bi-check-circle"></i> Reportes financieros</li>
            </ul>
          </div>
        </div>
        
        <div class="feature-card">
          <div class="feature-image">
            <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Gestión de Mantenimiento">
          </div>
          <div class="feature-content">
            <div class="feature-icon">
              <i class="bi bi-tools"></i>
            </div>
            <h3>Gestión de Mantenimiento</h3>
            <p>
              Organiza y programa todas las actividades de mantenimiento. 
              Desde reparaciones menores hasta proyectos grandes.
            </p>
            <ul class="feature-list">
              <li><i class="bi bi-check-circle"></i> Calendario de mantenimiento</li>
              <li><i class="bi bi-check-circle"></i> Seguimiento de tareas</li>
              <li><i class="bi bi-check-circle"></i> Gestión de proveedores</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="features-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-speedometer2"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">85%</div>
            <div class="stat-label">Reducción en tiempo administrativo</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-emoji-smile"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">95%</div>
            <div class="stat-label">Satisfacción de usuarios</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="bi bi-shield-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">100%</div>
            <div class="stat-label">Seguridad garantizada</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.features-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-azul-claro), transparent);
  }
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
    
    i {
      font-size: 1.1rem;
    }
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

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.feature-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(18, 77, 181, 0.1);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  
  &.main-feature {
    @media (min-width: 1200px) {
      grid-row: span 2;
    }
    
    .feature-image {
      height: 300px;
      
      @media (min-width: 1200px) {
        height: 400px;
      }
    }
  }
}

.feature-image {
  height: 200px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(18, 77, 181, 0.1) 100%);
  }
}

.feature-card:hover .feature-image img {
  transform: scale(1.05);
}

.feature-content {
  padding: 2rem;
  
  .feature-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    
    i {
      font-size: 1.5rem;
      color: white;
    }
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primario);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--color-oscuro);
    opacity: 0.8;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    color: var(--color-oscuro);
    
    i {
      color: var(--color-éxito);
      font-size: 1.1rem;
    }
  }
}

.features-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(18, 77, 181, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  }
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-amarillo), var(--color-naranja));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  i {
    font-size: 1.5rem;
    color: white;
  }
}

.stat-content {
  .stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-primario);
    line-height: 1;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: var(--color-oscuro);
    opacity: 0.7;
    margin-top: 0.25rem;
  }
}
</style>
