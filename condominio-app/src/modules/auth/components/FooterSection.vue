<template>
  <footer class="footer-section">
    <div class="container">
      <div class="footer-content">
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="footer-brand">
              <div class="brand-logo">
                <img src="/src/assets/Logo.png" alt="Island Winds" class="footer-logo">
                <span class="brand-name">Island Winds</span>
              </div>
              <p class="brand-description">
                La plataforma líder en gestión de condominios que transforma 
                la administración con tecnología innovadora y segura.
              </p>
              <div class="social-links">
                <a href="#" class="social-link">
                  <i class="bi bi-facebook"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="bi bi-twitter"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="bi bi-linkedin"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div class="col-lg-2 col-md-6 mb-4">
            <div class="footer-links">
              <h5 class="footer-title">Producto</h5>
              <ul class="links-list">
                <li><a href="#caracteristicas">Características</a></li>
                <li><a href="#usuarios">Usuarios</a></li>
                <li><a href="#">Precios</a></li>
                <li><a href="#">Integraciones</a></li>
              </ul>
            </div>
          </div>
          
          <div class="col-lg-2 col-md-6 mb-4">
            <div class="footer-links">
              <h5 class="footer-title">Empresa</h5>
              <ul class="links-list">
                <li><a href="#">Acerca de</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Carreras</a></li>
                <li><a href="#">Prensa</a></li>
              </ul>
            </div>
          </div>
          
          <div class="col-lg-2 col-md-6 mb-4">
            <div class="footer-links">
              <h5 class="footer-title">Soporte</h5>
              <ul class="links-list">
                <li><a href="#">Centro de Ayuda</a></li>
                <li><a href="#">Documentación</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Estado</a></li>
              </ul>
            </div>
          </div>
          
          <div class="col-lg-2 col-md-6 mb-4">
            <div class="footer-links">
              <h5 class="footer-title">Legal</h5>
              <ul class="links-list">
                <li><a href="#">Privacidad</a></li>
                <li><a href="#">Términos</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">Licencias</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="copyright">
              © 2024 Islands Winds. Todos los derechos reservados por Wilmer.
            </p>
          </div>
          <div class="col-md-6">
            <div class="footer-badges">
              <div class="security-badge">
                <i class="bi bi-shield-check"></i>
                <span>SSL Seguro</span>
              </div>
              <div class="security-badge">
                <i class="bi bi-award"></i>
                <span>ISO 27003</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer-section {
  background: linear-gradient(180deg, #1a1a1a 0%, #0d1117 100%);
  color: white;
  padding: 4rem 0 0;
}

.footer-content {
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand {
  .brand-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    
    .footer-logo {
      height: 40px;
      width: auto;
      filter: brightness(0) invert(1);
    }
    
    .brand-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }
  }
  
  .brand-description {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-primario);
    transform: translateY(-2px);
    color: white;
  }
  
  i {
    font-size: 1.1rem;
  }
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.75rem;
    
    a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.3s ease;
      
      &:hover {
        color: var(--color-amarillo);
      }
    }
  }
}

.footer-bottom {
  padding: 2rem 0;
  
  @media (max-width: 767px) {
    text-align: center;
    
    .footer-badges {
      margin-top: 1rem;
      justify-content: center;
    }
  }
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-size: 0.9rem;
}

.footer-badges {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 767px) {
    justify-content: center;
  }
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  
  i {
    color: var(--color-éxito);
  }
}
</style>
