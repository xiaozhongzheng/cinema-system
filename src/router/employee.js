export const employeeRoutes = {
  path: '/employee',
  name: 'employee',
  component: () => import('../views/admin'),
  redirect: '/employee/home',
  children: [
    {
      path: '/employee/home',
      component: () => import('../views/admin/home'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '个人中心', // 标题
        icon: 'el-icon-s-home' // 图标
      }
    },
    {
      path: '/employee/schedule',
      component: () => import('../views/admin/schedule/index.vue'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '我的排片', // 标题
        icon: 'el-icon-s-help' // 图标
      }
    },
    {
      path: '/employee/query/allSchedule',
      component: () => import('../views/admin/schedule/ScheduleView.vue'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '查看所有排片', // 标题
        icon: 'el-icon-s-data' // 图标
      }
    },
    {
      path: '/employee/screen',
      component: () => import('../views/admin/screen'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '放映厅信息', // 标题
        icon: 'el-icon-c-scale-to-original' // 图标
      }
    },
    {
      path: '/employee/film',
      component: () => import('../views/admin/film'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '影片排片', // 标题
        icon: 'el-icon-bangzhu' // 图标
      }
    },
  ]
}
