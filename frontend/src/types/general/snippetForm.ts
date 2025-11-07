import type { Langage } from "./language";

export type SnippetForm = {
  title: string;
  description: string;
  code: string;
  filters: string[];
  language: Langage;
  visibility: boolean;
  private_url: boolean;
};
