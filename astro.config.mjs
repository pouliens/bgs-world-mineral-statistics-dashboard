// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Uncomment and configure these for GitLab Pages if your project is not at the root:
  // site: 'https://your-username.gitlab.io',
  // base: '/your-project-name',

  vite: {
      plugins: [tailwindcss()],
	},

  integrations: [react()],
});