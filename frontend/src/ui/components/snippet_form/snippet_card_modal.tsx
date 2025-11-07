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

export const SnippetFormContext = createContext<{
  snippetForm: SnippetForm | null;
  setSnippetForm: Dispatch<SetStateAction<SnippetForm>>;
} | null>(null);

export function SnippetProvider({ children }: { children: React.ReactNode }) {
  const [snippetForm, setSnippetForm] = useState<SnippetForm>(defaultSnippetForm);

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
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <SnippetProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <SnippetFormCard setClosed={() => {}} />
        </DialogContent>
      </Dialog>
    </SnippetProvider>
  );
}
