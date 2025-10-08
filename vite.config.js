import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use a relative base for production builds so the site works when served
  // from a custom domain or the site root. Keep '/' during dev for HMR.
  base: process.env.NODE_ENV === 'development' ? '/' : './',
  server: {
    port: 3000,
  },
})
