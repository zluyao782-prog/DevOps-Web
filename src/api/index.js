import axios from 'axios'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'

const AES_KEY = 'devops-aes-secret-key-2024'

export function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, AES_KEY).toString()
}

const request = axios.create({ timeout: 15000 })

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers['x-auth-token'] = token
  return config
})

request.interceptors.response.use(
  res => {
    const data = res.data
    if (data.errCode !== 0) {
      ElMessage.error(data.errMsg || '请求失败')
      if (data.errCode === 401 || data.errCode === 403) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(data)
    }
    return data.resp
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    ElMessage.error(err.response?.data?.errMsg || '网络错误')
    return Promise.reject(err)
  }
)

// Auth
export const login = data => request.post('/login', data)
export const logout = () => request.post('/logout')
export const getUserInfo = () => request.get('/user_info')
export const checkToken = () => request.get('/check_token')

// User
export const getUsers = () => request.get('/user')
export const createUser = data => request.post('/user', data)
export const updateUser = data => request.put('/user', data)
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
