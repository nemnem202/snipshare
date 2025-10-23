import type { ReactNode } from "react";
import "../style/components/headline.css";

export default function Headline({ content }: { content: string | ReactNode }) {
  return (
    <div className="headline-container">
      <h1>{content}</h1>
    </div>
  );
}
