// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages configuration
  site: 'https://pouliens.github.io',
  base: '/bgs-world-mineral-statistics-dashboard',

  // Static output for deployment
  output: 'static',

  vite: {
      plugins: [tailwindcss()],
      server: {
        proxy: {
          // Proxy API calls in development to avoid CORS
          '/bgs-api': {
            target: 'http://ogc2.bgs.ac.uk',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/bgs-api/, '/cgi-bin/UKWM/ows'),
          }
        }
      }
	},

  integrations: [react()],
});