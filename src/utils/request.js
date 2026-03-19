import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建 Axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true  // 自动携带 HttpOnly cookie（accessToken/refreshToken）
})

// Token 过期或无效需要跳转登录的 errCode 集合
const AUTH_ERROR_CODES = new Set([1002])

// 辅助函数：处理未授权跳转
function handleUnauthorized() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  // 使用 router.push 替代 window.location.href 以避免页面刷新
  router.push('/login')
}

// 请求拦截器：cookie 自动携带，无需手动设置 token 头
request.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  res => {
    const data = res.data
    // 业务逻辑错误处理：约定 errCode 不为 0 时表示失败
    if (data.errCode !== 0) {
      if (AUTH_ERROR_CODES.has(data.errCode)) {
        handleUnauthorized()
      } else {
        // 统一提示错误
        ElMessage.error(data.errMsg || '请求失败')
      }
      return Promise.reject(data)
    }
    // 成功处理：后端统一格式 {errCode, errMsg, data}，返回 data 字段
    return data.resp ?? data.data ?? data
  },
  err => {
    // HTTP 网络层错误处理
    if (err.response?.status === 401) {
      handleUnauthorized()
    } else {
      ElMessage.error(err.response?.data?.errMsg || '网络错误')
    }
    return Promise.reject(err)
  }
)

export default request
