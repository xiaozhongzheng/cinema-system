import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载element组件库
import ElementUI from 'element-ui'

// 加载element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts'
import axios from 'axios'
import globalConstant from '@/utils/global-constant'
import SearchTableTemplate from "@/components/SearchTableTemplate.vue";

Vue.prototype.$constant = globalConstant
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
// 全局注册 element 组件库
Vue.use(ElementUI)
Vue.config.devtools = true

Vue.component('SearchTableTemplate',SearchTableTemplate)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

