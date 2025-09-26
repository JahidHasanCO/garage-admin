import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173, // fixed port
    strictPort: true, // fail instead of auto-bumping
  },
  plugins: [react()],
})
