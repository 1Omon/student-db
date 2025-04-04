export default [
  {
    path: '/teacher',
    name: 'teacher-dashboard',
    component: () => import('@/views/TeacherDashboard.vue'),
    meta: {
      requiresAuth: true,
      allowedRoles: ['teacher'],
      layout: 'TeacherLayout'
    },
    children: [
      {
        path: '', // Default route when accessing /teacher
        name: 'teacher-overview',
        component: () => import('@/views/teacher/Overview.vue')
      },
      {
        path: 'classes',
        name: 'teacher-classes',
        component: () => import('@/views/teacher/Classes.vue')
      },
      {
        path: 'classes/:id',
        name: 'teacher-class-detail',
        component: () => import('@/views/teacher/ClassDetail.vue'),
        props: true
      },
      {
        path: 'attendance',
        name: 'teacher-attendance',
        component: () => import('@/views/teacher/AttendanceForm.vue')
      },
      {
        path: 'manage-class',
        name: 'teacher-manage-class',
        component: () => import('@/views/teacher/ManageClass.vue')
      },
      {
        path: 'grading',
        name: 'teacher-grading',
        component: () => import('@/views/teacher/GradingForm.vue')
      },
      {
        path: 'students',
        name: 'teacher-students',
        component: () => import('@/views/teacher/Students.vue')
      },
      {
        path: 'assignments',
        name: 'teacher-assignments',
        component: () => import('@/views/teacher/Assignments.vue')
      }
    ]
  }
]