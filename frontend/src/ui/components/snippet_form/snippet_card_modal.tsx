import { useContext, useState } from "react";
import type { SnippetForm } from "../../../types/general/snippetForm";
import { Dialog, DialogContent, DialogTitle } from "../../assets/dialog";
import SnippetFormCard from "./snippet_form_card";

export default function SnippetCardModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [snippet, setSnippet] = useState<SnippetForm>({
    code: "",
    title: "New snippet",
    description: "",
    filters: [],
    language: {
      languageName: "",
      version: "",
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle>Nouveau snippet</DialogTitle>
      <DialogContent>
        <SnippetFormCard setClosed={() => {}} snippet={snippet} setSnippet={setSnippet} />
      </DialogContent>
    </Dialog>
  );
}
