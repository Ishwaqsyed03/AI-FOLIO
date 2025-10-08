import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages (repo served at username.github.io/AI-FOLIO)
  base: '/AI-FOLIO/',
  server: {
    port: 3000,
  },
})
