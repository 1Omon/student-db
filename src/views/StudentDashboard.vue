// Dashboard.vue - Parent container component that holds your template
<template>
  <div class="student-dashboard">
    <!-- Side Navigation -->
    <aside class="sidebar">
      <div class="profile-card">
        <div class="avatar">
          <img :src="student.avatar || defaultAvatar" alt="Student Avatar" />
        </div>
        <h3>{{ student.name }}</h3>
        <p class="text-muted">{{ student.class }} • {{ student.id }}</p>
      </div>

      <nav>
        <router-link to="/student/overview" active-class="active" exact-active-class="active">
          <i class="icon-dashboard"></i> Overview
        </router-link>
        <router-link to="/student/results" active-class="active" exact-active-class="active">
          <i class="icon-results"></i> Results
        </router-link>
        <router-link to="/student/attendance" active-class="active" exact-active-class="active">
          <i class="icon-attendance"></i> Attendance
        </router-link>
        <router-link to="/student/fees" active-class="active" exact-active-class="active">
          <i class="icon-fees"></i> Fee Status
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <router-view :student="student"></router-view>
    </main>

    <!-- Quick Stats Panel -->
    <div class="stats-panel">
      <div class="stat-card">
        <h4>Attendance</h4>
        <div class="progress-circle" :style="attendanceStyle">
          <span>{{ student.attendancePercentage }}%</span>
        </div>
        <p>Present {{ student.daysPresent }}/{{ student.totalDays }}</p>
      </div>

      <div class="stat-card">
        <h4>Overall Grade</h4>
        <div class="grade-display">
          {{ student.overallGrade || "--" }}
        </div>
        <p>Rank: {{ student.classRank }}/{{ student.classSize }}</p>
      </div>

      <div class="stat-card">
        <h4>Fee Status</h4>
        <div :class="['fee-status', student.feeStatus]">
          {{ capitalize(student.feeStatus) }}
        </div>
        <p v-if="student.feeDueDate">Due: {{ formatDate(student.feeDueDate) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import defaultAvatar from "@/assets/default-avatar.jpg";

// Helper methods
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Dummy data - replace with API calls later
const student = ref({
  id: "STU2023001",
  name: "Alex Johnson",
  class: "Grade 10 - A",
  avatar: "",
  attendancePercentage: 85,
  daysPresent: 85,
  totalDays: 100,
  overallGrade: "A-",
  classRank: 12,
  classSize: 45,
  feeStatus: "paid", // 'paid', 'pending', 'overdue'
  feeDueDate: "15 Jan 2024",
  recentResults: [
    { subject: "Mathematics", grade: "A", score: 92, date: "2023-12-15" },
    { subject: "Science", grade: "B+", score: 87, date: "2023-12-15" },
    { subject: "English", grade: "A-", score: 90, date: "2023-12-10" },
  ],
  attendanceRecords: [
    { date: "2023-12-15", status: "present", subject: "Mathematics" },
    {
      date: "2023-12-14",
      status: "absent",
      subject: "Science",
      reason: "Sick",
    },
    { date: "2023-12-13", status: "present", subject: "English" },
  ],
});

const attendanceStyle = computed(() => {
  const percentage = student.value.attendancePercentage;
  const color =
    percentage >= 90 ? "#4CAF50" : percentage >= 75 ? "#FFC107" : "#F44336";
  return {
    "--percentage": `${percentage}%`,
    "--color": color,
  };
});
</script>

<style scoped>
/* The CSS from your original template */
.student-dashboard {
  display: grid;
  grid-template-columns: 240px calc(100vw - 520px) 280px;
  min-height: 100vh;
  background-color: #f8f9fa;
}


.sidebar {
  background: linear-gradient(135deg, #3a4a6b 0%, #2c3e50 100%);
  color: white;
  padding: 2rem 1rem;
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

.main-content {
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  margin: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stats-panel {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.progress-circle {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: conic-gradient(var(--color) var(--percentage), #eee 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: "";
  position: absolute;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
}

.progress-circle span {
  position: relative;
  font-weight: bold;
  color: var(--color);
}

.grade-display {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3a4a6b;
  margin: 0.5rem 0;
}

.fee-status {
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.fee-status.paid {
  background: #e8f5e9;
  color: #4caf50;
}

.fee-status.pending {
  background: #fff8e1;
  color: #ffc107;
}

.fee-status.overdue {
  background: #ffebee;
  color: #f44336;
}
</style>