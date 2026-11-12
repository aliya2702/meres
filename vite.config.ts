import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __MERES_HAS_BATHROOM_IMAGE__: JSON.stringify(
      fs.existsSync(path.resolve(__dirname, 'public/images/services/bathroom.png')),
    ),
    __MERES_HAS_ADDITIONS_IMAGE__: JSON.stringify(
      fs.existsSync(path.resolve(__dirname, 'public/images/services/additions.png')),
    ),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
