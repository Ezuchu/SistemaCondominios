<template>
  <div class="landing-page">
    <NavbarSection @open-login="openLoginModal" />
    <HeroSection @open-login="openLoginModal" />
    <FeaturesSection />
    <UserTypesSection />
    <CallToActionSection @open-login="openLoginModal" />
    <FooterSection />
    
    <!-- Login Modal -->
    <LoginModal 
      :show="showLoginModal" 
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavbarSection from '@/modules/auth/components/NavbarSection.vue'
import HeroSection from '@/modules/auth/components/HeroSection.vue'
import FeaturesSection from '@/modules/auth/components/FeaturesSection.vue'
import UserTypesSection from '@/modules/auth/components/UserTypesSection.vue'
import CallToActionSection from '@/modules/auth/components/CallToActionSection.vue'
import FooterSection from '@/modules/auth/components/FooterSection.vue'
import LoginModal from '@/modules/auth/components/LoginModal.vue'

const router = useRouter()
const showLoginModal = ref(false)

const openLoginModal = () => {
  showLoginModal.value = true
}

const closeLoginModal = () => {
  showLoginModal.value = false
}

const handleLoginSuccess = (userType) => {
  closeLoginModal()
  router.push(`/${userType}`)
}
</script>

<style scoped lang="scss">
.landing-page {
  min-height: 100vh;
  background: var(--color-fondo);
}
</style>
