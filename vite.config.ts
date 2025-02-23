import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tsconfigpaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "public",
  plugins: [
    TanStackRouterVite({}),
    react(),
    tsconfigpaths()
  ],
})
