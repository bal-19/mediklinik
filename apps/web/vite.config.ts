import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['offline.html'],
      manifest: {
        name: 'MediKlinik',
        short_name: 'MediKlinik',
        description: 'Manajemen klinik digital multi-tenant',
        theme_color: '#0EA5E9',
        background_color: '#F8FAFC',
        display: 'standalone',
        start_url: '/app/dashboard',
        icons: [
          { src: '/icons/app-icon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: '/icons/app-icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', expiration: { maxEntries: 100 } },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-cache', expiration: { maxEntries: 50 } },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
