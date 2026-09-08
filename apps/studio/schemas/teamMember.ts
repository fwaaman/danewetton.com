import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

/**
 * Team Member Schema
 *
 * Matches Content Collection: team/
 * Fields: name, role, bio, image, socials
 */
export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Job title or role",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 5,
      description: "Short biography",
    }),
    defineField({
      name: "image",
      title: "Profile Image",
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
      name: "socials",
      title: "Social Links",
      type: "object",
      description: "Social media profile links",
      fields: [
        defineField({
          name: "twitter",
          title: "Twitter",
          type: "string",
          description: "Twitter profile URL",
        }),
        defineField({
          name: "website",
          title: "Website",
          type: "string",
          description: "Personal website URL",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "string",
          description: "LinkedIn profile URL",
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          description: "Email address",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Name Z-A",
      name: "nameDesc",
      by: [{ field: "name", direction: "desc" }],
    },
  ],
});
