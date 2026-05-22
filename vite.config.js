import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'development' ? '/' : './',
  build: {
    outDir: 'docs',
    emptyOutDir: false, // preserve CNAME and other static files in docs/
  },
  server: {
    port: 3000,
    fs: {
      deny: ['docs/**'],
    },
  },
})
