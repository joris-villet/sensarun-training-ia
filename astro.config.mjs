// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro'
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [
      tailwindcss(),
      AstroPWA({
        registerType: 'autoUpdate',
        workbox: {
          skipWaiting: true,
          clientsClaim: true
        },
        manifest: {
          name: 'SensaRun',
          short_name: 'Assistant running',
          icons: [
            {
              src: '/favicons/favicon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/favicons/favicon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/favicons/favicon-512x512.png',
              sizes: '512x512', 
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          start_url: '/',
          display: 'standalone',
          background_color: '#f1f1f1',
          theme_color: '#3367D6',
          id: '/running-app/' // Ajouter un ID unique
        },
        devOptions: {
          enabled: true // Pour tester en dev
        }
      })
    ]
  },
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile'
  })
});