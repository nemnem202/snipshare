import { useState } from "react";
import CommentCard from "./comment_card";
import SnippetCard from "./snippet_card";

export default function SnippetContainer({ editables }: { editables: boolean }) {
  const [closed, setClosed] = useState(true);
  return (
    <div className="flex gap-3">
      <SnippetCard setClosed={setClosed} editable={editables} />
      <CommentCard closed={closed} />
    </div>
  );
}
