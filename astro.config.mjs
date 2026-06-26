// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Your live domain — used for canonical URLs, Open Graph tags, and the sitemap.
  site: 'https://danewetton.com',
  integrations: [sitemap()],
});
