export type ExplorerComment = {
  user: {
    username: string;
  };
} & {
  userId: number;
  snippetId: number;
  content: string;
  commentDate: Date;
};
