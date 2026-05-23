import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/team_scheduler/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '팀 스케줄러',
        short_name: '팀스케줄',
        description: '팀원들의 가능한 시간을 한눈에',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/team_scheduler/',
        scope: '/team_scheduler/',
        icons: [
          { src: '/team_scheduler/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/team_scheduler/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})

