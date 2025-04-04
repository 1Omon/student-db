<template>
  <div class="role-toggle">
    <button 
      @click="setRole('student')" 
      class="role-button" 
      :class="{ active: modelValue === 'student' }"
    >
      <div class="role-icon">👨‍🎓</div>
      <span>Student</span>
    </button>
    <button 
      @click="setRole('teacher')" 
      class="role-button" 
      :class="{ active: modelValue === 'teacher' }"
    >
      <div class="role-icon">👨‍🏫</div>
      <span>Teacher</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  methods: {
    setRole(role) {
      this.$emit('update:modelValue', role)
    }
  }
}
</script>

<style scoped>
.role-toggle {
  display: flex;
  margin-bottom: 2rem;
  gap: 0.5rem;
  background-color: #f5f7fa;
  padding: 0.5rem;
  border-radius: 8px;
}

.role-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-button.active {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.role-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.role-button span {
  font-weight: 500;
  color: #333;
}

.role-button:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>