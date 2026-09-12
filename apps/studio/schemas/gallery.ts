import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

/**
 * Gallery Schema
 *
 * Matches Content Collection: gallery/
 * Fields: category, title, description, thumbnail, images
 */
export const gallery = defineType({
  name: "gallery",
  title: "Photos Page",
  type: "document",
  icon: ImagesIcon,
  groups: [
    { name: "photographs", title: "Photographs", default: true },
    { name: "details", title: "Details" },
  ],
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "details",
      description: "Category or theme of this gallery",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "details",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "First Photograph",
      type: "image",
      group: "photographs",
      description: "The first photograph shown on the Photos page.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the image for accessibility",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Additional Photographs",
      type: "array",
      group: "photographs",
      description: "All remaining photographs shown on the Photos page.",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image for accessibility",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "thumbnail",
    },
  },
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Category",
      name: "categoryAsc",
      by: [{ field: "category", direction: "asc" }],
    },
  ],
});
