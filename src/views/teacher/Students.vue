<template>
  <div class="students-page">
    <header class="page-header">
      <h1>Students</h1>
      <div class="header-actions">
        <button class="secondary-btn" @click="importStudents">
          <i class="icon-upload"></i> Import Students
        </button>
        <button class="primary-btn" @click="showAddStudentModal = true">
          <i class="icon-plus"></i> Add Student
        </button>
      </div>
    </header>

    <div class="section-container">
      <div class="filter-toolbar">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="Search students...">
          <i class="icon-search"></i>
        </div>
        <div class="filter-options">
          <select v-model="classFilter">
            <option value="">All Classes</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.name }}
            </option>
          </select>
          <select v-model="sortOption">
            <option value="name">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
            <option value="grade">Grade (High-Low)</option>
            <option value="gradeAsc">Grade (Low-High)</option>
          </select>
        </div>
      </div>
      
      <!-- Student List -->
      <div class="student-list" v-if="filteredStudents.length > 0">
        <div class="student-item" v-for="student in filteredStudents" :key="student.id">
          <div class="student-avatar">
            {{ getInitials(student.name) }}
          </div>
          <div class="student-details">
            <h3>{{ student.name }}</h3>
            <div class="student-info">
              <span class="student-id">ID: {{ student.studentId }}</span>
              <span class="student-email">{{ student.email }}</span>
            </div>
            <div class="student-classes">
              <span class="class-tag" v-for="(classId, index) in student.enrolledClasses" :key="index">
                {{ getClassName(classId) }}
              </span>
            </div>
          </div>
          <div class="student-perf">
            <div class="grade-indicator" :class="getGradeClass(student.averageGrade)">
              {{ student.averageGrade || 'N/A' }}
            </div>
            <span class="attendance-stat">{{ student.attendanceRate || '0' }}% Attendance</span>
          </div>
          <div class="student-actions">
            <button class="icon-btn" @click="viewStudentProfile(student.id)" title="View Profile">
              <i class="icon-user"></i>
            </button>
            <button class="icon-btn edit-btn" @click="editStudent(student)" title="Edit Student">
              <i class="icon-edit"></i>
            </button>
            <button class="icon-btn email-btn" @click="emailStudent(student)" title="Email Student">
              <i class="icon-mail"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-icon">👨‍🎓</div>
        <h3>No Students Found</h3>
        <p v-if="searchQuery || classFilter">
          No students match your search criteria. Try adjusting your filters.
        </p>
        <p v-else>
          You haven't added any students yet.
        </p>
        <button class="primary-btn" @click="showAddStudentModal = true">Add Your First Student</button>
      </div>
    </div>
    
    <!-- Add/Edit Student Modal -->
    <div class="modal-overlay" v-if="showAddStudentModal || showEditStudentModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ showEditStudentModal ? 'Edit Student' : 'Add Student' }}</h2>
          <button class="close-btn" @click="closeModals">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="studentName">Full Name</label>
            <input type="text" id="studentName" v-model="studentForm.name" placeholder="Student full name">
          </div>
          <div class="form-group">
            <label for="studentId">Student ID</label>
            <input type="text" id="studentId" v-model="studentForm.studentId" placeholder="Student ID number">
          </div>
          <div class="form-group">
            <label for="studentEmail">Email</label>
            <input type="email" id="studentEmail" v-model="studentForm.email" placeholder="Student email address">
          </div>
          <div class="form-group">
            <label>Enrolled Classes</label>
            <div class="checkbox-group">
              <div v-for="course in courses" :key="course.id" class="checkbox-item">
                <input 
                  type="checkbox" 
                  :id="`course-${course.id}`" 
                  :value="course.id" 
                  v-model="studentForm.enrolledClasses"
                >
                <label :for="`course-${course.id}`">{{ course.name }}</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="studentNotes">Notes (Optional)</label>
            <textarea id="studentNotes" v-model="studentForm.notes" rows="3" placeholder="Any notes about this student"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="closeModals">Cancel</button>
          <button class="primary-btn" @click="saveStudent">
            {{ showEditStudentModal ? 'Update Student' : 'Add Student' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Student Import Modal -->
    <div class="modal-overlay" v-if="showImportModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Import Students</h2>
          <button class="close-btn" @click="showImportModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-area">
            <input 
              type="file" 
              id="csvUpload" 
              ref="fileUpload"
              accept=".csv" 
              @change="handleFileUpload" 
              style="display: none"
            >
            <div class="upload-zone" @click="triggerFileUpload">
              <i class="icon-upload"></i>
              <p>Drag & drop a CSV file here or click to browse</p>
              <p class="upload-hint">Your CSV should include columns for name, ID, email, and class assignments</p>
            </div>
          </div>
          <div v-if="uploadedFile" class="file-info">
            <span class="file-name">{{ uploadedFile.name }}</span>
            <button class="text-btn" @click="clearUpload">Clear</button>
          </div>
          <div class="template-download">
            <p>Not sure about the format? <button class="text-btn" @click="downloadTemplate">Download template</button></p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" @click="showImportModal = false">Cancel</button>
          <button class="primary-btn" @click="processImport" :disabled="!uploadedFile">
            Import Students
          </button>
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

// State
const searchQuery = ref('')
const classFilter = ref('')
const sortOption = ref('name')
const uploadedFile = ref(null)

const showAddStudentModal = ref(false)
const showEditStudentModal = ref(false)
const showImportModal = ref(false)

const studentForm = ref({
  id: null,
  name: '',
  studentId: '',
  email: '',
  enrolledClasses: [],
  notes: ''
})

// Fetch data on mount
onMounted(async () => {
  await store.dispatch('teacher/fetchStudents')
  await store.dispatch('teacher/fetchCourses')
})

// Computed properties
const students = computed(() => store.state.teacher.students || [])
const courses = computed(() => store.state.teacher.coursesTeaching || [])

const filteredStudents = computed(() => {
  let result = students.value.filter(student => {
    // Filter by search query
    const matchesSearch = !searchQuery.value || 
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.studentId.includes(searchQuery.value)
    
    // Filter by class
    const matchesClass = !classFilter.value || 
      (student.enrolledClasses && student.enrolledClasses.includes(classFilter.value))
    
    return matchesSearch && matchesClass
  })
  
  // Sort the results
  result = [...result].sort((a, b) => {
    switch (sortOption.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'nameDesc':
        return b.name.localeCompare(a.name)
      case 'grade':
        return (b.averageGrade || 0) - (a.averageGrade || 0)
      case 'gradeAsc':
        return (a.averageGrade || 0) - (b.averageGrade || 0)
      default:
        return 0
    }
  })
  
  return result
})

// Helper methods
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getClassName = (classId) => {
  const course = courses.value.find(c => c.id === classId)
  return course ? course.name : 'Unknown Class'
}

const getGradeClass = (grade) => {
  if (!grade) return 'grade-na'
  if (grade >= 90) return 'grade-a'
  if (grade >= 80) return 'grade-b'
  if (grade >= 70) return 'grade-c'
  if (grade >= 60) return 'grade-d'
  return 'grade-f'
}

// Form handlers
const resetForm = () => {
  studentForm.value = {
    id: null,
    name: '',
    studentId: '',
    email: '',
    enrolledClasses: [],
    notes: ''
  }
}

const closeModals = () => {
  showAddStudentModal.value = false
  showEditStudentModal.value = false
  resetForm()
}

const editStudent = (student) => {
  studentForm.value = {
    id: student.id,
    name: student.name,
    studentId: student.studentId,
    email: student.email,
    enrolledClasses: [...(student.enrolledClasses || [])],
    notes: student.notes || ''
  }
  showEditStudentModal.value = true
}

const saveStudent = async () => {
  try {
    if (showEditStudentModal.value) {
      await store.dispatch('teacher/updateStudent', studentForm.value)
    } else {
      await store.dispatch('teacher/addStudent', studentForm.value)
    }
    closeModals()
  } catch (error) {
    console.error('Error saving student:', error)
    // Could show an error notification here
  }
}

// Import functionality
const importStudents = () => {
  showImportModal.value = true
}

const triggerFileUpload = () => {
  document.getElementById('csvUpload').click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file type
  if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
    alert('Please upload a CSV file')
    return
  }
  
  uploadedFile.value = file
}

const clearUpload = () => {
  uploadedFile.value = null
  if (document.getElementById('csvUpload')) {
    document.getElementById('csvUpload').value = ''
  }
}

const downloadTemplate = () => {
  // In a real app, this would generate and download a CSV template
  const template = 'Name,Student ID,Email,Classes\nJohn Doe,STU1234,john.doe@example.com,"Class1,Class2"\n'
  const blob = new Blob([template], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'student_import_template.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const processImport = async () => {
  if (!uploadedFile.value) return
  
  // In a real app, this would parse the CSV and dispatch actions to add the students
  // For now we'll just simulate with a delay
  try {
    // Mock processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Students imported successfully!')
    showImportModal.value = false
    clearUpload()
    // Refetch students
    await store.dispatch('teacher/fetchStudents')
  } catch (error) {
    console.error('Error importing students:', error)
    alert('Error importing students')
  }
}

// Navigation
const viewStudentProfile = (studentId) => {
  // Navigate to student profile or details page
  router.push(`/teacher/students/${studentId}`)
}

const emailStudent = (student) => {
  // Open email client or in-app messaging
  window.location.href = `mailto:${student.email}`
}
</script>

<style scoped>
.students-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.section-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

/* Toolbar Styles */
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

/* Student List Styles */
.student-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #4a6b3a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

.student-details {
  flex: 1;
}

.student-details h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.student-info {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.student-classes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.class-tag {
  background-color: #e9f1e6;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #4a6b3a;
}

.student-perf {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1.5rem;
}

.grade-indicator {
  font-size: 1.2rem;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.grade-a { background-color: #dff0d8; color: #3c763d; }
.grade-b { background-color: #d9edf7; color: #31708f; }
.grade-c { background-color: #fcf8e3; color: #8a6d3b; }
.grade-d { background-color: #fff3cd; color: #856404; }
.grade-f { background-color: #f8d7da; color: #721c24; }
.grade-na { background-color: #e9ecef; color: #6c757d; }

.attendance-stat {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
}

.student-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #555;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: #f0f0f0;
}

.edit-btn:hover {
  color: #4a6b3a;
}

.email-btn:hover {
  color: #0066cc;
}

/* Empty State */
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
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

/* Modal Styles */
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

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Form Styles */
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

.checkbox-group {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
  max-height: 150px;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.checkbox-item input {
  margin-right: 0.5rem;
  width: auto;
}

/* Upload Area */
.upload-area {
  margin-bottom: 1rem;
}

.upload-zone {
  border: 2px dashed #ddd;
  padding: 2rem;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-zone:hover {
  border-color: #4a6b3a;
}

.upload-zone i {
  font-size: 2rem;
  color: #999;
  margin-bottom: 1rem;
}

.upload-hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.template-download {
  font-size: 0.9rem;
  text-align: center;
}

.text-btn {
  background: none;
  border: none;
  color: #4a6b3a;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
  text-decoration: underline;
}

/* Buttons */
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

.primary-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.secondary-btn {
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .primary-btn,
  .header-actions .secondary-btn {
    flex: 1;
    justify-content: center;
  }

  .filter-toolbar {
    flex-direction: column;
    gap: 1rem;
  }

  .search-box {
    max-width: 100%;
  }

  .filter-options {
    width: 100%;
    flex-direction: column;
  }
  
  .student-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .student-details {
    width: 100%;
    margin-bottom: 1rem;
  }

  .student-info {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .student-perf {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    margin: 0.5rem 0;
  }
  
  .student-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>