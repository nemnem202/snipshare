import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../assets/card";
import { FaEye } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import EditableTextArea from "../items/editable_textarea";
import type { SnippetForm } from "../../../types/general/snippetForm";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../assets/accordion";
import useGetSession from "../../../hooks/get_session";
import Editor from "react-simple-code-editor";
import { Button } from "../../assets/button";
import { Spinner } from "../../assets/spinner";

export default function SnippetFormCard({
  setClosed,
  snippet,
  setSnippet,
}: {
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
  editable?: boolean;
  snippet: SnippetForm;
  setSnippet: Dispatch<SetStateAction<SnippetForm>>;
}) {
  const session = useGetSession();
  const [code, setCode] = useState("");
  const lines = code.split("\n");

  if (!session) return;

  useEffect(() => {
    setCode(snippet.code);
  }, [snippet]);
  return (
    snippet && (
      <Card className="p-2">
        <CardHeader className="p-0 text-muted-foreground text-sm">_{session}</CardHeader>
        <CardContent>
          <Card className="w-[500px] border-none shadow-none">
            <CardHeader>
              <div className="flex justify-between items-top w-full gap-5">
                <div className="w-full">
                  <CardTitle className="w-full">
                    <EditableTextArea defaultValue={snippet.title} />
                  </CardTitle>
                  <CardDescription className="w-full">
                    <EditableTextArea defaultValue={snippet.description ?? ""} />
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  <FaEye className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                  <FaLink className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                  <FaSave className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                </div>
              </div>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </CardContent>
        <CardFooter className="p-1 gap-3">
          {snippet.filters.map((f) => (
            <div className="text-sm bold italic opacity-70 cursor-pointer hover:opacity-100 animate">
              #{f}
            </div>
          ))}
        </CardFooter>
      </Card>
    )
  );
}
