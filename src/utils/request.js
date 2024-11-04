import axios from 'axios'
// import store from '@/store'
import { Message } from 'element-ui'
import { logout } from '@/api/common'
import router from '@/router'

// 创建并初始化axios实例
const service = axios.create({
  baseURL: '/api', // 基础地址
  timeout: 10000 // 请求时间超过10s就失败
})
// 公共接口的路径
const commonList = ['/login', '/upload', '/logout', '/password']
const urlList = ['/user', '/employee', '/admin']
// 请求拦截器
service.interceptors.request.use((config) => {
  // if (!commonList.includes(config.url)) {
  //   // 非公共路径
  //   config.baseURL += urlList[localStorage.getItem('roleId')]
  // }
  const token = localStorage.getItem('token')
  // 将token放在请求头中
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})



// 响应拦截器
service.interceptors.response.use((res) => {
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
    await logout({
      roleId: localStorage.getItem('roleId'),
      userId: localStorage.getItem('id')
    })
    // 清空本地存储的数据
    localStorage.clear();

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