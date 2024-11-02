import axios from 'axios'
// import store from '@/store'
import {Message} from 'element-ui'
// 创建并初始化axios实例
const service = axios.create({ 
  baseURL: '/api', // 基础地址
  timeout: 10000 // 请求时间超过10s就失败
})

// 请求拦截器
service.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  // 将token放在请求头中
  if(token){
    config.headers.Authorization = token
  }
  return config
},(error)=>{
  // 失败执行promise
  return Promise.reject(error)
})



// 响应拦截器
service.interceptors.response.use((res)=>{
  const {data,message,code} = res.data
  if(code === 1){
    // 表示响应成功
    if(message){
      Message({
        type: 'success',
        message: message
      })
    }
    return data
  }else{
    
    Message({
      type: 'error',
      message: message
    })
    return Promise.reject(message)
    // return res;
  }
},(error)=>{
  if(error.response.status === 401){
    // 表示token过期了,让用户退出登录
    
  }
  Message({
    type: 'error',
    message: error.message
  })
  return Promise.reject(error)
})



export default service