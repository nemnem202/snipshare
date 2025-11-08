import { useContext, useEffect, useState } from "react";
import Headline from "../../ui/components/items/headline";
import Searchbar from "../../ui/components/explorer/searchbar";
import Tag from "../../ui/components/items/tag";
import FiltersProvider, { FilterContext } from "../../provider/filters_provider";
import SortSelectGroup from "../../ui/components/nav/sort_select_group";
import SnippetPage from "../../ui/components/snippet/snippet_page";

function SearchBarContainer() {
  const filtersContext = useContext(FilterContext);
  if (!filtersContext) return;
  return (
    <div className="flex flex-col items-center gap-2 min-h-[100px]">
      <Searchbar />
      <div className=" flex gap-2 max-w-[700px] flex-wrap items center justify-center">
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
