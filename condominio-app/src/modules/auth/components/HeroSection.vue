<template>
  <section id="inicio" class="hero-section">
    <div class="hero-background">
      <div class="hero-overlay">
        <div class="container">
          <div class="row align-items-center min-vh-100">
            <div class="col-lg-6 col-md-12">
              <div class="hero-content">
                <div class="hero-badge">
                  <i class="bi bi-award"></i>
                  <span>Plataforma Líder en Gestión</span>
                </div>
                <h1 class="hero-title">
                  Transforma la gestión de tu 
                  <span class="brand-name">Island Winds Condominio</span>
                </h1>
                <p class="hero-subtitle">
                  Island Winds centraliza y automatiza todos los aspectos administrativos 
                  y operativos de tu condominio. Comunicación eficiente, control financiero 
                  transparente y mantenimiento organizado en una sola plataforma.
                </p>
                <div class="hero-features">
                  <div class="feature-item">
                    <i class="bi bi-shield-check"></i>
                    <span>100% Seguro</span>
                  </div>
                  <div class="feature-item">
                    <i class="bi bi-lightning"></i>
                    <span>Innovador</span>
                  </div>
                  <div class="feature-item">
                    <i class="bi bi-heart-fill"></i>
                    <span>Confiable</span>
                  </div>
                </div>
                <div class="hero-actions">
                  <button class="btn btn-primary btn-lg me-3" @click="$emit('open-login')">
                    <i class="bi bi-rocket-takeoff me-2"></i>
                    Comenzar Ahora
                  </button>
                  <button class="btn btn-outline-light btn-lg" @click="scrollToFeatures">
                    <i class="bi bi-play-circle me-2"></i>
                    Ver Demo
                  </button>
                </div>
                <div class="hero-stats">
                  <div class="stat-item">
                    <div class="stat-number">500+</div>
                    <div class="stat-label">Condominios</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">10K+</div>
                    <div class="stat-label">Usuarios</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">99.9%</div>
                    <div class="stat-label">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-12">
              <div class="hero-image">
                <div class="main-image">
                  <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Condominium" class="img-fluid">
                </div>
                <div class="floating-cards">
                  <div class="floating-card card-1">
                    <i class="bi bi-graph-up"></i>
                    <div class="card-content">
                      <h5>Finanzas</h5>
                      <p>Control total</p>
                    </div>
                  </div>
                  <div class="floating-card card-2">
                    <i class="bi bi-chat-dots"></i>
                    <div class="card-content">
                      <h5>Comunicación</h5>
                      <p>Tiempo real</p>
                    </div>
                  </div>
                  <div class="floating-card card-3">
                    <i class="bi bi-tools"></i>
                    <div class="card-content">
                      <h5>Mantenimiento</h5>
                      <p>Organizado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['open-login'])

const scrollToFeatures = () => {
  const featuresSection = document.getElementById('caracteristicas')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
.hero-section {
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

.hero-background {
  background: linear-gradient(135deg, var(--color-primario) 0%, var(--color-secundario) 50%, var(--color-informativo) 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover;
    opacity: 0.1;
    z-index: 1;
  }
}

.hero-overlay {
  position: relative;
  z-index: 2;
  background: rgba(18, 77, 181, 0.85);
}

.hero-content {
  color: white;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    text-align: center;
    padding: 1rem 0;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 204, 101, 0.2);
  color: var(--color-amarillo);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 204, 101, 0.3);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  
  .brand-name {
    color: var(--color-amarillo);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--color-amarillo);
      border-radius: 2px;
    }
  }
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 600px;
}

.hero-features {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: 1rem;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    
    i {
      font-size: 1.3rem;
      color: var(--color-amarillo);
    }
  }
}

.hero-actions {
  margin-bottom: 3rem;
  
  .btn {
    border-radius: 50px;
    padding: 1rem 2.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    font-size: 1rem;
    
    @media (max-width: 768px) {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
  }
  
  .btn-primary {
    background: linear-gradient(45deg, var(--color-amarillo), var(--color-naranja));
    border: none;
    color: var(--color-primario);
    
    &:hover {
      background: linear-gradient(45deg, var(--color-naranja), #ff4500);
    }
  }
  
  .btn-outline-light {
    border: 2px solid white;
    color: white;
    
    &:hover {
      background: white;
      color: var(--color-primario);
    }
  }
}

.hero-stats {
  display: flex;
  gap: 3rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: 2rem;
  }
  
  .stat-item {
    text-align: center;
    
    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-amarillo);
      line-height: 1;
    }
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-top: 0.25rem;
    }
  }
}

.hero-image {
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    height: 400px;
    margin-top: 2rem;
  }
}

.main-image {
  position: relative;
  z-index: 2;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.3);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.floating-cards {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  
  i {
    font-size: 2rem;
    color: var(--color-primario);
  }
  
  .card-content {
    h5 {
      margin: 0;
      color: var(--color-primario);
      font-weight: 700;
      font-size: 1rem;
    }
    
    p {
      margin: 0;
      color: var(--color-oscuro);
      opacity: 0.7;
      font-size: 0.85rem;
    }
  }
  
  &.card-1 {
    top: 10%;
    right: -10%;
    animation: float 6s ease-in-out infinite;
  }
  
  &.card-2 {
    top: 50%;
    left: -15%;
    animation: float 6s ease-in-out infinite 2s;
  }
  
  &.card-3 {
    bottom: 15%;
    right: -5%;
    animation: float 6s ease-in-out infinite 4s;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    &.card-1 {
      top: 5%;
      right: -5%;
    }
    
    &.card-2 {
      top: 45%;
      left: -10%;
    }
    
    &.card-3 {
      bottom: 10%;
      right: 0%;
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
}
</style>
