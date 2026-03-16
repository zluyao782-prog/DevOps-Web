import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const apiBase = env.VITE_API_BASE_URL || 'http://localhost:80'

  return {
    plugins: [vue()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-element': ['element-plus', '@element-plus/icons-vue'],
            'vendor-utils': ['axios', 'crypto-js']
          }
        }
      }
    },
    server: {
      proxy: Object.fromEntries(
        ['/api', '/login', '/logout', '/user', '/product', '/version',
          '/artifact_repository', '/artifact_category', '/githubbranchs',
          '/githubworkflows', '/triggerworkflow', '/user_info', '/check_token', '/token'
        ].map(path => [path, { target: apiBase, changeOrigin: true }])
      )
    }
  }
})
