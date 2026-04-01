import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: false,
    watch: {
      usePolling: false,
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    // SPA fallback: serve index.html for all non-asset requests in dev
    middlewareMode: false,
  },
  preview: {
    port: 5173,
    // SPA fallback: serve index.html for all non-asset requests in preview mode
    middlewareMode: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-icons'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          vendor: ['axios'],
        },
      },
    },
  },
})

