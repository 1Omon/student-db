<template>
  <div class="manage-class">
    <header class="page-header">
      <h1>Manage Classes</h1>
      <button class="primary-btn" @click="showCreateClassModal = true">
        <i class="icon-plus"></i> Create New Class
      </button>
    </header>

    <div class="section-container">
      <div class="filter-toolbar">
        <div class="search-box">
          <input type="text" placeholder="Search classes..." v-model="searchQuery">
          <i class="icon-search"></i>
        </div>
        <div class="filter-options">
          <select v-model="subjectFilter">
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
          </select>
          <select v-model="periodFilter">
            <option value="">All Periods</option>
            <option value="1st">1st Period</option>
            <option value="2nd">2nd Period</option>
            <option value="3rd">3rd Period</option>
            <option value="4th">4th Period</option>
            <option value="5th">5th Period</option>
          </select>
        </div>
      </div>

      <div class="class-list" v-if="filteredClasses.length > 0">
        <div v-for="course in filteredClasses" :key="course.id" class="class-item">
          <div class="class-info">
            <h3>{{ course.name }}</h3>
            <div class="class-details">
              <span class="period">{{ course.period }}</span>
              <span class="student-count">{{ getStudentCount(course.id) }} Students</span>
            </div>
          </div>
          <div class="class-actions">
            <button class="icon-btn edit-btn" @click="editClass(course)">
              <i class="icon-edit"></i>
            </button>
            <button class="icon-btn" @click="viewClass(course.id)">
              <i class="icon-eye"></i>
            </button>
            <button class="icon-btn delete-btn" @click="confirmDelete(course)">
              <i class="icon-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-icon">📚</div>
        <h3>No Classes Found</h3>
        <p>{{ 
          searchQuery || subjectFilter || periodFilter 
            ? 'No classes match your search criteria.' 
            : 'You haven\'t created any classes yet.' 
        }}</p>
        <button class="primary-btn" @click="showCreateClassModal = true">Create Your First Class</button>
      </div>
    </div>

    <!-- Create/Edit Class Modal (simplified) -->
    <div class="modal-overlay" v-if="showCreateClassModal || showEditClassModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ showEditClassModal ? 'Edit Class' : 'Create New Class' }}</h2>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="className">Class Name</label>
            <input type="text" id="className" v-model="classForm.name" placeholder="e.g. Advanced Mathematics">
          </div>
          <div class="form-group">
            <label for="classPeriod">Class Period</label>
            <select id="classPeriod" v-model="classForm.period">
              <option value="">Select Period</option>
              <option value="1st Period">1st Period</option>
              <option value="2nd Period">2nd Period</option>
              <option value="3rd Period">3rd Period</option>
              <option value="4th Period">4th Period</option>
              <option value="5th Period">5th Period</option>
            </select>
          </div>
          <div class="form-group">
            <label for="classSubject">Subject</label>
            <select id="classSubject" v-model="classForm.subject">
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
              <option value="Physical Education">Physical Education</option>
            </select>
          </div>
          <div class="form-group">
            <label for="classDescription">Description (Optional)</label>
            <textarea id="classDescription" v-model="classForm.description" rows="3" placeholder="Provide a brief description of the class"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="closeModals">Cancel</button>
          <button class="primary-btn" @click="saveClass">
            {{ showEditClassModal ? 'Update Class' : 'Create Class' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="showDeleteModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Confirm Deletion</h2>
          <button class="close-btn" @click="showDeleteModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete the class <strong>{{ classToDelete?.name }}</strong>?</p>
          <p class="warning-text">This action cannot be undone. All associated assignments and data will be permanently removed.</p>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showDeleteModal = false">Cancel</button>
          <button class="danger-btn" @click="deleteClass">Delete Class</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// Local state
const searchQuery = ref('')
const subjectFilter = ref('')
const periodFilter = ref('')
const showCreateClassModal = ref(false)
const showEditClassModal = ref(false)
const showDeleteModal = ref(false)
const classToDelete = ref(null)
const classForm = ref({
  id: null,
  name: '',
  period: '',
  subject: '',
  description: ''
})

// Fetch classes when component mounts
onMounted(() => {
  // If we need to fetch classes from the store or API
  store.dispatch('teacher/fetchCourses')
})

// Computed properties
const coursesTeaching = computed(() => store.state.teacher.coursesTeaching || [])

const filteredClasses = computed(() => {
  return coursesTeaching.value.filter(course => {
    const matchesSearch = !searchQuery.value || 
      course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesSubject = !subjectFilter.value || 
      (course.subject && course.subject === subjectFilter.value)
    
    const matchesPeriod = !periodFilter.value || 
      course.period.toLowerCase().includes(periodFilter.value.toLowerCase())
    
    return matchesSearch && matchesSubject && matchesPeriod
  })
})

// Helper functions
const getStudentCount = (courseId) => {
  return store.getters['teacher/studentsByCourse'](courseId).length
}

const resetForm = () => {
  classForm.value = {
    id: null,
    name: '',
    period: '',
    subject: '',
    description: ''
  }
}

const closeModals = () => {
  showCreateClassModal.value = false
  showEditClassModal.value = false
  resetForm()
}

const editClass = (course) => {
  classForm.value = {
    id: course.id,
    name: course.name,
    period: course.period,
    subject: course.subject || '',
    description: course.description || ''
  }
  showEditClassModal.value = true
}

const viewClass = (courseId) => {
  router.push(`/teacher/classes/${courseId}`)
}

const confirmDelete = (course) => {
  classToDelete.value = course
  showDeleteModal.value = true
}

const saveClass = async () => {
  try {
    if (showEditClassModal.value) {
      // Update existing class
      await store.dispatch('teacher/updateClass', classForm.value)
    } else {
      // Create new class
      await store.dispatch('teacher/createClass', classForm.value)
    }
    // Show success notification or toast message
  } catch (error) {
    console.error('Error saving class:', error)
    // Show error notification
  }
  
  closeModals()
}

const deleteClass = async () => {
  if (!classToDelete.value) return
  
  try {
    await store.dispatch('teacher/deleteClass', classToDelete.value.id)
    // Show success notification
  } catch (error) {
    console.error('Error deleting class:', error)
    // Show error notification
  }
  
  showDeleteModal.value = false
  classToDelete.value = null
}
</script>

<style scoped>
.manage-class {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.filter-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-options select {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-width: 150px;
}

.class-list {
  margin-top: 1rem;
}

.class-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.class-item:last-child {
  border-bottom: none;
}

.class-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.class-details {
  display: flex;
  gap: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.class-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: #f5f5f5;
}

.edit-btn:hover {
  color: #4a6b3a;
}

.delete-btn:hover {
  color: #dc3545;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: inherit;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.primary-btn {
  background-color: #4a6b3a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.secondary-btn {
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.danger-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.warning-text {
  color: #dc3545;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-toolbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .filter-options {
    width: 100%;
  }
  
  .class-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .class-actions {
    margin-top: 1rem;
    align-self: flex-end;
  }
}
</style>