import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { SnippetForm } from "../../../types/general/snippetForm";
import { Dialog, DialogContent, DialogTitle } from "../../assets/dialog";
import SnippetFormCard from "./snippet_form_card";
import { Custom } from "../../../lib/logger";
import { defaultSnippetForm } from "../../../config/defaultSnippetForm";
import type { ExplorerSnippet } from "../../../types/general/explorersnippet";

export const SnippetFormContext = createContext<{
  snippetForm: SnippetForm | null;
  setSnippetForm: Dispatch<SetStateAction<SnippetForm>>;
} | null>(null);

export function SnippetProvider({
  children,
  defaultSnippet,
}: {
  children: React.ReactNode;
  defaultSnippet?: SnippetForm;
}) {
  const [snippetForm, setSnippetForm] = useState<SnippetForm>(defaultSnippet ?? defaultSnippetForm);

  useEffect(() => {
    Custom.log("Snippet Form update", snippetForm);
  }, [snippetForm]);

  return (
    <SnippetFormContext.Provider value={{ snippetForm, setSnippetForm }}>
      {children}
    </SnippetFormContext.Provider>
  );
}

export default function SnippetCardModal({
  open,
  setOpen,
  defaultSnippet,
  isAnUpdate = false,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultSnippet?: ExplorerSnippet;
  isAnUpdate?: false | number;
}) {
  let convertedDefaultSnippet: SnippetForm | undefined = undefined;
  if (defaultSnippet) {
    convertedDefaultSnippet = {
      code: defaultSnippet.code,
      description: defaultSnippet.description ?? "",
      filters: defaultSnippet.filters.map((f) => f.hashtagName),
      language: defaultSnippet.language,
      private_url: !!defaultSnippet.private_url,
      title: defaultSnippet.title,
      visibility: defaultSnippet.visibility ? true : false,
    };
  }

  return (
    <SnippetProvider defaultSnippet={convertedDefaultSnippet}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <SnippetFormCard isAnUpdate={isAnUpdate} />
        </DialogContent>
      </Dialog>
    </SnippetProvider>
  );
}
