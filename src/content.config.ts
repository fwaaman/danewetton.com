import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The "journal" collection: every .md / .mdx file in src/content/journal/ is a blog post.
// The schema below is validated at build time — a missing title or a bad date fails loudly
// instead of silently breaking the page.
const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    // Shown in search results and link previews — write this for SEO (≈150 chars).
    description: z.string(),
    date: z.coerce.date(),
    // Optional cover image. A public path like "/journal-media/photo.jpg" — the CMS
    // uploads here for you. Used for the card thumbnail and social-share previews.
    cover: z.string().optional(),
    coverAlt: z.string().default(''),
    tags: z.array(z.string()).default([]),
    // Set draft: true to keep a post out of the live site until it's ready.
    draft: z.boolean().default(false),
  }),
});

export const collections = { journal };
