export default [
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin'],
        layout: 'AdminLayout'
      }
    }
  ]