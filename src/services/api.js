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
  // Auth endpoints
  login(credentials) {
    return api.post('/auth/login', credentials)
  },

  // Student endpoints
  getStudentGrades(studentId) {
    return api.get(`/students/${studentId}/grades`)
  },
  
  getStudentAttendance(studentId) {
    return api.get(`/students/${studentId}/attendance`)
  },
  
  getStudentFees(studentId) {
    return api.get(`/students/${studentId}/fees`)
  },
  
  getStudentDashboardSummary(studentId) {
    return api.get(`/students/${studentId}/summary`)
  },

  // Teacher endpoints - Classes
  getTeacherClasses(teacherId) {
    return api.get(`/teachers/${teacherId}/classes`)
  },
  
  getClassStudents(className) {
    return api.get(`/teachers/classes/${className}`)
  },
  
  getClassPerformance(className) {
    return api.get(`/teachers/classes/${className}/performance`)
  },

  // Teacher endpoints - Students
  getStudentDetails(studentId) {
    return api.get(`/teachers/students/${studentId}`)
  },

  // Teacher endpoints - Grades
  submitGrade(data) {
    return api.post('/grades', data)
  },
  
  submitBulkGrades(data) {
    return api.post('/grades/bulk', data)
  },
  
  submitBulkCourseGrades(data) {
    return api.post('/teachers/grades/bulk', data)
  },
  
  getAssignmentGrades(assignmentId) {
    return api.get(`/assignments/${assignmentId}/grades`)
  },

  // Teacher endpoints - Attendance
  submitBulkAttendance(data) {
    return api.post('/teachers/attendance/bulk', data)
  },

  // Teacher endpoints - Assignments
  createAssignment(data) {
    return api.post('/assignments', data)
  },
  
  getClassAssignments(classId) {
    return api.get(`/classes/${classId}/assignments`)
  },

  // Utility methods
  getErrorMessage(error) {
    if (error.response) {
      return error.response.data.message || 'Server responded with an error'
    } else if (error.request) {
      return 'No response received from server'
    } else {
      return 'Error setting up the request'
    }
  }
}