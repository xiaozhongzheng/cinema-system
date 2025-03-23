import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { debounce } from './optimization'
// 创建并初始化axios实例
const service = axios.create({
  baseURL: '/api', // 基础地址
  timeout: 10000 // 请求时间超过10s就失败
})

// 请求拦截器
service.interceptors.request.use((config) => {
  const token = store.getters.token || '';
  // 将token放在请求头中
  if (token) {
    config.headers.Authorization = token
  }
  return Promise.resolve(config)
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((res) => {
  if(res.data instanceof Blob) return res
  const { data, message, code } = res.data
  if (code === 1) {
    // 表示响应成功
    return data

  } else {
    // 登录失败，提示错误信息
    Message({
      type: 'error',
      message: message
    })
    return Promise.reject(new Error(message))

  }

}, async (error) => {
  let msg = error.message
  let status = error.response.status
  if (status === 401) {
    // 表示token过期了,清空用户信息并跳转到登录页面
    const data = {
      roleId: store.getters.roleId,
      userId: store.getters.userId
    }
    await store.dispatch('logout',data)
    msg = '登录过期了，请重新登录'
    router.push("/login");

  } else if (status >= 500) {
    msg = '服务器出错啦'
  }else if (status>=400){
    msg = '客户端请求有误'
  }
  Message({
    type: 'error',
    message: msg
  })
  return Promise.reject(error)
})



export default service
