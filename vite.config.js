import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vercel serves the app from the domain root, so an absolute base works cleanly (unlike
// GitHub Pages project sites, which need a relative base for their /repo-name/ subpath).
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // The 36-state dataset is the bulk of the bundle; split it into its own chunk so route
    // code (small) and the big static content chunk can be cached/loaded independently.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/statesData.js') || id.includes('/src/data/indiaPaths.js')) {
            return 'states-data';
          }
        },
      },
    },
  },
})
