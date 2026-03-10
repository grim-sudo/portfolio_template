import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vite looks for index.html at the root — already there
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
