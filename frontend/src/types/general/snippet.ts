export type Snippet = {
  code_snippet: number;
  private_url: string | null;
  title: string;
  code: string;
  visibility: boolean | null;
  description: string | null;
  date: Date;
  user_id: number;
  languageName: string;
};
