import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const team = defineCollection({
  loader: glob({ base: "./src/content/team", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      bio: z.string().optional(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      socials: z
        .object({
          twitter: z.string().optional(),
          website: z.string().optional(),
          linkedin: z.string().optional(),
          email: z.string().optional(),
        })
        .optional(),
    }),
});

const store = defineCollection({
  loader: glob({ base: "./src/content/store", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      price: z.string(),
      title: z.string(),
      checkout: z.string(),
      license: z.string(),
      highlights: z.array(z.string()),
      specifications: z
        .array(
          z.object({
            name: z.string(),
            value: z.string(),
          })
        )
        .optional(),
      description: z.string(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      images: z.array(
        z.object({
          url: image(),
          alt: z.string(),
        })
      ),
      faq: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          })
        )
        .optional(),
    }),
});

const gallery = defineCollection({
  loader: glob({ base: "./src/content/gallery", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      category: z.string(),
      title: z.string(),
      description: z.string(),
      thumbnail: z.object({
        url: image(),
        alt: z.string(),
      }),
      images: z
        .array(
          z.object({
            url: image(),
            alt: z.string(),
          })
        )
        .optional(),
    }),
});

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      description: z.string(),
      team: z.string(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      tags: z.array(z.string()),
    }),
});

const legal = defineCollection({
  loader: glob({ base: "./src/content/infopages", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    page: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = {
  team,
  store,
  gallery,
  legal,
  posts,
};
