import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../assets/card";
import { FaEye, FaPlus } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import EditableTextArea from "../items/editable_textarea";
import type { SnippetForm } from "../../../types/general/snippetForm";
import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import useGetSession from "../../../hooks/get_session";
import { SnippetFormContext } from "./snippet_card_modal";
import SnippetFormAccordion from "./snippet_form_accordion";
import { Button } from "../../assets/button";

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
                    <EditableTextArea
                      defaultValue={snippetForm.title}
                      width={100}
                      onValueChange={(value) =>
                        setSnippetForm((prev) => ({ ...prev, title: value }))
                      }
                    />
                  </CardTitle>
                  <div className="h-2"></div>
                  <CardDescription className="w-full">
                    <EditableTextArea
                      width={100}
                      defaultValue={snippetForm.description ?? "Description"}
                      onValueChange={(value) =>
                        setSnippetForm((prev) => ({ ...prev, description: value }))
                      }
                    />
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  <FaEye
                    className={`${
                      snippetForm.visibility ? "text-primary" : "text-muted-foreground"
                    }  transition-colors cursor-pointer hover:opacity-70 text-xl`}
                    onClick={() =>
                      setSnippetForm((prev) => ({ ...prev, visibility: !snippetForm.visibility }))
                    }
                  />
                  <FaLink
                    className={`${
                      snippetForm.private_url ? "text-primary" : "text-muted-foreground"
                    }  transition-colors cursor-pointer hover:opacity-70 text-xl`}
                    onClick={() =>
                      setSnippetForm((prev) => ({ ...prev, private_url: !snippetForm.private_url }))
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SnippetFormAccordion setClosed={() => {}} />
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="p-1 gap-3">
          <div className="text-sm bold italic opacity-70 cursor-pointer hover:opacity-100 animate">
            <EditableTextArea
              width={120}
              defaultValue={snippetForm.filters.map((f) => `${f}`).join(" ")}
              onValueChange={(value) =>
                setSnippetForm((prev) => ({
                  ...prev,
                  filters: value.split(" ").map((e) => (e.startsWith("#") ? e.slice(1) : e)),
                }))
              }
            ></EditableTextArea>
          </div>
        </CardFooter>
      </Card>
    )
  );
}
