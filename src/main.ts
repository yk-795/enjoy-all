import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'

axios.defaults.baseURL = 'http://127.0.0.1:8081/zhiye/api'
// axios请求未完成时的操作
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})
// axios请求完成时的操作
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  console.log(e.response)
}
)
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
