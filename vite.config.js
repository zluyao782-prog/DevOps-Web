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
      proxy: {
        // 统一代理所有 API 请求到后端服务
        '/api': apiBase,
        '/login': apiBase,
        '/logout': apiBase,
        '/user': apiBase,
        '/product': apiBase,
        '/version': apiBase,
        '/artifact_repository': apiBase,
        '/artifact_category': apiBase,
        '/githubbranchs': apiBase,
        '/githubworkflows': apiBase,
        '/triggerworkflow': apiBase,
        '/user_info': apiBase,
        '/check_token': apiBase,
        '/token': apiBase
      }
    }
  }
})
