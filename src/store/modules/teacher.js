const state = {
    coursesTeaching: [],
    students: [],
    assignmentsCreated: [],
    announcementsCreated: [],
    gradingQueue: []
  }
  
  const mutations = {
    SET_TEACHING_COURSES(state, courses) {
      state.coursesTeaching = courses
    },
    SET_STUDENTS(state, students) {
      state.students = students
    },
    SET_ASSIGNMENTS_CREATED(state, assignments) {
      state.assignmentsCreated = assignments
    },
    ADD_ASSIGNMENT(state, assignment) {
      state.assignmentsCreated.push(assignment)
    },
    ADD_TO_GRADING_QUEUE(state, submission) {
      state.gradingQueue.push(submission)
    },
    REMOVE_FROM_GRADING_QUEUE(state, submissionId) {
      state.gradingQueue = state.gradingQueue.filter(s => s.id !== submissionId)
    }
  }
  
  const actions = {
    async fetchTeacherData({ commit, rootState }) {
      // Mock data - replace with actual API calls
      const teacherId = rootState.auth.user?.id
      console.log(`Fetching data for teacher ${teacherId}`)
      const courses = [
        { id: 1, name: 'Mathematics', period: '3rd Period' },
        { id: 2, name: 'Advanced Calculus', period: '5th Period' }
      ]
      
      const students = [
        { id: 101, name: 'John Doe', courseId: 1 },
        { id: 102, name: 'Jane Smith', courseId: 1 }
      ]
      
      const assignments = [
        { id: 1, courseId: 1, title: 'Algebra Homework', dueDate: '2023-12-15' }
      ]
      
      commit('SET_TEACHING_COURSES', courses)
      commit('SET_STUDENTS', students)
      commit('SET_ASSIGNMENTS_CREATED', assignments)
    },
    
    createAssignment({ commit }, assignmentData) {
      return new Promise(resolve => {
        setTimeout(() => {
          const newAssignment = {
            ...assignmentData,
            id: Math.floor(Math.random() * 1000)
          }
          commit('ADD_ASSIGNMENT', newAssignment)
          resolve(newAssignment)
        }, 500)
      })
    },
    
    gradeSubmission({ commit }, { submissionId, grade }) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit('REMOVE_FROM_GRADING_QUEUE', submissionId)
          console.log(`Grading submission ${submissionId} with grade ${grade}`)
          resolve({ success: true })
        }, 500)
      })
    }
    
  }
  
  const getters = {
    studentsByCourse: state => courseId => {
      return state.students.filter(student => student.courseId === courseId)
    },
    assignmentsByCourse: state => courseId => {
      return state.assignmentsCreated.filter(a => a.courseId === courseId)
    },
    ungradedSubmissionsCount: state => {
      return state.gradingQueue.length
    }
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }