
<!-- Teacher Marks Component -->
<template>
    <div>
      <h2>Marks</h2>
      <form @submit.prevent="addMark">
        <input v-model="student_id" placeholder="Student ID" required />
        <input v-model="course" placeholder="Course" required />
        <input v-model="score" type="number" placeholder="Score" required />
        <button type="submit">Submit</button>
      </form>
      <ul>
        <li v-for="mark in marks" :key="mark.id">
          {{ mark.student_id }} - {{ mark.course }} - {{ mark.score }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        student_id: '',
        course: '',
        score: '',
        marks: []
      };
    },
    methods: {
      async addMark() {
        await axios.post("http://localhost:3000/grades", {
          student_id: this.student_id,
          course: this.course,
          score: this.score,
        });
        this.fetchMarks();
      },
      async fetchMarks() {
        const response = await axios.get("http://localhost:3000/grades");
        this.marks = response.data;
      }
    },
    mounted() {
      this.fetchMarks();
    }
  };
  </script>
  