import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use root path for custom domain deployment
  // For GitHub Pages subdirectory, change to: base: '/AI-FOLIO/'
  base: '/',
  server: {
    port: 3000,
  },
})
