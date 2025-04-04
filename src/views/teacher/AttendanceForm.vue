<template>
  <div class="attendance-form">
    <div class="header">
      <h2>Take Attendance</h2>
      <div class="class-selector">
        <select v-model="selectedClass">
          <option value="" disabled>Select a class</option>
          <option v-for="cls in teacher.classes" :key="cls.id" :value="cls.id">
            {{ cls.name }} ({{ cls.schedule }})
          </option>
        </select>
        <input type="date" v-model="attendanceDate">
      </div>
    </div>
    
    <div class="student-list">
      <div 
        class="student-card" 
        v-for="student in classStudents" 
        :key="student.id"
      >
        <div class="student-info">
          <span class="avatar">{{ getInitials(student.name) }}</span>
          <div>
            <h4>{{ student.name }}</h4>
            <p class="text-muted">{{ student.id }}</p>
          </div>
        </div>
        <div class="attendance-status">
          <button 
            @click="markAttendance(student.id, 'present')"
            :class="{ active: student.attendance === 'present' }"
          >
            Present
          </button>
          <button 
            @click="markAttendance(student.id, 'absent')"
            :class="{ active: student.attendance === 'absent' }"
          >
            Absent
          </button>
          <input 
            v-if="student.attendance === 'absent'"
            type="text" 
            v-model="student.absenceReason"
            placeholder="Reason (optional)"
            @keydown.enter="saveAttendance"
          >
        </div>
      </div>
    </div>
    
    <div class="actions">
      <button 
        class="btn-save" 
        @click="saveAttendance"
        :disabled="isSaving || !selectedClass"
      >
        <span v-if="isSaving">Saving...</span>
        <span v-else>Save Attendance</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue' // Removed unused computed import

// Reactive data
const selectedClass = ref('')
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const isSaving = ref(false)

// Dummy data - replace with API calls later
const teacher = ref({
  classes: [
    { id: 'class1', name: 'Mathematics 101', schedule: 'Mon/Wed 9:00 AM' },
    { id: 'class2', name: 'Science 201', schedule: 'Tue/Thu 11:00 AM' }
  ]
})

const classStudents = ref([
  { id: 'STU2023001', name: 'Alex Johnson', attendance: '', absenceReason: '' },
  { id: 'STU2023002', name: 'Maria Garcia', attendance: '', absenceReason: '' },
  { id: 'STU2023003', name: 'James Smith', attendance: '', absenceReason: '' },
  { id: 'STU2023004', name: 'Sarah Williams', attendance: '', absenceReason: '' }
])

// Methods
const getInitials = (name) => {
  return name.split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
}

const markAttendance = (studentId, status) => {
  const student = classStudents.value.find(s => s.id === studentId)
  if (student) {
    student.attendance = status
    if (status !== 'absent') {
      student.absenceReason = ''
    }
  }
}

const saveAttendance = async () => {
  if (!selectedClass.value) {
    alert('Please select a class first')
    return
  }

  isSaving.value = true

  const attendanceData = {
    classId: selectedClass.value,
    date: attendanceDate.value,
    records: classStudents.value.map(student => ({
      studentId: student.id,
      status: student.attendance || 'absent', // Default to absent if not marked
      reason: student.absenceReason || null
    }))
  }
  
  try {
    console.log('Attendance data to save:', attendanceData)
    
    /*
    // Actual API Integration (commented out)
    const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendanceData)
    })
    
    if (!response.ok) throw new Error('Failed to save attendance')
    
    alert('Attendance saved successfully!')
    */
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Attendance saved successfully! (simulated)')
    
  } catch (error) {
    console.error('Error saving attendance:', error)
    alert('Failed to save attendance: ' + error.message)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.attendance-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.class-selector {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.class-selector select, 
.class-selector input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  min-width: 200px;
}

.class-selector select:disabled {
  opacity: 0.7;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.student-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
  transition: all 0.2s;
}

.student-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3a4a6b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.text-muted {
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.attendance-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.attendance-status button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.attendance-status button.active {
  color: white;
  border-color: transparent;
}

.attendance-status button:first-child {
  border-color: #4CAF50;
  color: #4CAF50;
}

.attendance-status button:first-child.active {
  background: #4CAF50;
}

.attendance-status button:last-child {
  border-color: #F44336;
  color: #F44336;
}

.attendance-status button:last-child.active {
  background: #F44336;
}

.attendance-status input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  max-width: 100%;
}

.actions {
  margin-top: 2rem;
  text-align: right;
}

.btn-save {
  padding: 0.75rem 2rem;
  background: #3a4a6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
  min-width: 150px;
}

.btn-save:hover:not(:disabled) {
  background: #2c3e50;
}

.btn-save:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .student-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .attendance-status {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>