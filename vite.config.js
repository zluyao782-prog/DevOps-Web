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
          '/artifact_repository', '/artifact_category', '/artifact_subrepository',
          '/artifact_upload', '/artifact_apt_subrepo_details', '/artifact_docker_image_tags',
          '/githubbranchs', '/githubworkflows', '/githubactions',
          '/triggerworkflow', '/getactionsbyworkflowname', '/getworkflowinputinfobyname',
          '/CIArtifacts', '/webhook',
          '/user_info', '/check_token', '/token', '/auth',
          '/product_name', '/product_doc', '/version_name', '/version_artifacts',
          '/health', '/ready'
        ].map(path => [path, { target: apiBase, changeOrigin: true }])
      )
    }
  }
})
