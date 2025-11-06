import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // Important: make assets relative so Electron can load them
  build: {
    outDir: 'dist',
  },
  server: {
    host: 'localhost', // Restricts access to your local machine
    port: 3000,
  }
})