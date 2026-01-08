import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Use esbuild for minification (faster than terser)
    minify: 'esbuild',
    // Drop console and debugger in production
    target: 'es2015',
    rollupOptions: {
      output: {
        // 代码分割策略
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // React Query
          'query-vendor': ['react-query'],
          // UI 组件库
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          // 工具库
          'utils-vendor': ['axios'],
        },
        // 文件命名（使用 hash 而不是时间戳，更利于缓存）
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-query', 'axios'],
  },
  // esbuild options
  esbuild: {
    drop: ['console', 'debugger'], // Remove console and debugger in production
  },
})
