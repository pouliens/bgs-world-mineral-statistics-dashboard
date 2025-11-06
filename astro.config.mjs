// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Uncomment and configure these for GitLab Pages if your project is not at the root:
  // site: 'https://your-username.gitlab.io',
  // base: '/your-project-name',

  // Static output for GitLab Pages
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