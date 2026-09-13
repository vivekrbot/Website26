import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from the itsvivek.com custom domain at root, not a repo subpath
  base: '/',
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
          // Previously unnamed: gsap (+ScrollTrigger/SplitText/@gsap/react) rode
          // along inside whatever shared component happened to pull it in first
          // (ended up mislabeled "BorderGlow", ~129KB). ogl and lenis were baked
          // into the main entry chunk since Layout (always loaded) uses both —
          // splitting all three into their own stable vendor chunks means an app
          // code change (e.g. a CMS content refresh) no longer invalidates the
          // cache for libraries that didn't actually change.
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) return 'gsap';
          if (id.includes('node_modules/ogl')) return 'ogl';
          if (id.includes('node_modules/lenis')) return 'lenis';
        },
      },
    },
  },
});
