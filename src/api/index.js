import axios from 'axios'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'

// 从环境变量读取密钥，避免硬编码
const AES_KEY = import.meta.env.VITE_AES_KEY || ''

export function encryptPassword(password) {
  if (!AES_KEY) {
    console.warn('VITE_AES_KEY 未配置，密码将明文传输')
    return password
  }
  const key = CryptoJS.enc.Utf8.parse(AES_KEY.padEnd(16, '0').slice(0, 16))
  return CryptoJS.AES.encrypt(password, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

const request = axios.create({ timeout: 15000 })

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['x-auth-token'] = token
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// token 过期或无效需要跳转登录的 errCode 集合
const AUTH_ERROR_CODES = new Set([1002])

function redirectToLogin() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  window.location.href = '/login'
}

request.interceptors.response.use(
  res => {
    const data = res.data
    if (data.errCode !== 0) {
      if (AUTH_ERROR_CODES.has(data.errCode)) {
        redirectToLogin()
      } else {
        ElMessage.error(data.errMsg || '请求失败')
      }
      return Promise.reject(data)
    }
    return data.resp ?? data
  },
  err => {
    if (err.response?.status === 401) {
      redirectToLogin()
    } else {
      ElMessage.error(err.response?.data?.errMsg || '网络错误')
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = data => request.post('/login', data)
export const logout = () => request.post('/logout')
export const getUserInfo = () => request.get('/user_info')
export const checkToken = () => request.get('/check_token')

// User
export const getUsers = (params) => request.get('/user', { params })
export const createUser = ({ userName, password, authType }) =>
  request.post('/user', { username: userName, password: encryptPassword(password), authType })
export const updateUser = ({ userName, password, authType }) =>
  request.put('/user', { username: userName, authType, ...(password ? { password: encryptPassword(password) } : {}) })
export const deleteUser = username => request.delete(`/user?username=${username}`)

// Product
export const getProducts = () => request.get('/product')
export const createProduct = data => request.post('/product', data)
export const updateProduct = data => request.put('/product', data)
export const deleteProduct = id => request.delete(`/product?id=${id}`)

// Version
export const getVersions = productId => request.get(`/version?productId=${productId}`)
export const createVersion = data => request.post('/version', data)
export const updateVersion = data => request.put('/version', data)
export const deleteVersion = id => request.delete(`/version?id=${id}`)

// Artifact Repository
export const getRepositories = () => request.get('/artifact_repository')
export const createRepository = data => request.post('/artifact_repository', data)
export const updateRepository = data => request.put('/artifact_repository', data)
export const deleteRepository = id => request.delete(`/artifact_repository?id=${id}`)

// Artifact Category
export const getCategories = () => request.get('/artifact_category')
export const createCategory = data => request.post('/artifact_category', data)
export const updateCategory = data => request.put('/artifact_category', data)
export const deleteCategory = id => request.delete(`/artifact_category?id=${id}`)

// CI/CD
export const getBranches = (owner, repo) => request.get(`/githubbranchs?owner=${owner}&repo=${repo}`)
export const getWorkflows = (owner, repo) => request.get(`/githubworkflows?owner=${owner}&repo=${repo}`)
export const triggerWorkflow = data => request.post('/triggerworkflow', data)

// System
export const getSystemInfo = () => request.get('/api/system/info')
