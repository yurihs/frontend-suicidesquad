import axios from 'axios'
import NProgress from 'nprogress'
import {backendURL} from './config'

const apiParamsSerializer = function (params) {
  var parts = []
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var obj = params[key]
      if (Array.isArray(obj)) {
        for (var idx = 0; idx < obj.length; idx++) {
          parts.push(key + '=' + encodeURIComponent(obj[idx]))
        }
      } else {
        parts.push(key + '=' + encodeURIComponent(obj))
      }
    }
  }
  return parts.join('&')
}

const API = axios.create({
  baseURL: backendURL,
  paramsSerializer: apiParamsSerializer
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
