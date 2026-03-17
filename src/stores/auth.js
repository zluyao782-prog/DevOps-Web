import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout, getUserInfo, encryptPassword } from '../api'
import axios from 'axios'

// 解析 JWT payload，不验签，只读 exp
function parseJwtExp(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp || 0
  } catch {
    return 0
  }
}

// 距过期还剩多少秒
function secondsUntilExpiry(token) {
  const exp = parseJwtExp(token)
  return exp - Math.floor(Date.now() / 1000)
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null
  }),
  getters: {
    isLoggedIn: state => !!state.token,
    username: state => state.user?.userName || ''
  },
  actions: {
    async login(username, password) {
      const resp = await apiLogin({ username, password: encryptPassword(password) })
      console.log('登录接口响应:', JSON.stringify(resp))
      const token = resp?.accessToken || resp?.token || resp?.access_token || resp
      if (!token || typeof token !== 'string') {
        throw new Error('登录响应中未找到 token，响应内容: ' + JSON.stringify(resp))
      }
      this.token = token
      localStorage.setItem('token', token)
      if (resp?.refreshToken) localStorage.setItem('refreshToken', resp.refreshToken)
      await this.fetchUser()
    },

    // App 初始化时调用：检查 token 有效期，快过期则续期
    async initAuth() {
      const token = this.token
      if (!token) return

      const remaining = secondsUntilExpiry(token)
      // 剩余不足 5 分钟则尝试续期
      if (remaining < 300) {
        await this.refreshToken()
      } else {
        // token 有效，顺手拉一下用户信息
        await this.fetchUser()
      }
    },

    async refreshToken() {
      const accessToken = this.token
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        this.clearAuth()
        return
      }
      try {
        const res = await axios.post('/token', { accessToken, refreshToken })
        const newToken = res.data?.resp?.accessToken
        if (!newToken) throw new Error('续期响应无 token')
        this.token = newToken
        localStorage.setItem('token', newToken)
        await this.fetchUser()
      } catch {
        this.clearAuth()
      }
    },

    async fetchUser() {
      try {
        this.user = await getUserInfo()
      } catch (e) {
        console.warn('获取用户信息失败', e)
      }
    },

    async logout() {
      try { await apiLogout() } catch {}
      this.clearAuth()
    },

    clearAuth() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }
})
