import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import type { Plugin } from 'vite'

// 自定义插件：处理根路径重定向
function rootPathRedirect(): Plugin {
  return {
    name: 'root-path-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 如果是根路径且不是 API 请求，重定向到 index.html
        if (req.url === '/' && !req.url.startsWith('/api')) {
          req.url = '/index.html'
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), rootPathRedirect()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  appType: 'spa',
})
