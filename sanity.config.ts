import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { homepageGallery } from './sanity-schemas/homepageGallery';

export default defineConfig({
  name: 'danewetton',
  title: 'Dane Wetton',
  projectId: 'ovqshb4n',
  dataset: 'danewetton',
  plugins: [structureTool()],
  schema: {
    types: [homepageGallery],
  },
});
