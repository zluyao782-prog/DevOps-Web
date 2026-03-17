import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout, getUserInfo, encryptPassword } from '../api'

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
      // 兼容不同字段名：accessToken / token / access_token
      const token = resp?.accessToken || resp?.token || resp?.access_token || resp
      if (!token || typeof token !== 'string') {
        throw new Error('登录响应中未找到 token，响应内容: ' + JSON.stringify(resp))
      }
      this.token = token
      localStorage.setItem('token', token)
      if (resp?.refreshToken) localStorage.setItem('refreshToken', resp.refreshToken)
      await this.fetchUser()
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
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }
})
