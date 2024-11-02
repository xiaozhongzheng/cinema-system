import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载element组件库
import ElementUI from 'element-ui'

// 加载element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import globalConstant from '@/utils/GlobalConstant'
Vue.prototype.global = globalConstant
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 全局注册 element 组件库
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

