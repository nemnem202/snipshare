import Headline from "../../ui/components/headline";
import LanguageSelect from "../../ui/components/language_select";
import Searchbar from "../../ui/components/searchbar";
import SortingSelect from "../../ui/components/sorting_select";
import Tag from "../../ui/components/tag";

export default function Explorer() {
  return (
    <>
      <Headline
        content={
          <div>
            Découvrez les snippets partagés par la communauté. <br />
            Inspirez-vous, likez et partagez vos propres trouvailles.
          </div>
        }
      />
      <div className="flex flex-col items-center gap-2">
        <Searchbar />
        <div className="h-5 flex gap-2">
          {Array.from({ length: 6 }).map((_, id) => (
            <Tag content={`Tag ${id}`} key={id} />
          ))}
        </div>
      </div>
      <div className="flex gap-5">
        <SortingSelect />
        <LanguageSelect />
      </div>
    </>
  );
}
