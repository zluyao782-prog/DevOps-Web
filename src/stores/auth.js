import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout, encryptPassword } from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null
  }),
  getters: {
    isLoggedIn: state => !!state.token
  },
  actions: {
    async login(username, password) {
      const resp = await apiLogin({ username, password: encryptPassword(password) })
      this.token = resp.accessToken
      localStorage.setItem('token', resp.accessToken)
      if (resp.refreshToken) localStorage.setItem('refreshToken', resp.refreshToken)
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
