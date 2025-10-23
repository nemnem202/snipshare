import Headline from "../../ui/components/headline";
import LanguageSelect from "../../ui/components/language_select";
import Searchbar from "../../ui/components/searchbar";
import SortingSelect from "../../ui/components/sorting_select";

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
      <Searchbar />
      <div className="flex gap-5">
        <SortingSelect />
        <LanguageSelect />
      </div>
    </>
  );
}
