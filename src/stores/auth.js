import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout, getUserInfo, encryptPassword } from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null
  }),
  getters: {
    isLoggedIn: state => !!state.token,
    username: state => state.user?.username || ''
  },
  actions: {
    async login(username, password) {
      const resp = await apiLogin({ username, password: encryptPassword(password) })
      this.token = resp.accessToken
      localStorage.setItem('token', resp.accessToken)
      if (resp.refreshToken) localStorage.setItem('refreshToken', resp.refreshToken)
      // 登录后立即获取用户信息
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
