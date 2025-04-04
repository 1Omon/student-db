// export default [
//     {
//       path: '/student',
//       name: 'student-dashboard',
//       component: () => import('@/views/StudentDashboard.vue'),
//       meta: {
//         requiresAuth: true,
//         allowedRoles: ['student'],
//         layout: 'StudentLayout' // For layout components
//       },
//       children: [
//         {
//           path: 'courses',
//           component: () => import('@/views/student/Courses.vue')
//         },
//         {
//           path: 'grades',
//           component: () => import('@/views/student/Grades.vue')
//         }
//       ]
//     }
//   ]


export default [
  {
    path: '/student',
    name: 'student-dashboard',
    component: () => import('@/views/StudentDashboard.vue'),
    meta: {
      requiresAuth: true,
      allowedRoles: ['student'],
      layout: 'StudentLayout' // For layout components
    },
    children: [
      {
        path: '',
        redirect: { name: 'student-overview' }
      },
      {
        path: 'overview',
        name: 'student-overview',
        component: () => import('@/views/student/StudentOverview.vue')
      },
      {
        path: 'courses',
        name: 'student-courses',
        component: () => import('@/views/student/Courses.vue')
      },
      {
        path: 'grades',
        name: 'student-grades',
        component: () => import('@/views/student/Grades.vue')
      },
      {
        path: 'attendance',
        name: 'student-attendance',
        component: () => import('@/views/student/AttendanceComponent.vue')
      },
      {
        path: 'fees',
        name: 'student-fees',
        component: () => import('@/views/student/FeesComponent.vue')
      },
      {
        path: 'results',
        name: 'student-results',
        component: () => import('@/views/student/ResultsComponent.vue')
      }
    ]
  }
]