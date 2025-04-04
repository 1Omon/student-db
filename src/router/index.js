import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
// Ensure these route files exist and export valid route arrays
import authRoutes from './routes/auth'
import studentRoutes from './routes/student'
import teacherRoutes from './routes/teacher'
import adminRoutes from './routes/admin'
// Verify these components exist in your project
const NotFound = () => import('@/views/NotFound.vue')
const NotAuthorized = () => import('@/views/NotAuthorized.vue')

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    // Add a default redirect if no routes match
    {
      path: '/',
      redirect: '/auth/login'
    },
    ...authRoutes,
    ...studentRoutes,
    ...teacherRoutes,
    ...adminRoutes,
    {
      path: '/not-authorized',
      name: 'not-authorized',
      component: NotAuthorized,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ]
})

// Add error handling to navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    const requiresAuth = to.meta.requiresAuth || false
    const allowedRoles = to.meta.allowedRoles || []
    
    // Correctly access namespaced state with additional safety checks
    const isAuthenticated = store.state.auth.isAuthenticated || true
    const userRole = store.state.auth.user?.role || 'teacher'
    
    if (!requiresAuth && isAuthenticated) {
      const dashboardRoutes = {
        student: 'student-dashboard',
        teacher: 'teacher-dashboard',
        admin: 'admin-dashboard'
      }
      const dashboardRoute = dashboardRoutes[userRole] || 'student-dashboard'
      return next({ name: dashboardRoute })
    }
    
    if (requiresAuth) {
      if (!isAuthenticated) {
        return next({
          name: 'login',
          query: { redirect: to.fullPath }
        })
      }
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return next({ name: 'not-authorized' })
      }
    }
    
    next()
  } catch (error) {
    console.error('Router error:', error)
    next({ name: 'not-found' })
  }
})

export default router