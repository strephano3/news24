import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Articolo",
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
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      title: "Descrizione",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mainCluster",
      title: "Cluster principale",
      type: "reference",
      to: [{ type: "cluster" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bodyMarkdown",
      title: "Body (Markdown)",
      type: "text",
      rows: 8,
      description: "Contenuto generato dal bot in formato markdown",
    }),
    defineField({
      name: "keywords",
      title: "Keyword primarie",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "targetKeyword",
      title: "Keyword target",
      type: "string",
      description: "Usata dal bot per aggiornare articoli evergreen",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Domanda", type: "string" },
            { name: "answer", title: "Risposta", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "ctaBlock",
      title: "CTA/Affiliazione",
      type: "object",
      fields: [
        { name: "label", type: "string", title: "Label" },
        { name: "url", type: "url", title: "URL" },
        {
          name: "network",
          type: "string",
          title: "Network",
          options: { list: ["AdSense", "Fintech", "Utility", "Altro"] },
        },
      ],
    }),
    defineField({
      name: "eeatScore",
      title: "EEAT Score",
      type: "number",
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "publishedAt",
      title: "Data pubblicazione",
      type: "datetime",
    }),
    defineField({
      name: "isEvergreen",
      title: "Evergreen",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "lastAuditAt",
      title: "Ultimo refresh",
      type: "datetime",
    }),
    defineField({
      name: "trafficPotential",
      title: "Potential traffic",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "mainCluster.title",
    },
  },
});
