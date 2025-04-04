import api from "@/services/api"

const state = {
    courses: [],
    assignments: [],
    grades: {},
    upcomingDeadlines: [],
    announcements: []
  }
  
  const mutations = {
    SET_COURSES(state, courses) {
      state.courses = courses
    },
    SET_ASSIGNMENTS(state, assignments) {
      state.assignments = assignments
    },
    SET_GRADES(state, grades) {
      state.grades = grades
    },
    ADD_UPCOMING_DEADLINE(state, deadline) {
      state.upcomingDeadlines.push(deadline)
    },
    SET_ANNOUNCEMENTS(state, announcements) {
      state.announcements = announcements
    }
  }
  
  const actions = {
    async fetchStudentData({ commit, rootState }) {
      // In a real app, you would fetch this from an API
      const studentId = rootState.auth.user?.id
      console.log(studentId)
      // Mock data - replace with actual API calls
      const courses = [
        { id: 1, name: 'Mathematics', teacher: 'Mr. Smith' },
        { id: 2, name: 'Science', teacher: 'Ms. Johnson' }
      ]
      
      const assignments = [
        { id: 1, courseId: 1, title: 'Algebra Homework', dueDate: '2023-12-15' },
        { id: 2, courseId: 2, title: 'Chemistry Lab Report', dueDate: '2023-12-20' }
      ]
      
      const grades = {
        1: 'A-',
        2: 'B+'
      }
      
      commit('SET_COURSES', courses)
      commit('SET_ASSIGNMENTS', assignments)
      commit('SET_GRADES', grades)
    },
    
    async submitAssignment({ commit }, assignmentData) {
        // Now actually using the parameters
        const result = await api.submitAssignment(assignmentData)
        commit('ADD_ASSIGNMENT', result)
        return result
      }
  }
  
  const getters = {
    upcomingAssignments: state => {
      return state.assignments
        .filter(assignment => new Date(assignment.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    },
    courseGrades: state => {
      return state.courses.map(course => ({
        ...course,
        grade: state.grades[course.id] || 'N/A'
      }))
    }
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }