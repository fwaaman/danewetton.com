import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      excerpt: z.string().max(200),
      coverImage: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

const gallery = defineCollection({
  // The JSON file's root is `{ images: [...] }` (matches the Decap CMS "list" field
  // shape); unwrap it here so each image becomes its own collection entry.
  loader: file('./src/content/gallery/gallery.json', {
    parser: (text) => JSON.parse(text).images,
  }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      image: image(),
      alt: z.string(),
      caption: z.string().optional(),
    }),
});

const home = defineCollection({
  // The JSON file is a flat object (matches Decap's file-collection field shape);
  // wrap it under a single "home" key so the file loader can assign it an id.
  loader: file('./src/content/home/home.json', {
    parser: (text) => ({ home: JSON.parse(text) }),
  }),
  schema: ({ image }) =>
    z.object({
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
    }),
});

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      portrait: image().optional(),
      portraitAlt: z.string().optional(),
    }),
});

export const collections = { journal, gallery, home, about };
