<template>
  <div class="register-container">
    <h2 class="form-title">Create your {{ capitalize(role) }} account</h2>
    
    <auth-form
      submit-text="Register"
      :loading="loading"
      @submit="handleFormSubmit"
    >
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Your full name"
          class="form-control"
        >
      </div>
      
      <div v-if="role === 'student'" class="form-group">
        <label for="studentId">Student ID</label>
        <input
          id="studentId"
          v-model="form.studentId"
          type="text"
          required
          placeholder="Enter your student ID"
          class="form-control"
        >
      </div>
      
      <div v-if="role === 'teacher'" class="form-group">
        <label for="subject">Subject</label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          required
          placeholder="What do you teach?"
          class="form-control"
        >
      </div>
      
      <div class="form-group">
        <div class="checkbox-group">
          <input type="checkbox" id="terms" v-model="form.acceptedTerms" required>
          <label for="terms">I agree to the <a href="#" @click.prevent="showTerms">Terms of Service</a> and <a href="#" @click.prevent="showPrivacy">Privacy Policy</a></label>
        </div>
      </div>
    </auth-form>
    
    <div class="auth-footer">
      <p>Already have an account? <router-link to="/auth/login">Login</router-link></p>
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
      form: {
        email: '',
        password: '',
        name: '',
        studentId: '',
        subject: '',
        acceptedTerms: false
      }
    }
  },
  methods: {
    async handleFormSubmit(formData) {
      if (!this.form.acceptedTerms) {
        alert("You must accept the terms to register");
        return;
      }
      
      this.loading = true;
      
      try {
        // Combine the auth form data (email/password) with our local form data
        const userData = {
          ...formData,
          name: this.form.name,
          studentId: this.role === 'student' ? this.form.studentId : undefined,
          subject: this.role === 'teacher' ? this.form.subject : undefined,
          role: this.role
        };
        
        // Mock registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Auto-login after registration
        await this.$store.dispatch('auth/login', userData);
        
        const redirectPath = this.role === 'student'
          ? '/student/dashboard'
          : '/teacher/dashboard';
          
        this.$router.push(redirectPath);
      } catch (error) {
        console.error('Registration error:', error);
        // Show error to user
      } finally {
        this.loading = false;
      }
    },
    
    showTerms() {
      alert("Terms of Service would open here");
    },
    
    showPrivacy() {
      alert("Privacy Policy would open here");
    },
    
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
}
</script>

<style scoped>
.register-container {
  width: 100%;
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
}

.checkbox-group input {
  margin-right: 10px;
  margin-top: 3px;
}

.checkbox-group label {
  font-size: 0.9rem;
  line-height: 1.4;
}

.checkbox-group a {
  color: #3f51b5;
  text-decoration: none;
}

.checkbox-group a:hover {
  text-decoration: underline;
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

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}
</style>