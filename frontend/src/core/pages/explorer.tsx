import { useContext, useEffect, useState } from "react";
import Headline from "../../ui/components/headline";
import Searchbar from "../../ui/components/searchbar";
import SnippetPage from "../../ui/components/snippet_page";
import SortSelectGroup from "../../ui/components/sort_select_group";
import Tag from "../../ui/components/tag";
import FiltersProvider, { FilterContext } from "../../provider/filters_provider";

function SearchBarContainer() {
  const filtersContext = useContext(FilterContext);
  if (!filtersContext) return;
  return (
    <div className="flex flex-col items-center gap-2 h-[100px]">
      <Searchbar />
      <div className="h-5 flex gap-2">
        {filtersContext.filters.tags &&
          filtersContext.filters.tags.map((tag, index) => <Tag content={tag} key={index} />)}
      </div>
    </div>
  );
}

export default function Explorer() {
  return (
    <div className="main-container">
      <div className="h-[250px] pt-10 flex w-full justify-center">
        <Headline
          content={
            <div>
              Découvrez les snippets partagés par la communauté. <br />
              Inspirez-vous, likez et partagez vos propres trouvailles.
            </div>
          }
        />
      </div>

      <FiltersProvider>
        <SearchBarContainer />
        <SortSelectGroup />
        <div className="flex gap-5 w-full h-[50px]"></div>
        <SnippetPage forPrivate={false} />
      </FiltersProvider>
    </div>
  );
}
