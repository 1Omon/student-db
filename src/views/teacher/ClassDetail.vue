<template>
  <div class="class-detail-page">
    <header class="page-header">
      <div class="header-content">
        <h1>
          {{ classData.name }}
          <span class="class-code">{{ classData.code }}</span>
        </h1>
        <div class="header-meta">
          <div class="meta-item">
            <i class="icon-calendar"></i>
            <span>{{ classData.schedule }}</span>
          </div>
          <div class="meta-item">
            <i class="icon-users"></i>
            <span>{{ classData.enrolledCount || 0 }} Students</span>
          </div>
          <div class="meta-item">
            <i class="icon-map-pin"></i>
            <span>{{ classData.room || 'No Room Assigned' }}</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="showEditModal = true">
          <i class="icon-edit"></i> Edit Class
        </button>
        <button class="primary-btn" @click="$router.push(`/teacher/classes/${id}/attendance`)">
          <i class="icon-clipboard"></i> Take Attendance
        </button>
      </div>
    </header>

    <div class="content-container">
      <div class="tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'overview' }"
          @click="activeTab = 'overview'"
        >
          Overview
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'students' }"
          @click="activeTab = 'students'"
        >
          Students
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'assignments' }"
          @click="activeTab = 'assignments'"
        >
          Assignments
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'grades' }"
          @click="activeTab = 'grades'"
        >
          Grades
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'attendance' }"
          @click="activeTab = 'attendance'"
        >
          Attendance
        </button>
      </div>

      <!-- Overview Tab -->
      <div class="tab-content" v-if="activeTab === 'overview'">
        <div class="cards-grid">
          <div class="card">
            <div class="card-header">
              <h3>Class Information</h3>
            </div>
            <div class="card-body">
              <div class="info-row">
                <span class="label">Subject:</span>
                <span>{{ classData.subject }}</span>
              </div>
              <div class="info-row">
                <span class="label">Grade Level:</span>
                <span>{{ classData.gradeLevel }}</span>
              </div>
              <div class="info-row">
                <span class="label">Academic Year:</span>
                <span>{{ classData.academicYear || '2024-2025' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Term:</span>
                <span>{{ classData.term || 'Spring Term' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Description:</span>
                <p class="description">{{ classData.description || 'No description available.' }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Quick Stats</h3>
            </div>
            <div class="card-body">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ stats.averageGrade || '0' }}%</div>
                  <div class="stat-label">Average Grade</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ stats.assignmentCount || '0' }}</div>
                  <div class="stat-label">Assignments</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ stats.attendanceRate || '0' }}%</div>
                  <div class="stat-label">Attendance Rate</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ stats.upcomingDue || '0' }}</div>
                  <div class="stat-label">Due Soon</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div class="card-body">
              <div class="activity-list" v-if="recentActivity.length > 0">
                <div class="activity-item" v-for="(activity, index) in recentActivity" :key="index">
                  <div class="activity-icon" :class="activity.type">
                    <i :class="getActivityIcon(activity.type)"></i>
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="activity-date">{{ formatDate(activity.date) }}</div>
                  </div>
                </div>
              </div>
              <div class="empty-message" v-else>
                No recent activity
              </div>
            </div>
          </div>
        </div>

        <div class="upcoming-section">
          <h3>Upcoming Assignments</h3>
          <div class="assignments-list" v-if="upcomingAssignments.length > 0">
            <div class="assignment-card" v-for="assignment in upcomingAssignments" :key="assignment.id">
              <div class="assignment-header">
                <h4>{{ assignment.title }}</h4>
                <span class="assignment-type">{{ assignment.type }}</span>
              </div>
              <div class="assignment-date">
                <i class="icon-calendar"></i>
                <span>Due: {{ formatDate(assignment.dueDate) }}</span>
              </div>
              <div class="assignment-footer">
                <span class="assignment-points">{{ assignment.points }} points</span>
                <button class="text-btn" @click="viewAssignment(assignment.id)">View Details</button>
              </div>
            </div>
          </div>
          <div class="empty-message" v-else>
            No upcoming assignments
          </div>
        </div>
      </div>

      <!-- Students Tab -->
      <div class="tab-content" v-if="activeTab === 'students'">
        <div class="tab-header">
          <h2>Students</h2>
          <div class="tab-actions">
            <div class="search-box">
              <input type="text" placeholder="Search students..." v-model="studentSearchQuery">
              <i class="icon-search"></i>
            </div>
            <button class="secondary-btn" @click="exportStudentList">
              <i class="icon-download"></i> Export
            </button>
            <button class="primary-btn" @click="showAddStudentModal = true">
              <i class="icon-plus"></i> Add Student
            </button>
          </div>
        </div>

        <div class="students-table">
          <table v-if="filteredStudents.length > 0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Grade Average</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.id">
                <td>{{ student.id }}</td>
                <td>{{ student.firstName }} {{ student.lastName }}</td>
                <td>{{ student.email }}</td>
                <td>
                  <span :class="getGradeClass(student.gradeAverage)">
                    {{ student.gradeAverage || 'N/A' }}
                  </span>
                </td>
                <td>
                  <div class="progress-bar small">
                    <div class="progress-fill" :style="{ width: `${student.attendanceRate || 0}%` }"></div>
                  </div>
                  <span class="progress-text">{{ student.attendanceRate || 0 }}%</span>
                </td>
                <td>
                  <div class="row-actions">
                    <button class="icon-btn" @click="viewStudentDetails(student.id)" title="View Details">
                      <i class="icon-eye"></i>
                    </button>
                    <button class="icon-btn" @click="emailStudent(student)" title="Send Email">
                      <i class="icon-mail"></i>
                    </button>
                    <button class="icon-btn" @click="removeStudent(student)" title="Remove from Class">
                      <i class="icon-user-x"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="empty-message" v-else>
            No students found.
          </div>
        </div>
      </div>

      <!-- Assignments Tab -->
      <div class="tab-content" v-if="activeTab === 'assignments'">
        <div class="tab-header">
          <h2>Assignments</h2>
          <div class="tab-actions">
            <div class="search-box">
              <input type="text" placeholder="Search assignments..." v-model="assignmentSearchQuery">
              <i class="icon-search"></i>
            </div>
            <button class="primary-btn" @click="createNewAssignment">
              <i class="icon-plus"></i> Create Assignment
            </button>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-group">
            <label>Type:</label>
            <select v-model="assignmentTypeFilter">
              <option value="">All Types</option>
              <option value="homework">Homework</option>
              <option value="quiz">Quiz</option>
              <option value="project">Project</option>
              <option value="exam">Exam</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Status:</label>
            <select v-model="assignmentStatusFilter">
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="past">Past Due</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Sort By:</label>
            <select v-model="assignmentSortOption">
              <option value="dateDesc">Due Date (Newest)</option>
              <option value="dateAsc">Due Date (Oldest)</option>
              <option value="name">Title (A-Z)</option>
            </select>
          </div>
        </div>

        <div class="assignments-grid">
          <div class="assignment-card" v-for="assignment in filteredAssignments" :key="assignment.id">
            <div class="status-badge" :class="getAssignmentStatusClass(assignment)">
              {{ getAssignmentStatusText(assignment) }}
            </div>
            <h4>{{ assignment.title }}</h4>
            <div class="assignment-meta">
              <span class="assignment-type">{{ assignment.type }}</span>
              <span class="assignment-points">{{ assignment.points }} pts</span>
            </div>
            <div class="assignment-dates">
              <div><strong>Assigned:</strong> {{ formatDate(assignment.assignedDate) }}</div>
              <div><strong>Due:</strong> {{ formatDate(assignment.dueDate) }}</div>
            </div>
            <div class="submission-info">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :class="getSubmissionRateClass(assignment)"
                  :style="{ width: `${getSubmissionRate(assignment)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ assignment.submittedCount || 0 }}/{{ classData.enrolledCount || 0 }} Submitted
              </div>
            </div>
            <div class="assignment-actions">
              <button class="text-btn" @click="viewAssignmentDetails(assignment.id)">
                View Details
              </button>
              <button class="text-btn" @click="gradeAssignment(assignment.id)">
                Grade
              </button>
              <button class="text-btn" @click="editAssignment(assignment)">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional tabs would be implemented here -->
    </div>

    <!-- Edit Class Modal -->
    <Modal v-if="showEditModal" @close="showEditModal = false">
      <template v-slot:header>
        <h2>Edit Class</h2>
      </template>
      <template v-slot:body>
        <form @submit.prevent="saveClassDetails" class="edit-class-form">
          <div class="form-group">
            <label for="class-name">Class Name</label>
            <input type="text" id="class-name" v-model="editForm.name" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="subject">Subject</label>
              <input type="text" id="subject" v-model="editForm.subject" required>
            </div>
            
            <div class="form-group">
              <label for="grade-level">Grade Level</label>
              <select id="grade-level" v-model="editForm.gradeLevel">
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
                <option value="11">11th Grade</option>
                <option value="12">12th Grade</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="room">Room</label>
              <input type="text" id="room" v-model="editForm.room">
            </div>
            
            <div class="form-group">
              <label for="schedule">Schedule</label>
              <input type="text" id="schedule" v-model="editForm.schedule">
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="editForm.description" rows="4"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="secondary-btn" @click="showEditModal = false">Cancel</button>
            <button type="submit" class="primary-btn">Save Changes</button>
          </div>
        </form>
      </template>
    </Modal>

    <!-- Add Student Modal would be implemented here -->
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue';

export default {
  name: 'ClassDetail',
  components: {
    Modal
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeTab: 'overview',
      classData: {},
      stats: {},
      recentActivity: [],
      upcomingAssignments: [],
      students: [],
      assignments: [],
      showEditModal: false,
      showAddStudentModal: false,
      studentSearchQuery: '',
      assignmentSearchQuery: '',
      assignmentTypeFilter: '',
      assignmentStatusFilter: '',
      assignmentSortOption: 'dateDesc',
      editForm: {
        name: '',
        subject: '',
        gradeLevel: '',
        room: '',
        schedule: '',
        description: ''
      }
    };
  },
  computed: {
    filteredStudents() {
      if (!this.studentSearchQuery) return this.students;
      
      const query = this.studentSearchQuery.toLowerCase();
      return this.students.filter(student => 
        student.firstName.toLowerCase().includes(query) || 
        student.lastName.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    },
    filteredAssignments() {
      let result = [...this.assignments];
      
      // Apply search filter
      if (this.assignmentSearchQuery) {
        const query = this.assignmentSearchQuery.toLowerCase();
        result = result.filter(assignment => 
          assignment.title.toLowerCase().includes(query)
        );
      }
      
      // Apply type filter
      if (this.assignmentTypeFilter) {
        result = result.filter(assignment => 
          assignment.type === this.assignmentTypeFilter
        );
      }
      
      // Apply status filter
      if (this.assignmentStatusFilter) {
        result = result.filter(assignment => {
          if (this.assignmentStatusFilter === 'past') {
            return new Date(assignment.dueDate) < new Date() && assignment.status === 'published';
          }
          return assignment.status === this.assignmentStatusFilter;
        });
      }
      
      // Apply sorting
      result.sort((a, b) => {
        switch(this.assignmentSortOption) {
          case 'dateAsc':
            return new Date(a.dueDate) - new Date(b.dueDate);
          case 'name':
            return a.title.localeCompare(b.title);
          case 'dateDesc':
          default:
            return new Date(b.dueDate) - new Date(a.dueDate);
        }
      });
      
      return result;
    }
  },
  created() {
    this.fetchClassData();
    this.fetchStatistics();
    this.fetchRecentActivity();
    this.fetchUpcomingAssignments();
    this.fetchStudents();
    this.fetchAssignments();
  },
  methods: {
    fetchClassData() {
      // In a real app, this would be an API call
      this.classData = {
        id: this.id,
        name: 'American Literature',
        code: 'LIT-101',
        subject: 'English',
        gradeLevel: '11',
        room: '204',
        schedule: 'Mon, Wed, Fri 10:00 AM - 11:30 AM',
        description: 'This course explores major American literary works from the colonial period to the modern era, focusing on themes of identity, freedom, and the American dream.',
        enrolledCount: 24,
        academicYear: '2024-2025',
        term: 'Spring Term'
      };
      
      // Initialize edit form with current data
      this.editForm = { ...this.classData };
    },
    fetchStatistics() {
      // In a real app, this would be an API call
      this.stats = {
        averageGrade: 86.5,
        assignmentCount: 8,
        attendanceRate: 92.3,
        upcomingDue: 2
      };
    },
    fetchRecentActivity() {
      // In a real app, this would be an API call
      this.recentActivity = [
        {
          type: 'assignment',
          text: 'Essay on The Great Gatsby was published',
          date: '2025-04-02T14:30:00'
        },
        {
          type: 'grade',
          text: 'Grades for Short Story Analysis were posted',
          date: '2025-03-30T09:15:00'
        },
        {
          type: 'attendance',
          text: 'Attendance taken for March 29 class',
          date: '2025-03-29T11:45:00'
        }
      ];
    },
    fetchUpcomingAssignments() {
      // In a real app, this would be an API call
      this.upcomingAssignments = [
        {
          id: '1',
          title: 'Poetry Analysis',
          type: 'Homework',
          dueDate: '2025-04-10T23:59:00',
          points: 50
        },
        {
          id: '2',
          title: 'Midterm Exam',
          type: 'Exam',
          dueDate: '2025-04-15T10:00:00',
          points: 100
        }
      ];
    },
    fetchStudents() {
      // In a real app, this would be an API call
      this.students = [
        {
          id: 'S001',
          firstName: 'Emma',
          lastName: 'Johnson',
          email: 'emma.j@example.edu',
          gradeAverage: 92.5,
          attendanceRate: 95
        },
        {
          id: 'S002',
          firstName: 'Michael',
          lastName: 'Smith',
          email: 'michael.s@example.edu',
          gradeAverage: 84.3,
          attendanceRate: 88
        },
        {
          id: 'S003',
          firstName: 'Sophia',
          lastName: 'Garcia',
          email: 'sophia.g@example.edu',
          gradeAverage: 96.8,
          attendanceRate: 100
        }
      ];
    },
    fetchAssignments() {
      // In a real app, this would be an API call
      this.assignments = [
        {
          id: '1',
          title: 'Poetry Analysis',
          type: 'homework',
          assignedDate: '2025-04-01',
          dueDate: '2025-04-10',
          points: 50,
          status: 'published',
          submittedCount: 15
        },
        {
          id: '2',
          title: 'Midterm Exam',
          type: 'exam',
          assignedDate: '2025-03-20',
          dueDate: '2025-04-15',
          points: 100,
          status: 'published',
          submittedCount: 0
        },
        {
          id: '3',
          title: 'Short Story Analysis',
          type: 'homework',
          assignedDate: '2025-03-15',
          dueDate: '2025-03-25',
          points: 30,
          status: 'published',
          submittedCount: 22
        }
      ];
    },
    formatDate(dateString) {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getActivityIcon(type) {
      switch(type) {
        case 'assignment': return 'icon-file-text';
        case 'grade': return 'icon-award';
        case 'attendance': return 'icon-check-square';
        case 'announcement': return 'icon-bell';
        default: return 'icon-activity';
      }
    },
    getGradeClass(grade) {
      if (!grade) return '';
      if (grade >= 90) return 'grade-a';
      if (grade >= 80) return 'grade-b';
      if (grade >= 70) return 'grade-c';
      if (grade >= 60) return 'grade-d';
      return 'grade-f';
    },
    getAssignmentStatusClass(assignment) {
      if (assignment.status === 'draft') return 'status-draft';
      if (new Date(assignment.dueDate) < new Date()) return 'status-past';
      return 'status-active';
    },
    getAssignmentStatusText(assignment) {
      if (assignment.status === 'draft') return 'Draft';
      if (new Date(assignment.dueDate) < new Date()) return 'Past Due';
      return 'Active';
    },
    getSubmissionRate(assignment) {
      if (!this.classData.enrolledCount) return 0;
      return (assignment.submittedCount / this.classData.enrolledCount) * 100;
    },
    getSubmissionRateClass(assignment) {
      const rate = this.getSubmissionRate(assignment);
      if (rate >= 80) return 'rate-high';
      if (rate >= 50) return 'rate-medium';
      return 'rate-low';
    },
    viewAssignment(id) {
      // Navigate to assignment details
      this.$router.push(`/teacher/assignments/${id}`);
    },
    viewAssignmentDetails(id) {
      this.$router.push(`/teacher/assignments/${id}`);
    },
    gradeAssignment(id) {
      this.$router.push(`/teacher/assignments/${id}/grade`);
    },
    editAssignment(assignment) {
      this.$router.push({
        path: '/teacher/assignments/edit',
        query: { id: assignment.id }
      });
    },
    createNewAssignment() {
      this.$router.push({
        path: '/teacher/assignments/create',
        query: { classId: this.id }
      });
    },
    viewStudentDetails(id) {
      this.$router.push(`/teacher/students/${id}`);
    },
    emailStudent(student) {
      // Implement email student functionality
      alert(`Email functionality for ${student.firstName} ${student.lastName} would open here.`);
    },
    removeStudent(student) {
      if (confirm(`Are you sure you want to remove ${student.firstName} ${student.lastName} from this class?`)) {
        // In a real app, this would be an API call
        this.students = this.students.filter(s => s.id !== student.id);
        this.$toast.success('Student removed from class');
      }
    },
    exportStudentList() {
      // Implement export functionality
      alert('Student list export functionality would run here.');
    },
    saveClassDetails() {
      // In a real app, this would be an API call
      this.classData = { ...this.editForm };
      this.showEditModal = false;
      this.$toast.success('Class details updated successfully');
    }
  }
}
</script>

<style scoped>
.class-detail-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Styles */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header-content h1 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.class-code {
  font-size: 16px;
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  color: #666;
  font-weight: 500;
}

.header-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.meta-item i {
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-self: center;
}

/* Button Styles */
.primary-btn {
  background-color: #3a4a6b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: #2c3e50;
}

.secondary-btn {
  background-color: #f0f0f0;
  color: #2c3e50;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
}

/* Tab Styles */
.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  background: #fff;
  padding: 0 20px;
  border-radius: 8px 8px 0 0;
}

.tab-button {
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #3a4a6b;
}

.tab-button.active {
  color: #3a4a6b;
  font-weight: 500;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3a4a6b;
}

/* Content Container */
.content-container {
  background: #fff;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Card Grid Styles */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}

.card-body {
  padding: 15px;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-row .label {
  font-weight: 500;
  min-width: 120px;
  color: #666;
}

.description {
  margin-top: 5px;
  color: #555;
  line-height: 1.5;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #3a4a6b;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-icon.assignment {
  background-color: #4CAF50;
}

.activity-icon.grade {
  background-color: #FFC107;
}

.activity-icon.attendance {
  background-color: #2196F3;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  margin-bottom: 3px;
}

.activity-date {
  font-size: 12px;
  color: #888;
}

.empty-message {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

/* Upcoming Assignments */
.upcoming-section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #2c3e50;
}

.assignments-list {
  display: grid;
  gap: 15px;
}

.assignment-card {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 15px;
  transition: box-shadow 0.2s;
}

.assignment-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.assignment-header h4 {
  margin: 0;
  font-size: 16px;
}

.assignment-type {
  font-size: 12px;
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 10px;
  color: #666;
}

.assignment-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.assignment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.assignment-points {
  font-size: 13px;
  color: #666;
}

.text-btn {
  background: none;
  border: none;
  color: #3a4a6b;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  text-decoration: underline;
}

/* Tab Header Styles */
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.tab-header h2 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.tab-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 8px 12px 8px 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

/* Table Styles */
.students-table {
  overflow-x: auto;
}

.students-table table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th {
  background-color: #f8f9fa;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
  color: #2c3e50;
  border-bottom: 1px solid #ddd;
}

.students-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.grade-a {
  color: #4CAF50;
  font-weight: 500;
}

.grade-b {
  color: #2196F3;
  font-weight: 500;
}

.grade-c {
  color: #FFC107;
  font-weight: 500;
}

.grade-d {
  color: #FF9800;
  font-weight: 500;
}

.grade-f {
  color: #F44336;
  font-weight: 500;
}

/* Progress Bar */
.progress-bar {
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  width: 100px;
}

.progress-bar.small {
  width: 60px;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s;
}

.progress-text {
  display: inline-block;
  margin-left: 8px;
  font-size: 13px;
  color: #666;
  vertical-align: middle;
}

/* Row Actions */
.row-actions {
  display: flex;
  gap: 5px;
}

.icon-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: #f0f0f0;
  color: #3a4a6b;
}

/* Filter Row */
.filter-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

/* Assignments Grid */
.assignments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.assignment-card {
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.2s;
}

.assignment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 10px;
}

.status-draft {
  background-color: #f0f0f0;
  color: #666;
}

.status-active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-past {
  background-color: #ffebee;
  color: #d32f2f;
}

.assignment-meta {
  display: flex;
  gap: 10px;
  margin: 8px 0;
  font-size: 13px;
}

.assignment-type {
  color: #666;
}

.assignment-points {
  color: #3a4a6b;
  font-weight: 500;
}

.assignment-dates {
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
}

.assignment-dates div {
  margin-bottom: 5px;
}

.submission-info {
  margin-bottom: 15px;
}

.rate-high {
  background-color: #4CAF50;
}

.rate-medium {
  background-color: #FFC107;
}

.rate-low {
  background-color: #F44336;
}

.assignment-actions {
  display: flex;
  justify-content: space-between;
}

/* Modal Form Styles */
.edit-class-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  color: #666;
}

.form-group input,
.form-group select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
}

.form-group button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background-color: #4CAF50;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
}

.form-group button:hover {
    background-color: #45a049;
}

.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    width: 500px;
    max-width: 80%;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    max-height: 80vh;
    overflow-x: hidden;
    scroll-behavior: smooth;
    position: relative;
    z-index: 1001;
    outline: none;
    transition: all 0.3s;
    transform: translateY(-50%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    will-change: transform;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
    z-index: 1002;
    outline: none;
    will-change: opacity;
}
</style>