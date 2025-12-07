import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteTitle", title: "Site title", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "primaryColor", title: "Colore brand", type: "string" }),
    defineField({ name: "monetizationBlocks", title: "Blocchi monetizzazione", type: "array", of: [{ type: "text" }] }),
  ],
});
