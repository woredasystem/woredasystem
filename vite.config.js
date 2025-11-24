import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.jsx', '.js', '.ts', '.tsx', '.json']
  },
  server: {
    // Disable caching in development
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Force HMR to work properly
    hmr: {
      overlay: true,
      // Force full page reload on certain changes
      clientPort: 5173
    },
    // Watch for file changes more aggressively
    watch: {
      usePolling: false,
      interval: 100
    }
  },
  // Disable build caching issues
  build: {
    rollupOptions: {
      output: {
        // Add hash to filenames to prevent caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    force: true // Force re-optimization
  },
  // Clear cache on start
  clearScreen: true
})
