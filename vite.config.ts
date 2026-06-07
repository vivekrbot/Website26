import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages: set to /REPO_NAME/ — update if your repo name differs
  base: '/Website26/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react';
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/@remix-run')) return 'router';
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/react-helmet-async')) return 'helmet';
        },
      },
    },
  },
});
