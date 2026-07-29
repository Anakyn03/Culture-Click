import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' keeps built asset paths relative so the app works whether it's served
// from a GitHub Pages project site (https://user.github.io/repo/) or any subpath.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
