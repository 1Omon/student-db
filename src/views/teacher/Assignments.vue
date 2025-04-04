<template>
  <div class="assignments-page">
    <header class="page-header">
      <h1>Assignments</h1>
      <button class="primary-btn" @click="showCreateModal = true">
        <i class="icon-plus"></i> Create Assignment
      </button>
    </header>

    <div class="section-container">
      <div class="filter-toolbar">
        <div class="search-box">
          <input type="text" placeholder="Search assignments..." v-model="searchQuery">
          <i class="icon-search"></i>
        </div>
        <div class="filter-options">
          <select v-model="classFilter">
            <option value="">All Classes</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.name }}
            </option>
          </select>
          <select v-model="statusFilter">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="pastDue">Past Due</option>
            <option value="graded">Graded</option>
          </select>
          <select v-model="sortOption">
            <option value="dateDesc">Due Date (Newest)</option>
            <option value="dateAsc">Due Date (Oldest)</option>
            <option value="name">Title (A-Z)</option>
            <option value="nameDesc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      <!-- Assignment List -->
      <div class="assignments-list" v-if="filteredAssignments.length > 0">
        <div class="assignment-item" v-for="assignment in filteredAssignments" :key="assignment.id">
          <div class="assignment-status">
            <div class="status-indicator" :class="getStatusClass(assignment)"></div>
            <span class="status-text">{{ getStatusText(assignment) }}</span>
          </div>

          <div class="assignment-info">
            <h3>{{ assignment.title }}</h3>
            <div class="assignment-meta">
              <span class="assignment-class">{{ getClassName(assignment.courseId) }}</span>
              <span class="assignment-type">{{ assignment.type }}</span>
              <span class="assignment-points">{{ assignment.maxPoints }} points</span>
            </div>
            <div class="assignment-dates">
              <span>Assigned: {{ formatDate(assignment.assignedDate) }}</span>
              <span>Due: {{ formatDate(assignment.dueDate) }}</span>
            </div>
          </div>

          <div class="assignment-stats">
            <div class="submission-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getSubmissionRate(assignment) + '%' }"></div>
              </div>
              <span class="progress-text">{{ assignment.submittedCount || 0 }}/{{ assignment.totalStudents || 0 }} submitted</span>
            </div>
            <div class="grading-progress" v-if="assignment.status === 'published' || assignment.status === 'pastDue'">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getGradingRate(assignment) + '%' }"></div>
              </div>
              <span class="progress-text">{{ assignment.gradedCount || 0 }}/{{ assignment.submittedCount || 0 }} graded</span>
            </div>
          </div>

          <div class="assignment-actions">
            <button class="icon-btn view-btn" @click="viewAssignment(assignment.id)" title="View Assignment">
              <i class="icon-eye"></i>
            </button>
            <button class="icon-btn edit-btn" @click="editAssignment(assignment)" title="Edit Assignment">
              <i class="icon-edit"></i>
            </button>
            <button class="icon-btn" @click="openGrading(assignment)" title="Grade Submissions">
              <i class="icon-clipboard-check"></i>
            </button>
            <button class="icon-btn delete-btn" @click="confirmDelete(assignment)" title="Delete Assignment">
              <i class="icon-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-icon">📝</div>
        <h3>No Assignments Found</h3>
        <p v-if="searchQuery || classFilter || statusFilter">
          No assignments match your search criteria. Try adjusting your filters.
        </p>
        <p v-else>
          You haven't created any assignments yet.
        </p>
        <button class="primary-btn" @click="showCreateModal = true">Create Your First Assignment</button>
      </div>
    </div>

    <!-- Create/Edit Assignment Modal -->
    <modal v-if="showCreateModal" @close="showCreateModal = false">
      <template v-slot:header>
        <h2>{{ editingAssignment ? 'Edit Assignment' : 'Create New Assignment' }}</h2>
      </template>
      <template v-slot:body>
        <form @submit.prevent="saveAssignment" class="assignment-form">
          <div class="form-group">
            <label for="title">Assignment Title</label>
            <input type="text" id="title" v-model="assignmentForm.title" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="course">Class</label>
              <select id="course" v-model="assignmentForm.courseId" required>
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="type">Assignment Type</label>
              <select id="type" v-model="assignmentForm.type">
                <option value="homework">Homework</option>
                <option value="quiz">Quiz</option>
                <option value="project">Project</option>
                <option value="exam">Exam</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="assigned-date">Assigned Date</label>
              <input type="date" id="assigned-date" v-model="assignmentForm.assignedDate" required>
            </div>
            
            <div class="form-group">
              <label for="due-date">Due Date</label>
              <input type="date" id="due-date" v-model="assignmentForm.dueDate" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="points">Maximum Points</label>
            <input type="number" id="points" v-model="assignmentForm.maxPoints" min="0" required>
          </div>
          
          <div class="form-group">
            <label for="description">Assignment Description</label>
            <textarea id="description" v-model="assignmentForm.description" rows="4"></textarea>
          </div>
          
          <div class="form-group">
            <label>Attachments</label>
            <div class="attachment-uploader">
              <input type="file" ref="fileInput" @change="handleFileUpload" multiple>
              <button type="button" class="secondary-btn" @click="$refs.fileInput.click()">
                <i class="icon-paperclip"></i> Add Files
              </button>
            </div>
            <div class="attachment-list" v-if="assignmentForm.attachments && assignmentForm.attachments.length">
              <div class="attachment-item" v-for="(file, index) in assignmentForm.attachments" :key="index">
                <span>{{ file.name }}</span>
                <button type="button" class="icon-btn" @click="removeAttachment(index)">
                  <i class="icon-x"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="secondary-btn" @click="showCreateModal = false">Cancel</button>
            <button type="submit" class="primary-btn">{{ editingAssignment ? 'Update' : 'Create' }}</button>
            <button 
              v-if="editingAssignment && assignmentForm.status === 'draft'" 
              type="button" 
              class="success-btn"
              @click="publishAssignment"
            >
              Publish
            </button>
          </div>
        </form>
      </template>
    </modal>

    <!-- Delete Confirmation Modal -->
    <modal v-if="showDeleteModal" @close="showDeleteModal = false">
      <template v-slot:header>
        <h2>Confirm Deletion</h2>
      </template>
      <template v-slot:body>
        <p>Are you sure you want to delete the assignment "{{ assignmentToDelete?.title }}"?</p>
        <p class="warning-text">This action cannot be undone.</p>
        
        <div class="form-actions">
          <button class="secondary-btn" @click="showDeleteModal = false">Cancel</button>
          <button class="danger-btn" @click="deleteAssignment">Delete Assignment</button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'AssignmentsPage',
  components: {
    Modal: () => import('@/components/Modal.vue')
  },
  data() {
    return {
      assignments: [],
      courses: [],
      searchQuery: '',
      classFilter: '',
      statusFilter: '',
      sortOption: 'dateDesc',
      showCreateModal: false,
      showDeleteModal: false,
      editingAssignment: null,
      assignmentToDelete: null,
      assignmentForm: {
        title: '',
        courseId: '',
        type: 'homework',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        maxPoints: 100,
        description: '',
        attachments: [],
        status: 'draft'
      }
    };
  },
  computed: {
    filteredAssignments() {
      let result = [...this.assignments];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(assignment => 
          assignment.title.toLowerCase().includes(query)
        );
      }
      
      // Apply class filter
      if (this.classFilter) {
        result = result.filter(assignment => 
          assignment.courseId === this.classFilter
        );
      }
      
      // Apply status filter
      if (this.statusFilter) {
        result = result.filter(assignment => 
          assignment.status === this.statusFilter
        );
      }
      
      // Apply sorting
      result.sort((a, b) => {
        switch(this.sortOption) {
          case 'dateAsc':
            return new Date(a.dueDate) - new Date(b.dueDate);
          case 'name':
            return a.title.localeCompare(b.title);
          case 'nameDesc':
            return b.title.localeCompare(a.title);
          case 'dateDesc':
          default:
            return new Date(b.dueDate) - new Date(a.dueDate);
        }
      });
      
      return result;
    }
  },
  created() {
    this.fetchAssignments();
    this.fetchCourses();
  },
  methods: {
    fetchAssignments() {
      // In a real app, this would be an API call
      // For now using mock data
      this.assignments = [
        {
          id: '1',
          title: 'Midterm Essay',
          courseId: '101',
          type: 'exam',
          assignedDate: '2025-03-15',
          dueDate: '2025-04-10',
          maxPoints: 100,
          description: 'Write a 5-page essay on a selected topic.',
          status: 'published',
          submittedCount: 15,
          gradedCount: 5,
          totalStudents: 25
        },
        {
          id: '2',
          title: 'Weekly Problem Set',
          courseId: '102',
          type: 'homework',
          assignedDate: '2025-03-25',
          dueDate: '2025-04-01',
          maxPoints: 50,
          description: 'Complete problems 1-10 from Chapter 7.',
          status: 'pastDue',
          submittedCount: 18,
          gradedCount: 18,
          totalStudents: 22
        },
        {
          id: '3',
          title: 'Final Project Outline',
          courseId: '101',
          type: 'project',
          assignedDate: '2025-03-20',
          dueDate: '2025-04-20',
          maxPoints: 25,
          description: 'Submit an outline for your final project.',
          status: 'draft',
          submittedCount: 0,
          gradedCount: 0,
          totalStudents: 25
        }
      ];
    },
    fetchCourses() {
      // In a real app, this would be an API call
      this.courses = [
        { id: '101', name: 'English Literature' },
        { id: '102', name: 'Advanced Mathematics' },
        { id: '103', name: 'Introduction to Biology' }
      ];
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getClassName(courseId) {
      const course = this.courses.find(c => c.id === courseId);
      return course ? course.name : 'Unknown Class';
    },
    getStatusClass(assignment) {
      switch(assignment.status) {
        case 'draft': return 'status-draft';
        case 'published': return 'status-active';
        case 'pastDue': return 'status-past';
        case 'graded': return 'status-complete';
        default: return '';
      }
    },
    getStatusText(assignment) {
      switch(assignment.status) {
        case 'draft': return 'Draft';
        case 'published': return 'Active';
        case 'pastDue': return 'Past Due';
        case 'graded': return 'Graded';
        default: return '';
      }
    },
    getSubmissionRate(assignment) {
      if (!assignment.totalStudents) return 0;
      return (assignment.submittedCount / assignment.totalStudents) * 100;
    },
    getGradingRate(assignment) {
      if (!assignment.submittedCount) return 0;
      return (assignment.gradedCount / assignment.submittedCount) * 100;
    },
    viewAssignment(id) {
      // Navigate to assignment details page
      this.$router.push(`/assignments/${id}`);
    },
    editAssignment(assignment) {
      this.editingAssignment = assignment;
      this.assignmentForm = { ...assignment };
      this.showCreateModal = true;
    },
    openGrading(assignment) {
      // Navigate to grading page
      this.$router.push(`/assignments/${assignment.id}/grade`);
    },
    confirmDelete(assignment) {
      this.assignmentToDelete = assignment;
      this.showDeleteModal = true;
    },
    deleteAssignment() {
      // In a real app, this would be an API call
      this.assignments = this.assignments
        .filter(a => a.id !== this.assignmentToDelete.id);
      this.showDeleteModal = false;
      this.assignmentToDelete = null;
      
      // Show notification
      this.$toast.success('Assignment deleted successfully');
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files.length) return;
      
      // In a real app, these would be uploaded to a server
      // For now, just add them to the form data
      for (let i = 0; i < files.length; i++) {
        this.assignmentForm.attachments.push(files[i]);
      }
      
      // Clear the input
      this.$refs.fileInput.value = '';
    },
    removeAttachment(index) {
      this.assignmentForm.attachments.splice(index, 1);
    },
    resetForm() {
      this.assignmentForm = {
        title: '',
        courseId: this.courses.length ? this.courses[0].id : '',
        type: 'homework',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        maxPoints: 100,
        description: '',
        attachments: [],
        status: 'draft'
      };
      this.editingAssignment = null;
    },
    saveAssignment() {
      // Validate form
      if (!this.assignmentForm.title || !this.assignmentForm.courseId || 
          !this.assignmentForm.dueDate || !this.assignmentForm.assignedDate) {
        this.$toast.error('Please fill in all required fields');
        return;
      }
      
      // In a real app, this would be an API call
      const assignmentData = { ...this.assignmentForm };
      
      if (this.editingAssignment) {
        // Update existing assignment
        const index = this.assignments.findIndex(a => a.id === this.editingAssignment.id);
        if (index !== -1) {
          this.assignments[index] = {
            ...this.assignments[index],
            ...assignmentData
          };
          this.$toast.success('Assignment updated successfully');
        }
      } else {
        // Create new assignment
        const newAssignment = {
          ...assignmentData,
          id: Date.now().toString(),
          submittedCount: 0,
          gradedCount: 0,
          totalStudents: 20 // In a real app, this would come from the class enrollment
        };
        this.assignments.push(newAssignment);
        this.$toast.success('Assignment created successfully');
      }
      
      this.showCreateModal = false;
      this.resetForm();
    },
    publishAssignment() {
      this.assignmentForm.status = 'published';
      this.saveAssignment();
    }
  }
}
</script>

<style scoped>
.assignments-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.filter-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 300px;
}

.search-box input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-options select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.assignment-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 6px;
  background-color: #f9f9f9;
  align-items: center;
  transition: all 0.2s ease;
}

.assignment-item:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.assignment-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-bottom: 5px;
}

.status-draft {
  background-color: #aaa;
}

.status-active {
  background-color: #4caf50;
}

.status-past {
  background-color: #ff9800;
}

.status-complete {
  background-color: #2196f3;
}

.assignment-info {
  flex-grow: 1;
  min-width: 0; /* Prevents flex item from overflowing */
}

.assignment-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assignment-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.assignment-class {
  font-weight: 500;
}

.assignment-dates {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #666;
}

.assignment-stats {
  width: 180px;
}

.submission-progress,
.grading-progress {
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 3px;
}

.progress-fill {
  height: 100%;
  background-color: #2196f3;
  border-radius: 4px;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.assignment-actions {
  display: flex;
  gap: 5px;
}

.icon-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.view-btn:hover {
  color: #2196f3;
}

.edit-btn:hover {
  color: #4caf50;
}

.delete-btn:hover {
  color: #f44336;
}

/* Empty State */
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
  color: #ccc;
}

.empty-state h3 {
  margin: 10px 0;
  color: #666;
}

.empty-state p {
  color: #888;
  margin-bottom: 20px;
}

/* Form Styles */
.assignment-form {
  max-width: 100%;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input[type="text"],
input[type="number"],
input[type="date"],
select,
textarea {
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.attachment-uploader {
  display: flex;
  align-items: center;
}

.attachment-uploader input[type="file"] {
  display: none;
}

.attachment-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Button Styles */
.primary-btn {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.secondary-btn {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.success-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.danger-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.warning-text {
  color: #f44336;
  font-weight: 500;
}
</style>