import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ← Now this will work

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 8082,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://172.20.75.13:8081',
        changeOrigin: true,
      }
    }
  }
})