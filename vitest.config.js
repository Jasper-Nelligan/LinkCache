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
      exclude: [
        'src/components/ui',
        '**/*.js', // Exclude all JavaScript configuration files
        '**/*.test.tsx', // Exclude all test files
        '**/main.tsx'
      ],
    },
    globals: true,
    environment: 'jsdom',
  },
})