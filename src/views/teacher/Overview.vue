<template>
  <div class="overview">
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
    
    <div class="recent-activity">
      <h3>Recent Activity</h3>
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon">📝</div>
          <div class="activity-content">
            <div class="activity-title">New assignment submission</div>
            <div class="activity-details">John Doe submitted "Algebra Homework"</div>
            <div class="activity-time">Today, 2:45 PM</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon">✅</div>
          <div class="activity-content">
            <div class="activity-title">Assignment graded</div>
            <div class="activity-details">You graded Jane Smith's "Calculus Quiz" with A</div>
            <div class="activity-time">Yesterday, 4:30 PM</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon">👤</div>
          <div class="activity-content">
            <div class="activity-title">New student added</div>
            <div class="activity-details">Mark Johnson was added to "Grade 11 Science B"</div>
            <div class="activity-time">Yesterday, 10:15 AM</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Teacher data
const teacher = computed(() => ({
  id: store.state.auth?.user?.id || 'TCH2023001',
  name: store.state.auth?.user?.name || 'Dr. Sarah Williams',
  department: store.state.auth?.user?.department || 'Science Department'
}))

// Current date
const currentDate = ref(new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))

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
</script>

<style scoped>
.overview {
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 2rem;
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

.recent-activity {
  margin-top: 2rem;
}

.activity-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.activity-item {
  display: flex;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #4a6b3a;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #333;
}

.activity-details {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.activity-time {
  color: #999;
  font-size: 0.8rem;
}
</style>