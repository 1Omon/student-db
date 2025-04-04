<template>
  <div class="attendance-view">
    <div class="header">
      <h2>My Attendance</h2>
      <div class="filters">
        <select v-model="selectedMonth">
          <option value="">All Months</option>
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
        <select v-model="selectedSubject">
          <option value="">All Subjects</option>
          <option v-for="subject in subjects" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="attendance-summary">
      <div class="summary-card">
        <h4>Overall Attendance</h4>
        <div class="progress-circle" :style="attendanceStyle">
          <span>{{ student.attendancePercentage }}%</span>
        </div>
        <p>Present {{ student.daysPresent }}/{{ student.totalDays }}</p>
      </div>
      
      <div class="summary-card">
        <h4>Current Month</h4>
        <div class="progress-circle" :style="currentMonthAttendanceStyle">
          <span>{{ currentMonthAttendance }}%</span>
        </div>
        <p>Present {{ currentMonthPresent }}/{{ currentMonthTotal }}</p>
      </div>
      
      <div class="summary-card">
        <h4>Recent Absences</h4>
        <div class="absences-list">
          <div v-for="absence in recentAbsences" :key="absence.date" class="absence-item">
            <div class="date">{{ formatDate(absence.date) }}</div>
            <div class="subject">{{ absence.subject }}</div>
            <div class="reason">{{ absence.reason || 'No reason provided' }}</div>
          </div>
          <div v-if="recentAbsences.length === 0" class="no-absences">
            No recent absences
          </div>
        </div>
      </div>
    </div>
    
    <div class="attendance-calendar">
      <h3>Attendance Calendar</h3>
      <div class="calendar-placeholder">
        <p>Calendar view would display here with color-coded attendance</p>
      </div>
    </div>
    
    <div class="attendance-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.date + record.subject">
            <td>{{ formatDate(record.date) }}</td>
            <td>{{ record.subject }}</td>
            <td :class="record.status">{{ capitalizeStatus(record.status) }}</td>
            <td>{{ record.reason || '--' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Dummy data - replace with API calls later
const student = ref({
  attendancePercentage: 85,
  daysPresent: 85,
  totalDays: 100,
  attendanceRecords: [
    { date: '2023-12-15', subject: 'Mathematics', status: 'present' },
    { date: '2023-12-14', subject: 'Science', status: 'absent', reason: 'Sick' },
    { date: '2023-12-13', subject: 'English', status: 'present' },
    { date: '2023-12-12', subject: 'History', status: 'present' },
    { date: '2023-12-11', subject: 'Mathematics', status: 'absent', reason: 'Family event' },
    { date: '2023-12-08', subject: 'Science', status: 'present' },
    { date: '2023-12-07', subject: 'English', status: 'present' },
    { date: '2023-12-06', subject: 'Physical Education', status: 'absent', reason: 'Injury' },
    { date: '2023-12-05', subject: 'Mathematics', status: 'present' },
    { date: '2023-12-04', subject: 'Science', status: 'present' }
  ]
})

const months = ref([
  { value: '2023-12', label: 'December 2023' },
  { value: '2023-11', label: 'November 2023' },
  { value: '2023-10', label: 'October 2023' }
])

const selectedMonth = ref('')
const selectedSubject = ref('')

const subjects = computed(() => {
  const uniqueSubjects = new Set()
  student.value.attendanceRecords.forEach(record => uniqueSubjects.add(record.subject))
  return Array.from(uniqueSubjects)
})

const filteredRecords = computed(() => {
  return student.value.attendanceRecords.filter(record => {
    const monthMatch = !selectedMonth.value || 
      record.date.startsWith(selectedMonth.value)
    const subjectMatch = !selectedSubject.value || 
      record.subject === selectedSubject.value
    return monthMatch && subjectMatch
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
})

const recentAbsences = computed(() => {
  return student.value.attendanceRecords
    .filter(record => record.status === 'absent')
    .slice(0, 3)
})

const currentMonthRecords = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  return student.value.attendanceRecords.filter(
    record => record.date.startsWith(currentMonth)
  )
})

const currentMonthPresent = computed(() => {
  return currentMonthRecords.value.filter(
    record => record.status === 'present'
  ).length
})

const currentMonthTotal = computed(() => currentMonthRecords.value.length)

const currentMonthAttendance = computed(() => {
  if (currentMonthTotal.value === 0) return 0
  return Math.round((currentMonthPresent.value / currentMonthTotal.value) * 100)
})

const attendanceStyle = computed(() => {
  const percentage = student.value.attendancePercentage
  const color = percentage >= 90 ? '#4CAF50' : percentage >= 75 ? '#FFC107' : '#F44336'
  return {
    '--percentage': `${percentage}%`,
    '--color': color
  }
})

const currentMonthAttendanceStyle = computed(() => {
  const percentage = currentMonthAttendance.value
  const color = percentage >= 90 ? '#4CAF50' : percentage >= 75 ? '#FFC107' : '#F44336'
  return {
    '--percentage': `${percentage}%`,
    '--color': color
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'short', month: 'short', day: 'numeric' 
  })
}

const capitalizeStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

/*
// API Integration Example (commented out)
import { useStudentStore } from '@/stores/student'

const studentStore = useStudentStore()

onMounted(async () => {
  try {
    await studentStore.fetchAttendanceRecords()
    student.value.attendanceRecords = studentStore.attendanceRecords
    student.value.attendancePercentage = studentStore.attendancePercentage
    student.value.daysPresent = studentStore.daysPresent
    student.value.totalDays = studentStore.totalDays
  } catch (error) {
    console.error('Failed to fetch attendance records:', error)
  }
})
*/
</script>

<style scoped>
.attendance-view {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  min-width: 180px;
}

.attendance-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.summary-card h4 {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
}

.progress-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: conic-gradient(var(--color) var(--percentage), #eee 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
}

.progress-circle span {
  position: relative;
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--color);
}

.summary-card p {
  text-align: center;
  color: #666;
  margin-top: 0.5rem;
}

.absences-list {
  margin-top: 1rem;
}

.absence-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.absence-item:last-child {
  border-bottom: none;
}

.date {
  font-weight: 500;
}

.subject {
  font-size: 0.875rem;
  color: #666;
}

.reason {
  font-size: 0.875rem;
  color: #999;
  font-style: italic;
}

.no-absences {
  color: #666;
  text-align: center;
  padding: 1rem 0;
}

.attendance-calendar {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.attendance-calendar h3 {
  margin-bottom: 1rem;
  color: #3a4a6b;
}

.calendar-placeholder {
  height: 300px;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.attendance-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.attendance-table table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th, 
.attendance-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.attendance-table th {
  background: #f8f9fa;
  font-weight: 500;
  color: #555;
}

.attendance-table tr:hover {
  background: #f8f9fa;
}

.attendance-table .present {
  color: #4CAF50;
  font-weight: 500;
}

.attendance-table .absent {
  color: #F44336;
  font-weight: 500;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filters {
    width: 100%;
  }
  
  .filters select {
    width: 100%;
  }
  
  .attendance-summary {
    grid-template-columns: 1fr;
  }
}
</style>