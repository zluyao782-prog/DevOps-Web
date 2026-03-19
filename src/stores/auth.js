import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout, getUserInfo } from '@/api/auth'
import { encryptPassword } from '@/utils/crypto'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loggedIn: false
  }),
  getters: {
    isLoggedIn: state => state.loggedIn,
    username: state => state.user?.userName || ''
  },
  actions: {
    async login(username, password) {
      const { password: encPwd, iv } = encryptPassword(password)
      await apiLogin({ username, password: encPwd, iv })
      // token 由后端通过 HttpOnly cookie 设置，无需手动处理
      await this.fetchUser()
      this.loggedIn = true
    },

    async initAuth() {
      try {
        await this.fetchUser()
        this.loggedIn = true
      } catch {
        this.loggedIn = false
      }
    },

    async fetchUser() {
      this.user = await getUserInfo()
    },

    async logout() {
      try { await apiLogout() } catch {}
      this.user = null
      this.loggedIn = false
    }
  }
})
