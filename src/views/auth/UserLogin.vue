<template>
  <div class="login-container">
    <h2 class="form-title">Log in to your {{ capitalize(role) }} account</h2>
    
    <auth-form
      submit-text="Login"
      :loading="loading"
      @submit="handleLogin"
    >
      <div class="form-options">
        <div class="remember-me">
          <input type="checkbox" id="remember" v-model="rememberMe">
          <label for="remember">Remember me</label>
        </div>
        <router-link to="/auth/reset-password" class="forgot-password">
          Forgot password?
        </router-link>
      </div>
      
      <div class="divider">
        <span>or</span>
      </div>
      
      <div class="social-login">
        <button type="button" class="social-button google">
          <img src="@/assets/google.jpg" alt="Google" class="social-icon">
          Continue with Google
        </button>
      </div>
    </auth-form>
    
    <div class="auth-footer">
      <p>Don't have an account? <router-link to="/auth/register">Register</router-link></p>
    </div>
  </div>
</template>

<script>
import AuthForm from '@/components/auth/AuthForm.vue'

export default {
  components: { AuthForm },
  props: {
    role: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      rememberMe: false
    }
  },
  methods: {
    async handleLogin(credentials) {
      this.loading = true
      try {
        // Will connect to backend later
        const userData = {
          ...credentials,
          role: this.role,
          name: this.role === 'student' ? 'Demo Student' : 'Demo Teacher'
        }
        
        await this.$store.dispatch('auth/login', userData)
        
        const redirectPath = this.role === 'student'
          ? '/student/dashboard'
          : '/teacher/dashboard'
        
        this.$router.push(redirectPath)
      } catch (error) {
        console.error('Login error:', error)
        // Show error to user
      } finally {
        this.loading = false
      }
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 0.5rem;
}

.forgot-password {
  color: #3f51b5;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #eee;
}

.divider span {
  position: relative;
  background-color: white;
  padding: 0 1rem;
  color: #888;
  font-size: 0.9rem;
}

.social-login {
  margin-bottom: 1rem;
}

.social-button {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.social-button:hover {
  background-color: #f5f5f5;
}

.social-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #3f51b5;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>