import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, cpSync, rmSync, readdirSync, renameSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-assets',
      closeBundle() {
        if (!existsSync('dist')) mkdirSync('dist', { recursive: true })
        copyFileSync('public/manifest.json', 'dist/manifest.json')
        
        if (existsSync('dist/src/popup/index.html')) {
          copyFileSync('dist/src/popup/index.html', 'dist/popup.html')
        }
        if (existsSync('dist/src/result/index.html')) {
          copyFileSync('dist/src/result/index.html', 'dist/result.html')
        }
        if (existsSync('dist/src/toolkit/index.html')) {
          copyFileSync('dist/src/toolkit/index.html', 'dist/toolkit.html')
        }
        if (existsSync('dist/src/landing/index.html')) {
          copyFileSync('dist/src/landing/index.html', 'dist/index.html')
        }
        if (existsSync('dist/src')) {
          rmSync('dist/src', { recursive: true, force: true })
        }
        
        if (!existsSync('dist/assets')) mkdirSync('dist/assets', { recursive: true })
        
        if (existsSync('public/assets')) {
          cpSync('public/assets', 'dist/assets', { recursive: true })
        }
        
        const files = readdirSync('dist')
        files.forEach(file => {
          if (file.endsWith('.svg')) {
            rmSync(`dist/${file}`)
          }
          if (file.match(/^icon\d+\.png$/)) {
            renameSync(`dist/${file}`, `dist/assets/${file}`)
          }
        })
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyDirBeforeWrite: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        result: resolve(__dirname, 'src/result/index.html'),
        toolkit: resolve(__dirname, 'src/toolkit/index.html'),
        index: resolve(__dirname, 'src/landing/index.html'),
        content: resolve(__dirname, 'src/content/content.ts'),
        background: resolve(__dirname, 'src/background/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: '[name].[ext]',
        manualChunks(id: string) {
          if (id.includes('node_modules/react')) return 'vendor';
          if (id.includes('node_modules/jspdf')) return 'pdf';
        },
      },
    },
  },
})
