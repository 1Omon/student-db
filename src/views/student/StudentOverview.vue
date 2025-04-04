<template>
  <div class="overview-container">
    <h2>Welcome back, {{ studentName }}!</h2>
    <div class="summary-section">
      <h3>Recent Activity</h3>
      <div class="recent-results">
        <h4>Latest Results</h4>
        <div v-for="(result, index) in recentResults" :key="index" class="result-item">
          <div class="subject">{{ result.subject }}</div>
          <div class="grade">{{ result.grade }}</div>
          <div class="score">{{ result.score }}%</div>
          <div class="date">{{ formatDate(result.date) }}</div>
        </div>
      </div>
      
      <div class="recent-attendance">
        <h4>Recent Attendance</h4>
        <div v-for="(record, index) in attendanceRecords" :key="index" class="attendance-item">
          <div class="date">{{ formatDate(record.date) }}</div>
          <div :class="['status', record.status]">{{ capitalize(record.status) }}</div>
          <div class="subject">{{ record.subject }}</div>
          <div v-if="record.reason" class="reason">{{ record.reason }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props to receive student data from parent component
const props = defineProps({
  student: {
    type: Object,
    required: true
  }
});

const studentName = computed(() => props.student.name.split(' ')[0]);
const recentResults = computed(() => props.student.recentResults || []);
const attendanceRecords = computed(() => props.student.attendanceRecords || []);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>

<style scoped>
.overview-container {
  padding: 1rem 0;
}

.summary-section {
  margin-top: 1.5rem;
}

.recent-results, .recent-attendance {
  margin-top: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

h4 {
  margin-bottom: 1rem;
  color: #3a4a6b;
}

.result-item, .attendance-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.result-item:last-child, .attendance-item:last-child {
  border-bottom: none;
}

.subject {
  flex: 1;
  font-weight: 500;
}

.grade, .status {
  width: 60px;
  text-align: center;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.grade {
  background: #e3f2fd;
  color: #2196f3;
}

.score {
  width: 60px;
  text-align: right;
}

.date {
  width: 120px;
  color: #666;
  text-align: right;
}

.status.present {
  background: #e8f5e9;
  color: #4caf50;
}

.status.absent {
  background: #ffebee;
  color: #f44336;
}

.reason {
  margin-left: 1rem;
  font-style: italic;
  color: #666;
}
</style>