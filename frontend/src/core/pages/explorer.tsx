import Headline from "../../ui/components/headline";
import Searchbar from "../../ui/components/searchbar";
import SnippetPage from "../../ui/components/snippet_page";
import SortSelectGroup from "../../ui/components/sort_select_group";
import Tag from "../../ui/components/tag";

export default function Explorer() {
  return (
    <div className="main-container">
      <Headline
        content={
          <div>
            Découvrez les snippets partagés par la communauté. <br />
            Inspirez-vous, likez et partagez vos propres trouvailles.
          </div>
        }
      />
      <div className="flex flex-col items-center gap-2 h-[100px]">
        <Searchbar />
        <div className="h-5 flex gap-2">
          {Array.from({ length: 6 }).map((_, id) => (
            <Tag content={`Tag ${id}`} key={id} />
          ))}
        </div>
      </div>
      <SortSelectGroup />
      <div className="flex gap-5 w-full h-[50px]"></div>
      <SnippetPage />
    </div>
  );
}
