<template>
  <div :class="['sidemenu', { collapsed: !isOpen }]">
   
    <button class="icon" @click="toggleMenu">
      <i class="fas fa-bars"></i>
    </button>

    <div class="p-3" v-if="isOpen">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Dashboard</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Propietario</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Pagos</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Cuentas</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Mantenimiento</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Avisos</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Estados de cuenta</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: true
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/variables';
.sidemenu {
  background-color: $color-primario;
  min-height: 100vh;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  position: fixed;
  width: 250px;
  transition: all 0.3s;
  z-index: 1000;

  &.collapsed {
    width: 0px;
    .p-3 {
      display: none;
    }
  }
}

.icon {
  background: $color-naranja;
  border: none;
  color: $color-fondo;
  font-size: 1.5rem;
  margin: 10px;
  cursor: pointer;
}

.nav-link {
  color: $color-fondo;
  font-weight: bold;
  padding: 10px 15px;
  transition: background-color 0.3s;

  &:hover {
    background-color: $color-fondo;
    color: $color-primario;
  }
}
</style>