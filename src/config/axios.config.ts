import axios from 'axios'

const axiosConfig = axios.create({
  baseURL: 'http://localhost:8000/api',
  // timeout: 5000,
  // headers: { 'X-Custom-Header': 'foobar' },
})

axiosConfig.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => Promise.reject(error),
)

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(error.response.data)
    }
    return Promise.reject(error)
  },
)

export default axiosConfig
