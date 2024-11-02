import axios from 'axios'
// import store from '@/store'
import { Message } from 'element-ui'
import { logout } from '@/api/user'
import router from '@/router'

// 创建并初始化axios实例
const service = axios.create({
  baseURL: '/api', // 基础地址
  timeout: 10000 // 请求时间超过10s就失败
})
// 公共接口的路径
const commonList = ['/login','/upload','/logout','/password']
const urlList = ['/user','/employee','/admin']
// 请求拦截器
service.interceptors.request.use((config) => {
  if(!commonList.includes(config.url)){
    // 非公共路径
    console.log(config.baseURL)
    config.baseURL+=urlList[localStorage.getItem('roleId')]
  }
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
  } else {
    // 登录失败，提示错误信息
    Message({
      type: 'error',
      message: message
    })
    // return Promise.reject(message)

  }
  // 请求失败后data的值是null
  return data

}, async (error) => {
  if (error.response.status === 401) {
    // 表示token过期了,让用户退出登录
    await logout({
      roleId: localStorage.getItem('roleId'),
      userId: localStorage.getItem('id')
    })
    // 清空本地存储的数据
    localStorage.clear();
    Message({
      type: 'error',
      message: '登录过期了，请重新登录'
    })
    router.push("/login");
    return
  }else if(error.response.status === 500){
    Message({
      type: 'error',
      message: '服务器出错啦'
    })
    return

  }
  Message({
    type: 'error',
    message: error.message
  })
  return Promise.reject(error)
})



export default service