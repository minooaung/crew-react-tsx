/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // @ts-expect-error - Vitest config extends Vite config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        // Config files
        '*.config.js',
        '*.config.ts',
        '.eslintrc.cjs',
        'postcss.config.js',
        'tailwind.config.js',
        'vite.config.ts',
        'vitest.config.ts',
        // Build output
        'dist/',
        // Context provider (JSX file, harder to test)
        'src/contexts/ContextProvider.jsx'
      ],
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/__tests__/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
})