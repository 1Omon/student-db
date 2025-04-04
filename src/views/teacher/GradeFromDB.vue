<template>
  <div class="grading-form">
    <div class="header">
      <h2>Grade Students</h2>
      <div class="assignment-selector">
        <select v-model="selectedClass" @change="loadAssignments">
          <option v-for="cls in teacherClasses" :key="cls.id" :value="cls.id">
            {{ cls.name }}
          </option>
        </select>
        <select v-model="selectedAssignment" @change="loadGrades">
          <option v-for="assignment in assignments" :key="assignment.id" :value="assignment.id">
            {{ assignment.name }} (Due: {{ formatDate(assignment.due_date) }})
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
        <label>Description</label>
        <textarea v-model="newAssignment.description"></textarea>
      </div>
      <div class="form-group">
        <label>Total Points</label>
        <input type="number" v-model="newAssignment.total_points" min="1">
      </div>
      <div class="form-group">
        <label>Due Date</label>
        <input type="date" v-model="newAssignment.due_date">
      </div>
      <div class="actions">
        <button @click="createAssignment" :disabled="!isAssignmentValid">Create</button>
        <button @click="showNewAssignmentForm = false">Cancel</button>
      </div>
    </div>
    
    <div class="student-grades" v-if="selectedAssignment">
      <div class="assignment-info">
        <h3>{{ selectedAssignmentObj.name }}</h3>
        <p>{{ selectedAssignmentObj.description }}</p>
        <p>Total Points: {{ selectedAssignmentObj.total_points }} | Due: {{ formatDate(selectedAssignmentObj.due_date) }}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>ID</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Feedback</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in classStudents" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.id }}</td>
            <td>
              <input type="number" v-model.number="student.grade.score" 
                :max="selectedAssignmentObj.total_points" min="0"
                @change="student.grade.letter_grade = calculateGrade(student.grade.score)">
              / {{ selectedAssignmentObj.total_points }}
            </td>
            <td>{{ student.grade.letter_grade || '--' }}</td>
            <td>
              <input type="text" v-model="student.grade.feedback" 
                placeholder="Optional feedback">
            </td>
            <td>
              {{ student.grade.updated_at ? formatDateTime(student.grade.updated_at) : '--' }}
            </td>
            <td>
              <button @click="saveGrade(student)" :disabled="!student.grade.score">
                {{ student.grade.id ? 'Update' : 'Save' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="actions" v-if="selectedAssignment && classStudents.length > 0">
      <button class="btn-save-all" @click="saveAllGrades" :disabled="!hasChanges">
        Save All Grades
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const teacherClasses = ref([])
const selectedClass = ref('')
const selectedAssignment = ref('')
const assignments = ref([])
const classStudents = ref([])
const showNewAssignmentForm = ref(false)

const newAssignment = ref({
  name: '',
  description: '',
  total_points: 100,
  due_date: ''
})

// Load teacher's classes on component mount
onMounted(async () => {
  try {
    const response = await axios.get(`/teachers/${teacherId}/classes`)
    teacherClasses.value = response.data
    if (teacherClasses.value.length > 0) {
      selectedClass.value = teacherClasses.value[0].id
      await loadAssignments()
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  }
})

const selectedAssignmentObj = computed(() => {
  return assignments.value.find(a => a.id === selectedAssignment.value) || {}
})

const isAssignmentValid = computed(() => {
  return newAssignment.value.name && 
         newAssignment.value.total_points > 0 &&
         newAssignment.value.due_date
})

const hasChanges = computed(() => {
  return classStudents.value.some(student => 
    student.grade.score !== null && student.grade.score !== undefined
  )
})

const loadAssignments = async () => {
  if (!selectedClass.value) return
  
  try {
    const response = await axios.get(`/classes/${selectedClass.value}/assignments`)
    assignments.value = response.data
    if (assignments.value.length > 0) {
      selectedAssignment.value = assignments.value[0].id
      await loadGrades()
    } else {
      classStudents.value = []
    }
  } catch (error) {
    console.error('Error loading assignments:', error)
  }
}

const loadGrades = async () => {
  if (!selectedAssignment.value) return
  
  try {
    // First load all students in the class
    const studentsResponse = await axios.get(`/classes/${selectedClass.value}/students`)
    
    // Then load existing grades for this assignment
    const gradesResponse = await axios.get(`/assignments/${selectedAssignment.value}/grades`)
    const existingGrades = gradesResponse.data
    
    // Merge student data with their grades
    classStudents.value = studentsResponse.data.map(student => {
      const grade = existingGrades.find(g => g.student_id === student.id) || {
        score: null,
        feedback: '',
        letter_grade: null
      }
      return {
        ...student,
        grade: {
          ...grade,
          id: grade.id || null
        }
      }
    })
  } catch (error) {
    console.error('Error loading grades:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const calculateGrade = (score) => {
  if (!score && score !== 0) return null
  const percentage = (score / selectedAssignmentObj.value.total_points) * 100
  
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

const createAssignment = async () => {
  try {
    const response = await axios.post('/assignments', {
      ...newAssignment.value,
      class_id: selectedClass.value
    })
    
    assignments.value.push(response.data)
    selectedAssignment.value = response.data.id
    showNewAssignmentForm.value = false
    newAssignment.value = { 
      name: '', 
      description: '', 
      total_points: 100, 
      due_date: '' 
    }
    
    await loadGrades()
  } catch (error) {
    console.error('Error creating assignment:', error)
    alert('Failed to create assignment')
  }
}

const saveGrade = async (student) => {
  if (!student.grade.score && student.grade.score !== 0) return
  
  try {
    const gradeData = {
      student_id: student.id,
      assignment_id: selectedAssignment.value,
      score: student.grade.score,
      feedback: student.grade.feedback || null
    }
    
    const response = await axios.post('/grades', gradeData)
    
    // Update local state with saved grade
    const savedGrade = response.data
    student.grade.id = savedGrade.id
    student.grade.letter_grade = savedGrade.letter_grade
    student.grade.updated_at = savedGrade.updated_at
    
    alert('Grade saved successfully!')
  } catch (error) {
    console.error('Error saving grade:', error)
    alert('Failed to save grade')
  }
}

const saveAllGrades = async () => {
  const gradesToSave = classStudents.value
    .filter(student => (student.grade.score || student.grade.score === 0))
    .map(student => ({
      student_id: student.id,
      assignment_id: selectedAssignment.value,
      score: student.grade.score,
      feedback: student.grade.feedback || null
    }))
  
  if (gradesToSave.length === 0) return
  
  try {
    await axios.post('/grades/bulk', { grades: gradesToSave })
    
    // Reload grades to get updated timestamps
    await loadGrades()
    
    alert('All grades saved successfully!')
  } catch (error) {
    console.error('Error saving grades:', error)
    alert('Failed to save grades')
  }
}
</script>

<style scoped>
/* (Keep your existing styles, they're good!) */
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
  align-items: center;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 80px;
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

.actions button:first-child:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.actions button:last-child {
  background: #F44336;
  color: white;
}

.assignment-info {
  background: #f0f7ff;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.assignment-info h3 {
  margin-top: 0;
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

.student-grades button:disabled {
  background: #cccccc;
  cursor: not-allowed;
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

.btn-save-all:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>