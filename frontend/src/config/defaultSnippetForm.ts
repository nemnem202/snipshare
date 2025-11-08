import type { SnippetForm } from "../types/general/snippetForm";

export const defaultSnippetForm: SnippetForm = {
  visibility: false,
  private_url: false,
  code: "console.log('Hello world !')",
  title: "New snippet",
  description: "Snippet description",
  filters: ["easy", "beguinner", "advanced"],
  language: {
    language: "javascript",
    version: "1.32.3",
    aliases: ["deno-js"],
    runtime: "deno",
  },
};
