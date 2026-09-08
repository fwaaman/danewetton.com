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
  title: "Gallery",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Category or theme of this gallery",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
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
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      description: "Main preview image for the gallery",
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
      title: "Gallery Images",
      type: "array",
      description: "Additional images in this gallery",
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
