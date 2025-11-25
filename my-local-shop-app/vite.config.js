import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // This is the new part to add
  server: {
    proxy: {
      // Any request starting with /api will be sent to the backend
      '/api': {
        target: 'http://localhost:8000', // Your backend server
        changeOrigin: true,
      },
    },
  },
})