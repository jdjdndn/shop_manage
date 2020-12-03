import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式
import './assets/css/global.css'
// 字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
import ZkTable from 'vue-table-with-tree-grid'

Vue.filter('dateFormat', (date) => {
  const dt = new Date(date)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2,'0')
  const d = (dt.getDate()).toString().padStart(2,'0')
  const h = (dt.getHours()).toString().padStart(2,'0')
  const mm = (dt.getMinutes()).toString().padStart(2,'0')
  const s = (dt.getSeconds()).toString().padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${mm}:${s}`
})

Vue.component('tree-table', ZkTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
