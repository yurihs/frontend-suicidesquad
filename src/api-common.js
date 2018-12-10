import axios from 'axios'
import NProgress from 'nprogress'

const API = axios.create({
  baseURL: process.env.NODE_ENV !== 'PRODUCTION' ? 'https://backend-suicide-squad.herokuapp.com/' : 'http://localhost:9000/'
})

API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

API.interceptors.request.use(
  config => {
    NProgress.start()
    return config
  }
)

API.interceptors.response.use(
  config => {
    NProgress.done()
    return config
  },
  error => {
    NProgress.done()
    return Promise.reject(error)
  }
)

export default API
