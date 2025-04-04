<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="logo">EduDash</h1>
        <p class="tagline">Learning Management System</p>
      </div>
      
      <div class="auth-content">
        <role-toggle v-model="role" />
        <router-view :role="role" />
      </div>
      
      <div class="auth-footer">
        <p>© {{ currentYear }} EduDash. All rights reserved.</p>
      </div>
    </div>
    
    <div class="auth-decoration">
      <div class="auth-illustration">
        <img src="@/assets/education-illustration.jpg" alt="Education" v-if="illustrationLoaded" />
        <div class="illustration-placeholder" v-else></div>
      </div>
      <div class="auth-decoration-text">
        <h2>Welcome to EduDash</h2>
        <p>The modern learning management system for students and teachers</p>
      </div>
    </div>
  </div>
</template>

<script>
import RoleToggle from '@/components/auth/RoleToggle.vue'

export default {
  components: { RoleToggle },
  data() {
    return {
      role: 'teacher',
      illustrationLoaded: false,
      currentYear: new Date().getFullYear()
    }
  },
  mounted() {
    // Simulate image loading
    setTimeout(() => {
      this.illustrationLoaded = true
    }, 300)
  }
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-container {
  width: 100%;
  max-width: 480px;
  padding: 3rem;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3f51b5;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.tagline {
  color: #666;
  margin: 0;
  font-size: 1.1rem;
}

.auth-content {
  flex: 1;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  color: #999;
  font-size: 0.85rem;
}

.auth-decoration {
  flex: 1;
  background-color: #3f51b5;
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: none; /* Hidden on mobile */
}

.auth-illustration {
  margin-bottom: 2rem;
  width: 100%;
  max-width: 400px;
}

.auth-illustration img {
  width: 100%;
  height: auto;
  animation: float 6s ease-in-out infinite;
}

.illustration-placeholder {
  width: 100%;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.auth-decoration-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.auth-decoration-text p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 400px;
  margin: 0 auto;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

/* Media query for larger screens */
@media screen and (min-width: 1024px) {
  .auth-decoration {
    display: flex;
  }
}
</style>