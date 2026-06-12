import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base './' is required for Capacitor: assets must use relative paths
  // inside the native WebView (no server root available)
  base: './',
})
