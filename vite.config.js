import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/login': 'http://localhost:80',
      '/logout': 'http://localhost:80',
      '/user': 'http://localhost:80',
      '/product': 'http://localhost:80',
      '/version': 'http://localhost:80',
      '/artifact_repository': 'http://localhost:80',
      '/artifact_category': 'http://localhost:80',
      '/githubbranchs': 'http://localhost:80',
      '/githubworkflows': 'http://localhost:80',
      '/triggerworkflow': 'http://localhost:80',
      '/user_info': 'http://localhost:80',
      '/check_token': 'http://localhost:80',
      '/token': 'http://localhost:80',
      '/api': 'http://localhost:80'
    }
  }
})
