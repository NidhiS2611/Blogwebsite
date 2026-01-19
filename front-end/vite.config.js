import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'statueless-carey-nonpestilently.ngrok-free.dev'
    ]
  }
})

