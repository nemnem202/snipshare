export type SnippetForm = {
  title: string;
  description: string;
  code: string;
  filters: string[];
  language: {
    languageName: string;
    version: string;
  };
};
