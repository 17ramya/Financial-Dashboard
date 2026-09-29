import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Public base path the app is served from.
// - '/' (default) for root/domain hosting: Netlify, Vercel, custom domains, `vite preview`
// - '/<repository-name>/' for GitHub Pages project sites - the deploy workflow
//   exports VITE_BASE_PATH so the build matches the Pages URL automatically.
const base = process.env.VITE_BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: false,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'dist',
    // Source maps stay off in production; set to true when debugging a deployed build.
    sourcemap: false,
    rollupOptions: {
      output: {
        // Keep third-party code in separate, long-lived cacheable chunks instead of
        // one large bundle (Rollup requires the function form here).
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          // Rollup ids can use either separator depending on the platform.
          const normalized = id.replace(/\\/g, '/');

          if (/node_modules\/(recharts|victory-vendor|d3-[^/]+)\//.test(normalized)) return 'charts-vendor';
          if (/node_modules\/lucide-react\//.test(normalized)) return 'icons-vendor';
          if (/node_modules\/(react|react-dom|scheduler|react-is)\//.test(normalized)) return 'react-vendor';

          return undefined;
        },
      },
    },
  },
})
