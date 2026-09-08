import { defineField, defineType } from "sanity";
import { PackageIcon } from "@sanity/icons";

/**
 * Product Schema
 *
 * Matches Content Collection: store/
 * Fields: title, price, checkout, license, description, highlights, specifications, image, images, faq
 */
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  fields: [
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
      name: "price",
      title: "Price",
      type: "string",
      description: "Price without currency symbol (e.g., '99')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "checkout",
      title: "Checkout URL",
      type: "string",
      description: "Link to purchase/checkout page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "license",
      title: "License",
      type: "text",
      rows: 4,
      description: "License terms and conditions",
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
      name: "highlights",
      title: "Highlights",
      type: "array",
      description: "Key features or selling points",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      description: "Technical specifications",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "value",
            },
          },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      description: "Primary product image (thumbnail)",
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
      title: "Additional Images",
      type: "array",
      description: "Additional product images",
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
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      description: "Frequently asked questions",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "question",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      price: "price",
      media: "image",
    },
    prepare({ title, price, media }) {
      return {
        title,
        subtitle: price ? `$${price}` : "No price",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Price Low-High",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
  ],
});
