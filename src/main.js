import Vue from 'vue'
import App from './App.vue'
import router from './router' // 路由
import './plugins/element.js'
import './assets/css/main.css'
import axios from 'axios'

// axiox全局设定
// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
  // 在发送请求之前做些什么
    const { url } = config
    if (url !== 'login/') {
      const token = window.localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = 'Bearer ' + token
      }
      // console.log(config)
    }
    return config
  }
)

// 添加响应拦截器
axios.interceptors.response.use(response => {
  // 对响应数据做点什么
  if (response.data && response.data.code && response.data.code < 100) {
    if (router.currentRoute.fullPath === '/login') {
      return response
    }
    window.localStorage.removeItem('token')
    router.push('/login')
  }
  return response
})

// axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.baseURL = '/api/v1'
Vue.prototype.$http = axios
// Vue组件全局设定
Vue.config.productionTip = false

new Vue({
  router, // 使用路由
  render: h => h(App)
}).$mount('#app') // 在SPA的唯一的网页里面找id为app的HTML标签上mount Vue组件
