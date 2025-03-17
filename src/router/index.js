import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { routes } from './routes';
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes
})

// 防止跳转到相同路由时报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



const whiteList = ['/login','/404','/register']
router.beforeEach(async (to, from, next) => {
  const token = store.getters.token
  const roleId = store.getters.roleId
  if(to.path === '/404'){
    next()
    return
  }
  if(token){ // 用户存在token
    const flag = (roleId === 0 && to.path.includes('/admin')) || (roleId !== 0 && to.path.includes('/user'))
    if(flag){
      // 防止 用户访问管理端页面或管理端访问用户端页面
      next('/404')
    }
    else if(to.path === '/login' || to.path === '/register'){
      roleId === 0 ? next('/user') : next('/admin')
    }else{
      // 在每一次路由跳转前，获取用户的信息
      await store.dispatch('getUserInfoByRoleId',store.getters.roleId)
      next()
    }
  }else{
    // 用户不存在token，则跳转到登录页面
    if(whiteList.includes(to.path)){
      next()
    }else{
      next('/login')
    }
  }
})



export default router
