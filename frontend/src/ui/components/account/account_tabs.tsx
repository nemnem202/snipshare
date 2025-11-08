import { Button } from "../../assets/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../assets/tabs";
import { FaPlus } from "react-icons/fa";
import { useContext, useState } from "react";
import { FilterContext } from "../../../provider/filters_provider";
import type { ExplorerSnippet } from "../../../types/general/explorersnippet";
import SnippetCardModal from "../snippet_form/snippet_card_modal";
import SortSelectGroup from "../nav/sort_select_group";
import SnippetPage from "../snippet/snippet_page";

export default function AccountTabs() {
  const filtersContext = useContext(FilterContext);
  const [tabsValue, setTabsValue] = useState<"personals" | "liked">("personals");
  const [snippetModalOpen, setSnippetModalOpen] = useState<boolean>(false);
  if (!filtersContext) return;

  const handleTabsChange = (tabsValue: string) => {
    if (tabsValue === "personals") {
      filtersContext.setFilters((prev) => ({ ...prev, madeByUser: true }));
      setTabsValue("personals");
    } else {
      filtersContext.setFilters((prev) => ({ ...prev, madeByUser: false }));
      setTabsValue("liked");
    }
  };

  const addSnippet = () => {
    if (tabsValue !== "personals") return;
    setSnippetModalOpen(true);
  };
  return (
    <>
      <Tabs
        defaultValue={tabsValue}
        className="w-full flex flex-col items-center gap-[32px] "
        onValueChange={handleTabsChange}
      >
        <div className="h-[100px]">
          <TabsList className="w-fit">
            <TabsTrigger value="personals">Personnels</TabsTrigger>
            <TabsTrigger value="liked">Likés</TabsTrigger>
          </TabsList>
        </div>

        <SortSelectGroup />
        <TabsContent
          value="personals"
          className="w-full flex flex-col items-center gap-[32px] !mt-0"
        >
          <div className="flex w-full h-[50px]">
            <Button variant="ghost" onClick={addSnippet}>
              <FaPlus /> Snippet
            </Button>
          </div>
          <SnippetPage forPrivate={true} />
        </TabsContent>
        <TabsContent value="liked" className="w-full flex flex-col items-center gap-[32px] !mt-0">
          <div className="flex gap-[32px] w-full h-[50px]"></div>
          <SnippetPage forPrivate={true} />
        </TabsContent>
      </Tabs>

      <SnippetCardModal open={snippetModalOpen} setOpen={setSnippetModalOpen} />
    </>
  );
}
