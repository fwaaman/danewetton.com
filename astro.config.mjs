// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const hasPackage = (packageName) => {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
};

const studioIntegrations = [];

if (hasPackage('@sanity/astro') && hasPackage('@astrojs/react')) {
  const [{ default: sanity }, { default: react }] = await Promise.all([
    import('@sanity/astro'),
    import('@astrojs/react'),
  ]);

  studioIntegrations.push(
    sanity({
      projectId: 'ovqshb4n',
      dataset: 'danewetton',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react()
  );
}

// https://astro.build/config
export default defineConfig({
  // Your live domain — used for canonical URLs, Open Graph tags, and the sitemap.
  site: 'https://danewetton.com',
  integrations: [sitemap(), ...studioIntegrations],
});
