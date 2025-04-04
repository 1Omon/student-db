<template>
  <div class="teacher-dashboard">
    <!-- Side Navigation -->
    <aside class="sidebar">
      <div class="profile-card">
        <div class="avatar">
          <img :src="teacher.avatar || defaultAvatar" alt="Teacher Avatar">
        </div>
        <h3>{{ teacher.name }}</h3>
        <p class="text-muted">{{ teacher.department }}</p>
        <p class="teacher-id">ID: {{ teacher.id }}</p>
      </div>
      <nav>
        <router-link to="/teacher/classes" active-class="active">
          <i class="icon-classes"></i> My Classes
          <span class="badge" v-if="coursesTeaching.length">{{ coursesTeaching.length }}</span>
        </router-link>
        <router-link to="/teacher/attendance" active-class="active">
          <i class="icon-attendance"></i> Take Attendance
        </router-link>
        <router-link to="/teacher/grading" active-class="active">
          <i class="icon-grading"></i> Grade Students
          <span class="badge" v-if="ungradedCount">{{ ungradedCount }}</span>
        </router-link>
        <router-link to="/teacher/students" active-class="active">
          <i class="icon-students"></i> Manage Students
          <span class="badge" v-if="totalStudents">{{ totalStudents }}</span>
        </router-link>
        <router-link to="/teacher/assignments" active-class="active">
          <i class="icon-assignments"></i> Assignments
          <span class="badge" v-if="assignmentsCreated.length">{{ assignmentsCreated.length }}</span>
        </router-link>
      </nav>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading teacher data...</p>
      </div>
      <div v-else>
        <header class="dashboard-header">
          <h1>Welcome, {{ teacher.name }}</h1>
          <div class="date-time">{{ currentDate }}</div>
        </header>
        
        <div class="dashboard-summary">
          <div class="summary-card">
            <h4>Classes</h4>
            <div class="summary-value">{{ coursesTeaching.length }}</div>
            <div class="summary-label">Active Courses</div>
          </div>
          <div class="summary-card">
            <h4>Students</h4>
            <div class="summary-value">{{ totalStudents }}</div>
            <div class="summary-label">Total Students</div>
          </div>
          <div class="summary-card">
            <h4>Assignments</h4>
            <div class="summary-value">{{ assignmentsCreated.length }}</div>
            <div class="summary-label">Created</div>
          </div>
          <div class="summary-card">
            <h4>Grading</h4>
            <div class="summary-value">{{ ungradedCount }}</div>
            <div class="summary-label">Submissions to Grade</div>
          </div>
        </div>
        
        <div class="recent-classes">
          <h3>Your Classes</h3>
          <div class="class-cards">
            <div v-for="course in coursesTeaching" :key="course.id" class="class-card">
              <h4>{{ course.name }}</h4>
              <p>{{ course.period }}</p>
              <div class="class-meta">
                <span>{{ getStudentCount(course.id) }} Students</span>
                <span>{{ getAssignmentCount(course.id) }} Assignments</span>
              </div>
              <router-link :to="`/teacher/classes/${course.id}`" class="view-class-btn">
                View Class
              </router-link>
            </div>
          </div>
        </div>
        
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import defaultAvatar from '@/assets/default-avatar.jpg'

// Local state
const isLoading = ref(true)
const currentDate = ref(new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))

// Store connection
const store = useStore()

// Teacher data (fallback data until API responds)
const teacher = ref({
  id: 'TCH2023001',
  name: 'Dr. Sarah Williams',
  department: 'Science Department',
  avatar: '',
  classes: [
    { id: 'SCI10A', name: 'Grade 10 Science A', schedule: 'Mon, Wed, Fri 9:00 AM' },
    { id: 'SCI11B', name: 'Grade 11 Science B', schedule: 'Tue, Thu 10:30 AM' }
  ]
})

// Computed properties from store
const coursesTeaching = computed(() => store.state.teacher.coursesTeaching)
const assignmentsCreated = computed(() => store.state.teacher.assignmentsCreated)
const totalStudents = computed(() => store.state.teacher.students.length)
const ungradedCount = computed(() => store.getters['teacher/ungradedSubmissionsCount'])

// Helper functions
const getStudentCount = (courseId) => {
  return store.getters['teacher/studentsByCourse'](courseId).length
}

const getAssignmentCount = (courseId) => {
  return store.getters['teacher/assignmentsByCourse'](courseId).length
}

// Fetch teacher data on component mount
onMounted(async () => {
  try {
    await store.dispatch('teacher/fetchTeacherData')
    isLoading.value = false
  } catch (error) {
    console.error('Failed to fetch teacher data:', error)
    isLoading.value = false
  }
})
</script>

<style scoped>
.teacher-dashboard {
  display: grid;
  grid-template-columns: 240px calc(100vw - 240px);
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Sidebar styles */
.sidebar {
  background: linear-gradient(135deg, #4a6b3a 0%, #3e502c 100%);
  color: white;
  padding: 2rem 1rem;
  height: 100vh;
  position: sticky;
  top: 0;
}

.profile-card {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.teacher-id {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: -0.5rem;
}

.text-muted {
  color: rgba(255, 255, 255, 0.7);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

nav a {
  color: rgba(255, 255, 255, 0.7);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
  position: relative;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

nav a.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
}

.badge {
  position: absolute;
  right: 0.75rem;
  background-color: #ff9800;
  color: white;
  border-radius: 12px;
  padding: 0.1rem 0.5rem;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Main content styles */
.main-content {
  padding: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #4a6b3a;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.date-time {
  color: #666;
  font-size: 0.9rem;
}

.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.summary-card h4 {
  color: #333;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 2rem;
  font-weight: bold;
  color: #4a6b3a;
  margin-bottom: 0.25rem;
}

.summary-label {
  color: #666;
  font-size: 0.85rem;
}

.recent-classes {
  margin-top: 2rem;
}

.class-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.class-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.class-card h4 {
  margin-top: 0;
  color: #333;
}

.class-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.85rem;
  margin: 1rem 0;
}

.view-class-btn {
  background-color: #4a6b3a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.view-class-btn:hover {
  background-color: #3e502c;
}
</style>