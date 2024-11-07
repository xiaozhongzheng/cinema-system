import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/login/LoginView.vue'

Vue.use(VueRouter)
let roleId = localStorage.getItem('roleId');

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      if (roleId == 0) {
        // 重定向到/user页面
        next('/user')
      } else {
        // 重定向到/admin页面
        next('/admin')
      }
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/user/register/RegisterView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/MainView.vue'),
    redirect: '/admin/home',
    children: [
      {
        path: '/admin/home',
        component: () => import('../views/admin/home')
      },
      {
        path: '/admin/employee',
        component: () => import('../views/admin/employee')
      },
      {
        path: '/admin/screen',
        component: () => import('../views/admin/screen')
      },
      {
        path: '/admin/film',
        component: () => import('../views/admin/film')
      },
      {
        path: '/admin/addFilm',
        name: 'addFilm',
        component: () => import('../views/admin/film/AddFilm.vue')
      },
      {
        path: '/admin/orders/show',
        component: () => import('../views/admin/orders/OrdersView.vue')
      },
      {
        path: '/employee/schedule',
        component: () => import('../views/admin/schedule/index.vue')
      },
      {
        path: '/employee/query/allSchedule',
        component: () => import('../views/admin/schedule/ScheduleView.vue')
      },


    ]
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user/MainView.vue'),
    redirect: '/user/home',
    children: [
      {
        path: '/user/home',
        component: () => import('../views/user/home/HomeView.vue')
      },
      {
        path: '/user/movies',
        name: 'movies',
        component: () => import('../views/user/all_movie/MoviesView.vue')
      },
      {
        path: '/user/showDetail',
        name: 'showDetail',
        component: () => import('../views/user/show/ShowFilmDetailView.vue')
      },
      {
        path: '/user/buyFilm',
        name: 'buy',
        component: () => import('../views/user/buy/BuyFilmView.vue')
      },
      {
        path: '/user/chooseSeat',
        name: 'chooseSeat',
        component: () => import('../views/user/buy/ChooseSeatView.vue')
      },
      {
        path: '/user/me',
        component: () => import('../views/user/me/MyView.vue'),
        children: [
          {
            path: '/user/me/cart',
            component: () => import('../views/user/me/CartView.vue')
          },
          {
            path: '/user/me/order',
            component: () => import('../views/user/me/OrderView.vue')
          },
          {
            path: '/user/me/detail',
            component: () => import('../views/user/me/MyDetailView.vue')
          }
        ]
      }

    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404/404View.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }

]

const router = new VueRouter({
  routes
})

// 防止跳转到相同路由时报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


router.beforeEach((to, from, next) => {
  let role = localStorage.getItem('roleId');
  if (role == 0 && (to.path.includes('admin') || to.path.includes('employee'))) {
    // 当用户访问管理员或员工的页面时，会跳转到该页面
    next('/404');

  } else if (role == 1 && to.path.includes('user')) {
    // 当用户访问管理员或员工的页面时，会跳转到该页面
    next('/404');

  } else if (role == 2 &&  to.path.includes('user')) {
    // 当用户访问管理员或员工的页面时，会跳转到该页面
    next('/404');

  } else {
    next();
  }
})

export default router
