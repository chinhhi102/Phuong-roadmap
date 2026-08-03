import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// base: './' → relative asset paths so the build works on GitHub Pages
// project sites (https://user.github.io/repo/) without knowing the repo name.
// Routing uses HashRouter, so no SPA 404 fallback is required.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
  },
})
