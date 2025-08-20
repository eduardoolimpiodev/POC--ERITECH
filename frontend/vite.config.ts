import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.indexOf('node_modules') !== -1) {
            return 'vendor'
          }
          if (id.indexOf('/views/') !== -1) {
            return 'views'
          }
          if (id.indexOf('/components/') !== -1) {
            return 'components'
          }
          return undefined
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios']
  }
})
