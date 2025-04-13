import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/algopatterns/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true
    },
    proxy: {
      // Proxy requests to /debug to your actual API server
      '/debug': {
          target: 'http://backend:83/',
          changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
    allowedHosts: [
      'aminehdadsetan.net',
      'www.aminehdadsetan.net',
      'localhost',
      '127.0.0.1',
    ]
  }
})