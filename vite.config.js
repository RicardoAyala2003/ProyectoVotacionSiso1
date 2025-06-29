import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/proyectoVotaciones',
        changeOrigin: true,
        secure: false,
        // 🔥 Este cambio es clave: conserva el /api en la URL
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
