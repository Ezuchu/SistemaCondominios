<template>
  <nav class="sidebar bg-light p-3">
    <ul class="nav flex-column">
      <li class="nav-item"><router-link to="/propietario" class="nav-link">Inicio</router-link></li>
      <li class="nav-item"><router-link to="/propietario/pagos" class="nav-link">Mis Pagos</router-link></li>
      <li class="nav-item"><router-link to="/propietario/estados-cuenta" class="nav-link">Mis Estados de Cuenta</router-link></li>
      <li class="nav-item"><router-link to="/propietario/avisos" class="nav-link">Avisos</router-link></li>
      <li class="nav-item"><router-link to="/propietario/perfil" class="nav-link">Mi Perfil</router-link></li>
      <li class="nav-item"><router-link to="/" class="nav-link text-danger">Cerrar Sesión</router-link></li>
    </ul>
  </nav>
</template>