// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),

  output: 'server',
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()]
  }
});