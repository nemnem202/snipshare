import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../assets/card";
import SnippetAccordion from "./snippet_accordion";
import { FaEye } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import EditableTextArea from "./editable_textarea";
import { useSnippet } from "./snippet_container";

export default function SnippetCard({
  setClosed,
  editable = true,
}: {
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
  editable?: boolean;
}) {
  const { snippet, setSnippet } = useSnippet();

  return (
    snippet && (
      <Card className="p-2">
        <CardHeader className="p-0 text-muted-foreground text-sm">
          _{snippet.user.username}
        </CardHeader>
        <CardContent>
          <Card className="w-[500px] border-none shadow-none">
            <CardHeader>
              <div className="flex justify-between items-top w-full gap-5">
                <div className="w-full">
                  <CardTitle className="w-full">
                    {editable ? <EditableTextArea defaultValue={snippet.title} /> : snippet.title}
                  </CardTitle>
                  <CardDescription className="w-full">
                    {editable ? (
                      <EditableTextArea defaultValue={snippet.description ?? ""} />
                    ) : (
                      snippet.description ?? ""
                    )}
                  </CardDescription>
                </div>
                {editable && (
                  <div className="flex gap-2">
                    <FaEye className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                    <FaLink className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                    <FaSave className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <SnippetAccordion setClosed={setClosed} />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    )
  );
}
