import { createStore } from 'vuex'
import auth from './modules/auth'
import student from './modules/student'
import teacher from './modules/teacher'

export default createStore({
  modules: {
    auth,
    student,
    teacher
  },
  // Add a global state initialization to ensure state exists before the router uses it
  state: {
    initialized: true
  }
})