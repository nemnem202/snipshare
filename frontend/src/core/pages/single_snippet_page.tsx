import SnippetCard from "../../ui/components/snippet_card";

export default function SingleSnippetPage() {
  return (
    <div className="main-container">
      <SnippetCard editable={false} setClosed={() => {}} />
    </div>
  );
}
