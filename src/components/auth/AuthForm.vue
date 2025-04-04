<template>
  <form @submit.prevent="submitForm" class="auth-form">
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        placeholder="Enter your email"
        class="form-control"
      >
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <div class="password-field">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          required
          placeholder="Enter your password"
          class="form-control"
        >
        <button 
          type="button" 
          @click="showPassword = !showPassword" 
          class="password-toggle"
        >
          {{ showPassword ? 'Hide' : 'Show' }}
        </button>
      </div>
    </div>
    
    <!-- Slot for additional form fields -->
    <slot></slot>
    
    <div class="form-actions">
      <button 
        type="submit" 
        class="submit-button" 
        :disabled="loading"
      >
        <span v-if="loading" class="loader"></span>
        {{ submitText }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    submitText: {
      type: String,
      default: 'Submit'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style scoped>
.auth-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  border-color: #3f51b5;
  outline: none;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.8rem;
}

.form-actions {
  margin-top: 2rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.submit-button:hover {
  background-color: #303f9f;
}

.submit-button:disabled {
  background-color: #9fa8da;
  cursor: not-allowed;
}

.loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  margin-top: 1.5rem;
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