import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

/**
 * Post Schema
 *
 * Matches Content Collection: posts/
 * Fields: title, pubDate, description, team, image, tags
 */
export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  icon: DocumentIcon,
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A short description for cards and SEO",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pubDate",
      title: "Publish Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "team",
      title: "Author",
      type: "string",
      description: "Team member slug (e.g., 'david-lee')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      date: "pubDate",
      team: "team",
    },
    prepare({ title, media, date, team }) {
      return {
        title,
        media,
        subtitle: `${team ? `By ${team} · ` : ""}${date ? new Date(date).toLocaleDateString() : "No date"}`,
      };
    },
  },
  orderings: [
    {
      title: "Publish Date, New",
      name: "pubDateDesc",
      by: [{ field: "pubDate", direction: "desc" }],
    },
    {
      title: "Publish Date, Old",
      name: "pubDateAsc",
      by: [{ field: "pubDate", direction: "asc" }],
    },
  ],
});
