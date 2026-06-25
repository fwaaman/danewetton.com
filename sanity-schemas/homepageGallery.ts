import { defineField, defineType } from 'sanity';

export const homepageGallery = defineType({
  name: 'homepageGallery',
  title: 'Homepage Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Homepage Gallery',
      readOnly: true,
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        defineField({
          name: 'galleryPhoto',
          title: 'Gallery Photo',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'visible',
              title: 'Visible on homepage',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              subtitle: 'caption',
              media: 'image',
            },
          },
        }),
      ],
    }),
  ],
});
