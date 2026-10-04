import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Rollup ids are POSIX-normalised by Vite, but compare on a normalised copy anyway so a
// Windows checkout behaves exactly like CI.
const normalise = (id) => id.replace(/\\/g, '/')

// React, the router and the Supabase client together are the great majority of the bytes in
// the entry bundle, and they change only when their versions do. Splitting them into their own
// chunks means a content or UI deploy rewrites a few kilobytes of app code instead of the
// whole entry file, so a returning visitor re-downloads almost nothing.
const VENDOR = [
  { chunk: 'react-vendor', test: /\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\// },
  { chunk: 'supabase', test: /\/node_modules\/@supabase\// },
]

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // The atlas content is no longer bundled — it is fetched from Supabase a state at a time.
    // The India state-boundary path data is the only large static asset left, and it changes
    // about never, so it gets its own long-lived chunk instead of sitting in the main bundle.
    rollupOptions: {
      output: {
        manualChunks(id) {
          const path = normalise(id)
          if (path.includes('/src/data/indiaPaths.js')) return 'india-map'
          return VENDOR.find((v) => v.test.test(path))?.chunk
        },
      },
    },
  },
})
