<template>
  <div class="add-student-form">
    <h2>Add Student to Class</h2>
    
    <div class="form-grid">
      <div class="form-group">
        <label>Class</label>
        <select v-model="formData.classId">
          <option v-for="cls in teacher.classes" :key="cls.id" :value="cls.id">
            {{ cls.name }} ({{ cls.schedule }})
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Student ID</label>
        <input type="text" v-model="formData.studentId" placeholder="STU2023001">
      </div>
      
      <div class="form-group">
        <label>First Name</label>
        <input type="text" v-model="formData.firstName">
      </div>
      
      <div class="form-group">
        <label>Last Name</label>
        <input type="text" v-model="formData.lastName">
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="formData.email">
      </div>
      
      <div class="form-group">
        <label>Date of Birth</label>
        <input type="date" v-model="formData.dob">
      </div>
    </div>
    
    <div class="actions">
      <button class="btn-submit" @click="submitForm">Add Student</button>
      <button class="btn-cancel" @click="resetForm">Reset</button>
    </div>
    
    <div class="success-message" v-if="successMessage">
      {{ successMessage }}
    </div>
    
    <div class="error-message" v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  classId: '',
  studentId: '',
  firstName: '',
  lastName: '',
  email: '',
  dob: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const submitForm = () => {
  // Basic validation
  if (!formData.value.classId) {
    errorMessage.value = 'Please select a class'
    return
  }
  
  if (!formData.value.studentId || !formData.value.firstName || !formData.value.lastName) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }
  
  console.log('Form data to submit:', formData.value)
  
  /*
  // API Integration Example (commented out)
  try {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value)
    })
    
    if (!response.ok) throw new Error('Failed to add student')
    
    const result = await response.json()
    successMessage.value = `Student ${result.name} added successfully to class ${result.className}`
    resetForm()
    errorMessage.value = ''
  } catch (error) {
    console.error('Error adding student:', error)
    errorMessage.value = 'Failed to add student: ' + error.message
    successMessage.value = ''
  }
  */
  
  // For demo purposes
  successMessage.value = `Student ${formData.value.firstName} ${formData.value.lastName} added successfully!`
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
  resetForm()
}

const resetForm = () => {
  formData.value = {
    classId: '',
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: ''
  }
  errorMessage.value = ''
}
</script>

<style scoped>
.add-student-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 1.5rem;
  color: #3a4a6b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group select,
.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-submit {
  padding: 0.75rem 2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-cancel {
  padding: 0.75rem 2rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #E8F5E9;
  color: #4CAF50;
  border-radius: 4px;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #FFEBEE;
  color: #F44336;
  border-radius: 4px;
}
</style>