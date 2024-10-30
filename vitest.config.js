import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from "path"

// TODO use a combined vite config for both dev and test
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      enabled: true,
    },
    globals: true,
    environment: 'jsdom',
  },
})