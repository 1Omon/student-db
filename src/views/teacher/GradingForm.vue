<template>
  <div class="grading-form">
    <div class="header">
      <h2>Grade Students</h2>
      <div class="assignment-selector">
        <select v-model="selectedClass">
          <option v-for="cls in teacher.classes" :key="cls.id" :value="cls.id">
            {{ cls.name }}
          </option>
        </select>
        <select v-model="selectedAssignment">
          <option v-for="assignment in assignments" :key="assignment.id" :value="assignment.id">
            {{ assignment.name }}
          </option>
        </select>
        <button @click="showNewAssignmentForm = true">+ New Assignment</button>
      </div>
    </div>
    
    <div class="new-assignment-form" v-if="showNewAssignmentForm">
      <h3>Create New Assignment</h3>
      <div class="form-group">
        <label>Assignment Name</label>
        <input type="text" v-model="newAssignment.name">
      </div>
      <div class="form-group">
        <label>Total Points</label>
        <input type="number" v-model="newAssignment.totalPoints">
      </div>
      <div class="form-group">
        <label>Due Date</label>
        <input type="date" v-model="newAssignment.dueDate">
      </div>
      <div class="actions">
        <button @click="createAssignment">Create</button>
        <button @click="showNewAssignmentForm = false">Cancel</button>
      </div>
    </div>
    
    <div class="student-grades">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>ID</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Feedback</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in classStudents" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.id }}</td>
            <td>
              <input type="number" v-model="student.grade.score" 
                :max="selectedAssignmentObj?.totalPoints || 100">
              / {{ selectedAssignmentObj?.totalPoints || 100 }}
            </td>
            <td>{{ calculateGrade(student.grade.score) }}</td>
            <td>
              <input type="text" v-model="student.grade.feedback" 
                placeholder="Optional feedback">
            </td>
            <td>
              <button @click="saveGrade(student)">Save</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="actions">
      <button class="btn-save-all" @click="saveAllGrades">Save All Grades</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedClass = ref('')
const selectedAssignment = ref('')
const showNewAssignmentForm = ref(false)

// Dummy data - replace with API calls later
const assignments = ref([
  { id: 'ASG001', name: 'Midterm Exam', totalPoints: 100, dueDate: '2023-11-15' },
  { id: 'ASG002', name: 'Final Project', totalPoints: 150, dueDate: '2023-12-20' }
])

const newAssignment = ref({
  name: '',
  totalPoints: 100,
  dueDate: ''
})

const classStudents = ref([
  { id: 'STU2023001', name: 'Alex Johnson', grade: { score: '', feedback: '' } },
  { id: 'STU2023002', name: 'Maria Garcia', grade: { score: '', feedback: '' } },
  { id: 'STU2023003', name: 'James Smith', grade: { score: '', feedback: '' } },
  { id: 'STU2023004', name: 'Sarah Williams', grade: { score: '', feedback: '' } }
])

const selectedAssignmentObj = computed(() => {
  return assignments.value.find(a => a.id === selectedAssignment.value)
})

const calculateGrade = (score) => {
  if (!score) return '--'
  const percentage = (score / (selectedAssignmentObj.value?.totalPoints || 100)) * 100
  
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

const createAssignment = () => {
  const newId = 'ASG' + (assignments.value.length + 1).toString().padStart(3, '0')
  assignments.value.push({
    id: newId,
    ...newAssignment.value
  })
  selectedAssignment.value = newId
  showNewAssignmentForm.value = false
  newAssignment.value = { name: '', totalPoints: 100, dueDate: '' }
}

const saveGrade = (student) => {
  const gradeData = {
    studentId: student.id,
    assignmentId: selectedAssignment.value,
    score: student.grade.score,
    feedback: student.grade.feedback,
    grade: calculateGrade(student.grade.score)
  }
  
  console.log('Grade data to save:', gradeData)
  
  /*
  // API Integration Example (commented out)
  try {
    const response = await fetch('/api/grades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gradeData)
    })
    
    if (!response.ok) throw new Error('Failed to save grade')
    
    alert('Grade saved successfully!')
  } catch (error) {
    console.error('Error saving grade:', error)
    alert('Failed to save grade')
  }
  */
}

const saveAllGrades = () => {
  classStudents.value.forEach(student => {
    if (student.grade.score !== '') {
      saveGrade(student)
    }
  })
}
</script>

<style scoped>
.grading-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.assignment-selector {
  display: flex;
  gap: 1rem;
}

.assignment-selector select, 
.assignment-selector button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.assignment-selector button {
  background: #3a4a6b;
  color: white;
  border: none;
  cursor: pointer;
}

.new-assignment-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:first-child {
  background: #4CAF50;
  color: white;
}

.actions button:last-child {
  background: #F44336;
  color: white;
}

.student-grades table {
  width: 100%;
  border-collapse: collapse;
}

.student-grades th, 
.student-grades td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.student-grades th {
  background: #f8f9fa;
  font-weight: 500;
}

.student-grades input[type="number"] {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.student-grades input[type="text"] {
  width: 200px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.student-grades button {
  padding: 0.5rem 1rem;
  background: #3a4a6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save-all {
  padding: 0.75rem 2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  float: right;
}
</style>