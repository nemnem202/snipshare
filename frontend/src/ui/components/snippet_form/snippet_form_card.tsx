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
import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import useGetSession from "../../../hooks/get_session";
import { SnippetFormContext } from "./snippet_card_modal";
import SnippetFormAccordion from "./snippet_form_accordion";

export default function SnippetFormCard({
  setClosed,
}: {
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const snippetFormContext = useContext(SnippetFormContext);
  const session = useGetSession();
  if (!snippetFormContext || !session) return;

  const { snippetForm, setSnippetForm } = snippetFormContext;
  return (
    snippetForm && (
      <Card className="p-2">
        <CardHeader className="p-0 text-muted-foreground text-sm">_{session}</CardHeader>
        <CardContent>
          <Card className="w-[500px] border-none shadow-none">
            <CardHeader>
              <div className="flex justify-between items-top w-full gap-5">
                <div className="w-full">
                  <CardTitle className="w-full">
                    <EditableTextArea defaultValue={snippetForm.title} />
                  </CardTitle>
                  <CardDescription className="w-full">
                    <EditableTextArea defaultValue={snippetForm.description ?? "Description"} />
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  <FaEye className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                  <FaLink className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                  <FaSave className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SnippetFormAccordion setClosed={() => {}} />
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="p-1 gap-3">
          {snippetForm.filters.map((f) => (
            <div className="text-sm bold italic opacity-70 cursor-pointer hover:opacity-100 animate">
              #{f}
            </div>
          ))}
        </CardFooter>
      </Card>
    )
  );
}
