import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-popover',
      'zustand/middleware',
      '@/components/ui/radio-group',
      'uuid',
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
