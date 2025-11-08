import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../assets/card";
import SnippetAccordion from "./snippet_accordion";
import { FaEye, FaPen, FaRegCopy } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import EditableTextArea from "../items/editable_textarea";
import { useContext, useState } from "react";
import { FilterContext } from "../../../provider/filters_provider";
import { useSnippet } from "./snippet_container";
import { SessionContext } from "../../../provider/session_provider";
import useGetSession from "../../../hooks/get_session";
import SnippetCardModal from "../snippet_form/snippet_card_modal";
import Fetcher from "../../../lib/fetcher";
import { Custom } from "../../../lib/logger";
import Toaster from "../../../lib/toaster";

export default function SnippetCard({
  setClosed,
}: {
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { snippet, setSnippet } = useSnippet();
  const filtersContext = useContext(FilterContext);
  const session = useGetSession();
  const [snippetModalOpen, setSnippetModalOpen] = useState<boolean>(false);
  if (!filtersContext) return;

  const copyPrivatUrl = async () => {
    if (!snippet) return;

    const privateUrl = await Fetcher.get<{ url: string }>(
      "/snippet/unref/snippetId/" + snippet.code_snippet
    );

    Custom.log("private url", privateUrl);

    if ("success" in privateUrl) return;

    await navigator.clipboard.writeText(privateUrl.url);

    Toaster.toastServer({ message: "Lien privé copié dans le presse papier !", success: true });
  };

  return (
    snippet && (
      <>
        {" "}
        <Card className="p-2">
          <CardHeader className=" p-0 w-full">
            <div className="flex justify-between w-full px-1">
              <div className="text-muted-foreground text-sm w-min">_{snippet.user.username}</div>
              <div className="flex gap-2 items-center">
                {snippet.user.username === session && (
                  <>
                    {snippet.private_url && (
                      <FaRegCopy
                        className="text-muted-foreground animate cursor-pointer text-sm w-min hover:text-secondary"
                        onClick={copyPrivatUrl}
                      />
                    )}
                    <FaPen
                      onClick={() => setSnippetModalOpen(true)}
                      className="text-muted-foreground text-sm w-min hover:text-secondary animate cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Card className="w-[500px] border-none shadow-none">
              <CardHeader>
                <div className="flex justify-between items-top w-full gap-5">
                  <div className="w-full">
                    <CardTitle className="w-full">{snippet.title}</CardTitle>
                    <CardDescription className="w-full">{snippet.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SnippetAccordion setClosed={setClosed} />
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="p-1 gap-3">
            {snippet.filters.map((f) => (
              <div
                className="text-sm bold italic opacity-70 cursor-pointer hover:opacity-100 animate"
                onClick={() =>
                  filtersContext.setFilters((prev) => ({ ...prev, tags: [f.hashtagName] }))
                }
              >
                #{f.hashtagName}
              </div>
            ))}
          </CardFooter>
        </Card>
        <SnippetCardModal
          open={snippetModalOpen}
          setOpen={setSnippetModalOpen}
          defaultSnippet={snippet}
          isAnUpdate={snippet.code_snippet}
        />
      </>
    )
  );
}
