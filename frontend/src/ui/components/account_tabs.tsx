import { Button } from "../assets/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../assets/tabs";
import { FaPlus } from "react-icons/fa";
import SnippetPage from "./snippet_page";
import SortSelectGroup from "./sort_select_group";

export default function AccountTabs() {
  return (
    <Tabs defaultValue="personals" className="w-full flex flex-col items-center gap-[32px] ">
      <div className="h-[100px]">
        <TabsList className="w-fit">
          <TabsTrigger value="personals">Personnels</TabsTrigger>
          <TabsTrigger value="liked">Likés</TabsTrigger>
        </TabsList>
      </div>

      <SortSelectGroup />
      <TabsContent value="personals" className="w-full flex flex-col items-center gap-[32px] !mt-0">
        <div className="flex w-full h-[50px]">
          <Button variant="ghost">
            <FaPlus /> Snippet
          </Button>
        </div>
        <SnippetPage />
      </TabsContent>
      <TabsContent value="liked" className="w-full flex flex-col items-center gap-[32px] !mt-0">
        <div className="flex gap-[32px] w-full h-[50px]"></div>
        <SnippetPage />
      </TabsContent>
    </Tabs>
  );
}
