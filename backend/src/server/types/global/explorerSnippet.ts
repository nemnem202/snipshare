export type ExplorerSnippet = {
  likes: boolean;
  language: {
    language: string;
    id: number;
    version: string;
    aliases: string[];
    runtime: string | null;
  };
  user: {
    username: string;
  };
  filters: {
    snippetId: number;
    hashtagName: string;
  }[];
  _count: {
    likes: number;
  };
  code_snippet: number;
  private_url: string | null;
  title: string;
  code: string;
  visibility: boolean | null;
  description: string | null;
  date: Date;
  user_id: number;
  langageId: number;
};
