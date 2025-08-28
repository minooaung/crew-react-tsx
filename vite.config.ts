import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Changes made to vite.config.ts will not affect or break production build
  // Prevents unauthorized access to your dev server from:
  // Other computers on your network (via host: 'localhost')
  // Other websites making requests (via cors: false)
  // Malicious file system access attempts (via fs.strict and fs.allow)
  server: {
    host: 'localhost', // Restrict to localhost only
    cors: false,       // Disable CORS
    fs: {
      strict: true,    // Enforce strict file system access
      allow: ['..']    // Only allow access to project files
    }
  }
}) 