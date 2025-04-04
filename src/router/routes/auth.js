import AuthLayout from '@/views/auth/AuthLayout.vue'

export default [
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresAuth: false },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/UserLogin.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/UserRegister.vue')
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPassword.vue')
      }
    ]
  }
]