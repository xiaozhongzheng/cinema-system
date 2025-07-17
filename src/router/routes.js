import store from '@/store'
import { adminRoutes } from './admin';
import { userRoutes } from './user';
import { employeeRoutes } from './employee';
import constant from '@/utils/global-constant'
export const routes = [
  {
    path: '/',
    redirect: constant.rolePathArr[store.getters.roleId],
    hidden: true
    // beforeEnter: (to, from, next) => {
    //   if (roleId == 0) {
    //     // 重定向到/user页面
    //     next('/user')
    //   } else {
    //     // 重定向到/admin页面
    //     next('/admin')
    //   }
    // },
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import('../views/login'),
  },
  {
    path: '/register',
    name: 'register',
    hidden: true,
    component: () => import('../views/user/register')
  },
  {
    path: '/test',
    name: 'test',
    hidden: true,
    component: () => import('../views/test')
  },
  {
    path: '/404',
    hidden: true,
    component: () => import('@/views/404/404View.vue')
  },
  adminRoutes,
  employeeRoutes,
  userRoutes,
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }

]
