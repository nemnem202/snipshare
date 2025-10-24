import { useState } from "react";
import CommentCard from "./comment_card";
import SnippetCard from "./snippet_card";

export default function SnippetContainer() {
  const [closed, setClosed] = useState(true);
  return (
    <div className="flex gap-3">
      <SnippetCard setClosed={setClosed} />
      <CommentCard closed={closed} />
    </div>
  );
}
