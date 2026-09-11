import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Si publicas en GitHub Pages en un repo que NO es <usuario>.github.io,
// cambia "base" al nombre exacto de tu repositorio, con barras al inicio y final.
// Ejemplo: base: '/inspeccion-estructural/'
export default defineConfig({
  base: '/inspeccion-estructural/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Inspección Estructural',
        short_name: 'Inspección',
        description: 'Registro de visitas de inspección estructural en campo',
        theme_color: '#12283F',
        background_color: '#F5F4F1',
        display: 'standalone',
        start_url: '/inspeccion-estructural/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // Cachea el app shell para que abra sin conexión.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        // Los datos van a Firestore/Storage; su caché offline la maneja
        // la persistencia de Firestore, no el service worker.
      }
    })
  ]
});
