<template>
  <section class="cta-section">
    <div class="container">
      <div class="cta-content">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="cta-text">
              <h2 class="cta-title">
                ¿Listo para revolucionar la gestión de tu condominio?
              </h2>
              <p class="cta-subtitle">
                Únete a más de 500 condominios que ya confían en Island Winds para 
                simplificar su administración y mejorar la experiencia de sus residentes.
              </p>
              <div class="cta-features">
                <div class="cta-feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Implementación en 24 horas</span>
                </div>
                <div class="cta-feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Soporte técnico 24/7</span>
                </div>
                <div class="cta-feature">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Capacitación incluida</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="cta-actions">
              <button class="btn btn-primary btn-lg cta-button" @click="$emit('open-login')">
                <i class="bi bi-rocket-takeoff me-2"></i>
                Comenzar Ahora
              </button>
              <p class="cta-note">
                <i class="bi bi-shield-check me-1"></i>
                Sin compromisos • Prueba gratuita
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['open-login'])
</script>

<style scoped lang="scss">
.cta-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--color-primario) 0%, var(--color-secundario) 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover;
    opacity: 0.1;
    animation: float 20s ease-in-out infinite;
  }
}

.cta-content {
  position: relative;
  z-index: 2;
  color: white;
}

.cta-text {
  @media (max-width: 991px) {
    text-align: center;
    margin-bottom: 2rem;
  }
}

.cta-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--color-fondo);
  

}

.cta-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
  
  @media (max-width: 991px) {
    justify-content: center;
  }
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  i {
    color: var(--color-amarillo);
    font-size: 1.1rem;
  }
}

.cta-actions {
  text-align: center;
  
  @media (min-width: 992px) {
    text-align: right;
  }
}

.cta-button {
  background: var(--color-amarillo);
  border-color: var(--color-amarillo);
  color: var(--color-primario);
  font-weight: 700;
  padding: 1.25rem 3rem;
  border-radius: 50px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    background: var(--color-naranja);
    border-color: var(--color-naranja);
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 168, 1, 0.4);
  }
}

.cta-note {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
  
  i {
    color: var(--color-amarillo);
  }
}

@keyframes float {
  0%, 100% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(10px) translateY(-10px); }
  50% { transform: translateX(-5px) translateY(5px); }
  75% { transform: translateX(-10px) translateY(-5px); }
}
</style>
