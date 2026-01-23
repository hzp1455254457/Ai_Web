import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API基础URL（从环境变量读取）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// 创建Axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误
      const { status, data } = error.response
      console.error(`API Error [${status}]:`, data)
    } else if (error.request) {
      // 请求发送但无响应
      console.error('Network Error:', error.request)
    } else {
      // 其他错误
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
