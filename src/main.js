import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载element组件库
import ElementUI from 'element-ui'

// 加载element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import globalConst from '@/components/Global'
Vue.prototype.global = globalConst
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 全局注册 element 组件库
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

axios.interceptors.request.use(config => {
  // 检查请求头是否包含token
  
  // const base = process.env.VUE_APP_BASEURL
  const token = localStorage.getItem('token')
  if (token!==undefined && token!=='') {
    // 给请求头设置token
    config.headers.Authorization = token;
  }
  const roleId = localStorage.getItem('roleId');
  const url = config.url + "";
  // config.baseURL=`${base}/api`;
  config.baseURL=`/api`;


  if(!url.includes('admin') && !url.includes('film/single') 
  && !url.includes('upload') && !url.includes('logout') && !url.includes('password')){
    if(roleId == 2){
      config.baseURL+='/admin'
    }else if(roleId == 1){
      config.baseURL+='/employee'
    }else if(roleId == 0){
      config.baseURL+='/user'
    }
  }
 
  
  return config;
}, err => {

  return err;
})


