<template>
  <div v-if="currentClass" class="class-view">
    <div class="class-header">
      <h2>{{ currentClass.name }}</h2>
      <p>{{ currentClass.period }}</p>
    </div>
    
    <div class="class-stats">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value">{{ students.length }}</div>
        <div class="stat-label">Students</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-value">{{ assignments.length }}</div>
        <div class="stat-label">Assignments</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⌛</div>
        <div class="stat-value">{{ pendingSubmissions }}</div>
        <div class="stat-label">Pending Grades</div>
      </div>
    </div>
    
    <div class="tabs">
      <button 
        @click="activeTab = 'students'" 
        :class="{ active: activeTab === 'students' }"
      >
        Students
      </button>
      <button 
        @click="activeTab = 'assignments'" 
        :class="{ active: activeTab === 'assignments' }"
      >
        Assignments
      </button>
      <button 
        @click="activeTab = 'grading'" 
        :class="{ active: activeTab === 'grading' }"
      >
        Grading
      </button>
    </div>
    
    <!-- Students Tab -->
    <div v-if="activeTab === 'students'" class="tab-content">
      <div class="action-bar">
        <input type="text" placeholder="Search students..." v-model="searchQuery">
        <button class="primary-btn">Add Student</button>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email || `student${student.id}@school.edu` }}</td>
            <td>
              <button class="icon-btn">📊</button>
              <button class="icon-btn">✉️</button>
            </td>
          </tr>
          <tr v-if="students.length === 0">
            <td colspan="4" class="empty-state">No students found for this class.</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Assignments Tab -->
    <div v-if="activeTab === 'assignments'" class="tab-content">
      <div class="action-bar">
        <button class="primary-btn">Create Assignment</button>
      </div>
      
      <div class="assignments-list">
        <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
          <div class="assignment-header">
            <h4>{{ assignment.title }}</h4>
            <span class="due-date">Due: {{ formatDate(assignment.dueDate) }}</span>
          </div>
          <div class="assignment-actions">
            <button class="secondary-btn">Edit</button>
            <button class="secondary-btn">View Submissions</button>
          </div>
        </div>
        <div v-if="assignments.length === 0" class="empty-state">
          No assignments created yet.
        </div>
      </div>
    </div>
    
    <!-- Grading Tab -->
    <div v-if="activeTab === 'grading'" class="tab-content">
      <div v-if="pendingSubmissions > 0" class="grading-queue">
        <h3>Submissions Awaiting Grading</h3>
        <div v-for="(submission) in gradingQueue" :key="submission.id" class="submission-card">
          <div class="submission-info">
            <h4>{{ submission.assignmentTitle || `Assignment #${submission.assignmentId}` }}</h4>
            <p>Submitted by: {{ submission.studentName || `Student #${submission.studentId}` }}</p>
            <p>Submitted on: {{ formatDate(submission.submittedDate || new Date()) }}</p>
          </div>
          <div class="grading-controls">
            <select v-model="submission.tempGrade">
              <option value="">Select Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
            <button 
              class="primary-btn" 
              :disabled="!submission.tempGrade"
              @click="gradeSubmission(submission.id, submission.tempGrade)"
            >
              Submit Grade
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        No submissions pending for grading.
      </div>
    </div>
  </div>
  <div v-else class="empty-state">
    Loading class data...
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()

// Local state
const activeTab = ref('students')
const searchQuery = ref('')
const pendingSubmissions = ref(2) // Mock data - would come from store
const gradingQueue = ref([
  { 
    id: 1, 
    assignmentId: 1, 
    assignmentTitle: 'Algebra Homework', 
    studentId: 101, 
    studentName: 'John Doe', 
    submittedDate: '2023-12-10',
    tempGrade: ''
  },
  { 
    id: 2, 
    assignmentId: 1, 
    assignmentTitle: 'Algebra Homework', 
    studentId: 102, 
    studentName: 'Jane Smith', 
    submittedDate: '2023-12-12',
    tempGrade: ''
  }
]) // Mock data - would come from store

// Get class ID from route params
const classId = computed(() => parseInt(route.params.id))

// Get class data from store
const currentClass = computed(() => {
  return store.state.teacher.coursesTeaching.find(c => c.id === classId.value) || null
})

// Get students for this class
const students = computed(() => {
  return store.getters['teacher/studentsByCourse'](classId.value)
})

// Get assignments for this class
const assignments = computed(() => {
  return store.getters['teacher/assignmentsByCourse'](classId.value)
})

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Grade submission handler
const gradeSubmission = async (submissionId, grade) => {
  try {
    await store.dispatch('teacher/gradeSubmission', { submissionId, grade })
    // Update local queue to reflect changes
    gradingQueue.value = gradingQueue.value.filter(s => s.id !== submissionId)
    pendingSubmissions.value--
  } catch (error) {
    console.error('Failed to submit grade:', error)
  }
}

// Load class data when component mounts
onMounted(async () => {
  if (!store.state.teacher.coursesTeaching.length) {
    await store.dispatch('teacher/fetchTeacherData')
  }
})
</script>

<style scoped>
.class-view {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.class-header {
  margin-bottom: 2rem;
}

.class-header h2 {
  margin: 0;
  color: #333;
}

.class-header p {
  color: #666;
  margin-top: 0.5rem;
}

.class-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a6b3a;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
}

.tabs button {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tabs button:hover {
  color: #333;
}

.tabs button.active {
  color: #4a6b3a;
  border-bottom-color: #4a6b3a;
  font-weight: 500;
}

.tab-content {
  margin-top: 1.5rem;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.action-bar input {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 250px;
}

.primary-btn {
  background-color: #4a6b3a;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: #3e502c;
}

.primary-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.secondary-btn {
  background-color: white;
  color: #4a6b3a;
  border: 1px solid #4a6b3a;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background-color: #f5f8f5;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.icon-btn:hover {
  opacity: 1;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  font-weight: 500;
  color: #333;
  background-color: #f8f9fa;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.assignments-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.assignment-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.assignment-header h4 {
  margin: 0;
  color: #333;
}

.due-date {
  color: #666;
  font-size: 0.9rem;
}

.assignment-actions {
  display: flex;
  gap: 0.75rem;
}

.grading-queue {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.submission-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.submission-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.submission-info p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.grading-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.grading-controls select {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 150px;
}
</style>