const state = {
    isAuthenticated: false,
    user: null // will contain { id, name, role, email, etc. }
  }
  
  const mutations = {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    LOGOUT(state) {
      state.user = null
      state.isAuthenticated = false
    }
  }
  
  const actions = {
    login({ commit }, userData) {
      // In a real app, you would call an API here
      return new Promise((resolve) => {
        // Mock authentication
        setTimeout(() => {
          commit('SET_USER', userData)
          resolve(userData)
        }, 500)
      })
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
    // Add initialization action to ensure auth state is ready
    initAuth({ commit }) {
      // You could check localStorage for saved tokens here
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          commit('SET_USER', user)
        } catch (e) {
          localStorage.removeItem('user')
        }
      }
    }
  }
  
  const getters = {
    currentUser: state => state.user,
    isStudent: state => state.user?.role === 'student',
    isTeacher: state => state.user?.role === 'teacher',
    isAdmin: state => state.user?.role === 'admin'
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }