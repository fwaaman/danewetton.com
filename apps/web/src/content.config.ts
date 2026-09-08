import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

function idFromFilename(entry: string) {
  return entry.replace(/\.(md|mdx)$/i, "");
}

const team = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/team",
    generateId: ({ entry }) => idFromFilename(entry),
  }),
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
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/store",
    generateId: ({ entry }) => idFromFilename(entry),
  }),
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
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/gallery",
    generateId: ({ entry }) => idFromFilename(entry),
  }),
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
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => idFromFilename(entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
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
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/legal",
    generateId: ({ entry }) => idFromFilename(entry),
  }),
  schema: z.object({
    page: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = {
  team,
  store,
  gallery,
  legal,
  posts,
};
