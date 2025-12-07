import { defineField, defineType } from "sanity";

export default defineType({
  name: "cluster",
  title: "Cluster",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "searchIntent",
      title: "Search Intent",
      type: "string",
      options: {
        list: [
          { title: "Informational", value: "informational" },
          { title: "Commercial", value: "commercial" },
          { title: "Transactional", value: "transactional" },
        ],
      },
    }),
    defineField({
      name: "priorityScore",
      title: "Priorità",
      type: "number",
      validation: (rule) => rule.min(0).max(100),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "searchIntent" },
  },
});
