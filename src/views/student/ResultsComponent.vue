<template>
  <div class="results-view">
    <div class="header">
      <h2>My Results</h2>
      <div class="filters">
        <select v-model="selectedTerm">
          <option value="">All Terms</option>
          <option v-for="term in terms" :key="term.id" :value="term.id">
            {{ term.name }}
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

    <div class="results-summary">
      <div class="summary-card">
        <h4>Overall Average</h4>
        <div class="big-number">{{ overallAverage }}%</div>
        <div class="grade">{{ overallGrade }}</div>
      </div>

      <div class="summary-card">
        <h4>Best Subject</h4>
        <div class="big-number">{{ bestSubject.score }}%</div>
        <div class="subject">{{ bestSubject.name }}</div>
      </div>

      <div class="summary-card">
        <h4>Class Rank</h4>
        <div class="big-number">{{ student.classRank }}</div>
        <div class="total">of {{ student.classSize }}</div>
      </div>
    </div>

    <div class="results-table">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Assignment</th>
            <th>Date</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in filteredResults" :key="result.id">
            <td>{{ result.subject }}</td>
            <td>{{ result.assignment }}</td>
            <td>{{ formatDate(result.date) }}</td>
            <td>{{ result.score }} / {{ result.totalPoints }}</td>
            <td :class="['grade', result.grade.toLowerCase()]">
              {{ result.grade }}
            </td>
            <td>{{ result.feedback || "--" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Student data with results
const student = ref({
  classRank: 12,
  classSize: 45,
  results: [
    { 
      id: 1, 
      subject: 'Mathematics', 
      assignment: 'Midterm Exam', 
      date: '2023-11-15', 
      score: 92, 
      totalPoints: 100, 
      grade: 'A', 
      feedback: 'Excellent work!' 
    },
    { 
      id: 2, 
      subject: 'Science', 
      assignment: 'Midterm Exam', 
      date: '2023-11-17', 
      score: 87, 
      totalPoints: 100, 
      grade: 'B+', 
      feedback: 'Good understanding of concepts' 
    },
    { 
      id: 3, 
      subject: 'English', 
      assignment: 'Essay #1', 
      date: '2023-11-10', 
      score: 45, 
      totalPoints: 50, 
      grade: 'A-', 
      feedback: 'Well structured arguments' 
    },
    { 
      id: 4, 
      subject: 'History', 
      assignment: 'Research Paper', 
      date: '2023-12-05', 
      score: 38, 
      totalPoints: 50, 
      grade: 'A-', 
      feedback: 'Thorough research' 
    },
    { 
      id: 5, 
      subject: 'Mathematics', 
      assignment: 'Final Exam', 
      date: '2023-12-20', 
      score: 88, 
      totalPoints: 100, 
      grade: 'B+', 
      feedback: 'Watch for calculation errors' 
    }
  ]
});

// Terms data
const terms = ref([
  { id: 't1', name: 'Term 1' },
  { id: 't2', name: 'Term 2' },
  { id: 't3', name: 'Term 3' }
]);

const selectedTerm = ref('');
const selectedSubject = ref('');

// Computed properties
const subjects = computed(() => {
  const uniqueSubjects = new Set();
  student.value.results.forEach(result => uniqueSubjects.add(result.subject));
  return Array.from(uniqueSubjects);
});

const filteredResults = computed(() => {
  return student.value.results.filter(result => {
    const termMatch = !selectedTerm.value || true; // Implement term filtering if needed
    const subjectMatch = !selectedSubject.value || result.subject === selectedSubject.value;
    return termMatch && subjectMatch;
  });
});

const overallAverage = computed(() => {
  if (filteredResults.value.length === 0) return 0;
  const total = filteredResults.value.reduce((sum, result) => {
    return sum + (result.score / result.totalPoints) * 100;
  }, 0);
  return Math.round(total / filteredResults.value.length);
});

const overallGrade = computed(() => {
  const avg = overallAverage.value;
  if (avg >= 90) return 'A';
  if (avg >= 80) return 'B';
  if (avg >= 70) return 'C';
  if (avg >= 60) return 'D';
  return 'F';
});

const bestSubject = computed(() => {
  if (filteredResults.value.length === 0) return { name: '--', score: '--' };
  
  const subjectScores = {};
  
  filteredResults.value.forEach(result => {
    if (!subjectScores[result.subject]) {
      subjectScores[result.subject] = { total: 0, count: 0 };
    }
    subjectScores[result.subject].total += (result.score / result.totalPoints) * 100;
    subjectScores[result.subject].count++;
  });

  let bestSubject = '';
  let highestAvg = 0;

  for (const subject in subjectScores) {
    const avg = subjectScores[subject].total / subjectScores[subject].count;
    if (avg > highestAvg) {
      highestAvg = avg;
      bestSubject = subject;
    }
  }

  return { 
    name: bestSubject, 
    score: Math.round(highestAvg) 
  };
});

const hasResults = computed(() => filteredResults.value.length > 0);
console.log(hasResults)

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
</script>

<style scoped>
.results-view {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.summary-card h4 {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.big-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3a4a6b;
  margin: 0.5rem 0;
}

.grade {
  font-size: 1.25rem;
  font-weight: bold;
}

.subject,
.total {
  color: #666;
}

.results-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.results-table table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th,
.results-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.results-table th {
  background: #f8f9fa;
  font-weight: 500;
  color: #555;
}

.results-table tr:hover {
  background: #f8f9fa;
}

.grade {
  font-weight: bold;
}

.grade.a {
  color: #4caf50;
}

.grade.b {
  color: #2196f3;
}

.grade.c {
  color: #ffc107;
}

.grade.d {
  color: #ff9800;
}

.grade.f {
  color: #f44336;
}

.chart-container {
  margin-top: 2rem;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.chart-container h3 {
  margin-bottom: 1rem;
  color: #3a4a6b;
}

.chart-placeholder {
  height: 300px;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style>