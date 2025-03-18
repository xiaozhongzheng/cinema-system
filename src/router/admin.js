export const adminRoutes = {
  path: '/admin',
  name: 'admin',
  component: () => import('../views/admin'),
  redirect: '/admin/home',
  children: [
    {
      path: '/admin/home',
      component: () => import('../views/admin/home'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '个人中心', // 标题
        icon: 'el-icon-s-home' // 图标
      }
    },
    {
      path: '/admin/employee',
      component: () => import('../views/admin/employee'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '员工管理', // 标题
        icon: 'el-icon-user-solid' // 图标
      }
    },
    {
      path: '/admin/screen',
      component: () => import('../views/admin/screen'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '放映厅管理', // 标题
        icon: 'el-icon-c-scale-to-original' // 图标
      }
    },
    {
      path: '/admin/film',
      component: () => import('../views/admin/film'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '影片管理', // 标题
        icon: 'el-icon-bangzhu' // 图标
      }
    },
    // {
    //   path: '/admin/addFilm',
    //   name: 'addFilm',
    //   component: () => import('../views/admin/film/AddFilm.vue'),
    //   hidden: true
    // },
    {
      path: '/admin/orders/show',
      component: () => import('../views/admin/orders/OrdersView.vue'),
      meta: {
        // 路由元信息 用于存储数据的
        title: '查看所有订单', // 标题
        icon: 'el-icon-tickets' // 图标
      }
    },
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

