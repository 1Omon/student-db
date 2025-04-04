// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  // Student endpoints
  getStudentDashboard() {
    return api.get('/student/dashboard')
  },
  getStudentResults() {
    return api.get('/student/results')
  },
  
  // Teacher endpoints
  getTeacherClasses() {
    return api.get('/teacher/classes')
  },
  submitAttendance(data) {
    return api.post('/attendance', data)
  },
  
  // Shared endpoints
  login(credentials) {
    return api.post('/auth/login', credentials)
  }
}